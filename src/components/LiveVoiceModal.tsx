import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, X, AlertCircle, RefreshCw, Radio, Sparkles } from 'lucide-react';

interface LiveVoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentWeek: string;
  currentActivity: string;
}

export const LiveVoiceModal: React.FC<LiveVoiceModalProps> = ({
  isOpen,
  onClose,
  currentWeek,
  currentActivity,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isModelSpeaking, setIsModelSpeaking] = useState(false);
  const [transcriptHistory, setTranscriptHistory] = useState<Array<{ sender: 'user' | 'model'; text: string }>>([
    {
      sender: 'model',
      text: 'Connexion en direct avec le Compagnon oral. Parlez naturellement en français dans votre micro...',
    },
  ]);

  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextPlayTimeRef = useRef<number>(0);

  // Convert Float32Array from microphone to 16kHz 16-bit PCM Base64
  const floatTo16BitPCMBase64 = (float32Array: Float32Array): string => {
    const buffer = new ArrayBuffer(float32Array.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true); // Little endian
    }
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Play incoming 24kHz PCM chunks
  const playPCMChunk = (base64Audio: string) => {
    if (!outputAudioCtxRef.current) {
      outputAudioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 24000,
      });
    }
    const ctx = outputAudioCtxRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    try {
      const binaryString = atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const pcm16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(pcm16.length);
      for (let i = 0; i < pcm16.length; i++) {
        float32[i] = pcm16[i] / 32768.0;
      }

      const audioBuffer = ctx.createBuffer(1, float32.length, 24000);
      audioBuffer.copyToChannel(float32, 0);

      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      const currentTime = ctx.currentTime;
      if (nextPlayTimeRef.current < currentTime) {
        nextPlayTimeRef.current = currentTime;
      }

      source.start(nextPlayTimeRef.current);
      nextPlayTimeRef.current += audioBuffer.duration;

      setIsModelSpeaking(true);
      source.onended = () => {
        if (ctx.currentTime >= nextPlayTimeRef.current - 0.05) {
          setIsModelSpeaking(false);
        }
      };
    } catch (e) {
      console.error('Error decoding audio chunk', e);
    }
  };

  const startSession = async () => {
    setError(null);
    setIsConnecting(true);

    try {
      // 1. Check microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });
      streamRef.current = stream;

      // 2. Setup AudioContexts
      inputAudioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 16000,
      });
      outputAudioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({
        sampleRate: 24000,
      });

      // 3. Connect WebSocket to /live
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/live`;
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        setIsConnected(true);
        setIsConnecting(false);
        // Send initial context
        ws.send(
          JSON.stringify({
            text: `Bonjour. Je suis un étudiant de licence en littérature française à l'Université de Catane. Nous travaillons sur la semaine ${currentWeek} et l'activité ${currentActivity}. Parle-moi brièvement à l'oral en français.`,
          })
        );
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.error) {
            setError(msg.error);
          }
          if (msg.audio) {
            playPCMChunk(msg.audio);
          }
          if (msg.text) {
            setTranscriptHistory((prev) => [
              ...prev.slice(-6),
              { sender: 'model', text: msg.text },
            ]);
          }
          if (msg.interrupted) {
            // Model was interrupted by student speaking, reset audio schedule
            if (outputAudioCtxRef.current) {
              nextPlayTimeRef.current = outputAudioCtxRef.current.currentTime;
            }
            setIsModelSpeaking(false);
          }
        } catch (e) {
          console.error('Error parsing live ws message:', e);
        }
      };

      ws.onerror = (_err) => {
        setError('Impossible d\'établir la connexion en temps réel avec le serveur.');
        setIsConnecting(false);
      };

      ws.onclose = () => {
        setIsConnected(false);
        setIsConnecting(false);
      };

      // 4. Hook microphone capture
      const micSource = inputAudioCtxRef.current.createMediaStreamSource(stream);
      const processor = inputAudioCtxRef.current.createScriptProcessor(4096, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (e) => {
        if (isMuted || ws.readyState !== WebSocket.OPEN) return;

        const inputData = e.inputBuffer.getChannelData(0);
        // Calculate audio volume level for visualizer
        let sum = 0;
        for (let i = 0; i < inputData.length; i++) {
          sum += inputData[i] * inputData[i];
        }
        const rms = Math.sqrt(sum / inputData.length);
        setAudioLevel(Math.min(100, Math.round(rms * 250)));

        if (rms > 0.01) {
          const base64Audio = floatTo16BitPCMBase64(inputData);
          ws.send(JSON.stringify({ audio: base64Audio }));
        }
      };

      micSource.connect(processor);
      processor.connect(inputAudioCtxRef.current.destination);
    } catch (err: any) {
      console.error('Failed to start Live Voice session:', err);
      setError(err?.message || 'Accès au microphone refusé ou erreur réseau.');
      setIsConnecting(false);
    }
  };

  const stopSession = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close();
      inputAudioCtxRef.current = null;
    }
    if (outputAudioCtxRef.current) {
      outputAudioCtxRef.current.close();
      outputAudioCtxRef.current = null;
    }
    setIsConnected(false);
    setIsConnecting(false);
    setIsModelSpeaking(false);
    setAudioLevel(0);
  };

  useEffect(() => {
    if (isOpen) {
      startSession();
    } else {
      stopSession();
    }
    return () => {
      stopSession();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-900 text-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 -ml-4" />
            <div>
              <h3 className="font-semibold text-base leading-tight flex items-center gap-2">
                <span>Salon Oral en Direct (Live API)</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  gemini-3.8-live
                </span>
              </h3>
              <p className="text-xs text-stone-400">
                Conversation vocale fluide et instantanée avec le Compagnon DISUM
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopSession();
              onClose();
            }}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex flex-col items-center justify-center space-y-6">
          {error ? (
            <div className="w-full p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
              <div className="space-y-2">
                <p className="font-medium">Erreur de connexion vocale en direct</p>
                <p className="text-xs text-rose-700">{error}</p>
                <div className="pt-1 flex gap-2">
                  <button
                    onClick={startSession}
                    className="inline-flex items-center gap-1.5 px-3 py-1 text-xs rounded-lg bg-rose-600 text-white hover:bg-rose-700 font-medium transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Réessayer
                  </button>
                  <button
                    onClick={onClose}
                    className="px-3 py-1 text-xs rounded-lg bg-stone-200 text-stone-700 hover:bg-stone-300 font-medium transition-colors"
                  >
                    Revenir au mode écrit avec synthèse vocale
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Central Pulsing Sphere Animation */}
              <div className="relative my-4 flex items-center justify-center">
                {/* Glow rings */}
                <div
                  className={`absolute rounded-full transition-all duration-300 ${
                    isModelSpeaking
                      ? 'w-48 h-48 bg-amber-400/20 animate-pulse'
                      : audioLevel > 5
                      ? 'w-48 h-48 bg-emerald-400/20'
                      : 'w-36 h-36 bg-stone-100'
                  }`}
                />
                <div
                  className={`absolute rounded-full transition-all duration-200 ${
                    isModelSpeaking
                      ? 'w-36 h-36 bg-amber-500/30'
                      : audioLevel > 5
                      ? 'w-36 h-36 bg-emerald-500/30'
                      : 'w-28 h-28 bg-stone-200'
                  }`}
                />
                {/* Center Core */}
                <div
                  className={`relative w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-transform duration-150 ${
                    isModelSpeaking
                      ? 'bg-gradient-to-tr from-amber-600 to-amber-400 text-white scale-110'
                      : audioLevel > 5
                      ? 'bg-gradient-to-tr from-emerald-600 to-teal-400 text-white scale-105'
                      : 'bg-stone-800 text-stone-100'
                  }`}
                >
                  {isModelSpeaking ? (
                    <Volume2 className="w-10 h-10 animate-bounce" />
                  ) : (
                    <Mic className="w-10 h-10" />
                  )}
                </div>
              </div>

              {/* Status info */}
              <div className="text-center space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-700">
                  <Radio className="w-3.5 h-3.5 text-emerald-600" />
                  <span>
                    {isConnecting
                      ? 'Connexion en cours...'
                      : isModelSpeaking
                      ? 'Le Compagnon parle...'
                      : isMuted
                      ? 'Microphone coupé'
                      : 'À vous de parler en français (le Compagnon vous écoute)'}
                  </span>
                </div>
                <p className="text-xs text-stone-500">
                  Semaine {currentWeek} • Activité {currentActivity} • Parlez avec vos propres mots (niveau B1-B2)
                </p>
              </div>

              {/* Transcript feed */}
              <div className="w-full max-h-36 overflow-y-auto p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-2">
                {transcriptHistory.map((item, idx) => (
                  <div
                    key={idx}
                    className={`flex gap-2 ${item.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg p-2 ${
                        item.sender === 'user'
                          ? 'bg-stone-800 text-white'
                          : 'bg-white border border-stone-200 text-stone-800 shadow-2xs'
                      }`}
                    >
                      <span className="font-semibold block text-[10px] text-stone-400 uppercase mb-0.5">
                        {item.sender === 'user' ? 'Vous' : 'Compagnon Oral'}
                      </span>
                      {item.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className={`p-3 rounded-full border shadow-sm transition-all ${
                    isMuted
                      ? 'bg-rose-50 text-rose-600 border-rose-300 hover:bg-rose-100'
                      : 'bg-stone-100 text-stone-700 border-stone-300 hover:bg-stone-200'
                  }`}
                  title={isMuted ? 'Activer le micro' : 'Couper le micro'}
                >
                  {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    stopSession();
                    onClose();
                  }}
                  className="px-5 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-sm font-medium shadow-sm transition-colors"
                >
                  Quitter le mode direct
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 text-center text-[11px] text-stone-500">
          « L'IA propose, le texte résiste, le lecteur décide. » • Audio bidirectionnel 16/24 kHz
        </div>
      </div>
    </div>
  );
};
