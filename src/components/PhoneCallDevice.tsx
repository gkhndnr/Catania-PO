import React, { useState, useRef, useEffect } from 'react';
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  Minimize2,
  Maximize2,
  Radio,
  Sparkles,
  Loader2,
  Check,
} from 'lucide-react';

interface PhoneCallDeviceProps {
  isOpen: boolean;
  onToggle: () => void;
  onSendMessage: (msg: string) => void;
  isLoading: boolean;
  currentWeek: string;
  currentActivity: string;
  lastAssistantMessage?: string;
}

export const PhoneCallDevice: React.FC<PhoneCallDeviceProps> = ({
  isOpen,
  onToggle,
  onSendMessage,
  isLoading,
  currentWeek,
  currentActivity,
  lastAssistantMessage,
}) => {
  const [isInCall, setIsInCall] = useState(false);
  const [isPushToTalkActive, setIsPushToTalkActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [soundLevel, setSoundLevel] = useState(0);
  const [isCompanionSpeaking, setIsCompanionSpeaking] = useState(false);
  const [audioSpeed, setAudioSpeed] = useState<'normal' | 'slow'>('slow'); // 0.85x for B1-B2 students

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const callTimerRef = useRef<any>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Call duration counter
  useEffect(() => {
    if (isInCall) {
      callTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
      setCallDuration(0);
    }
    return () => {
      if (callTimerRef.current) clearInterval(callTimerRef.current);
    };
  }, [isInCall]);

  // Format call seconds to mm:ss
  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Set up Speech Recognition for French
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'fr-FR';

      recognition.onresult = (event: any) => {
        let text = '';
        for (let i = 0; i < event.results.length; i++) {
          text += event.results[i][0].transcript;
        }
        setLiveTranscript(text);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition warning:', event.error);
        if (event.error !== 'no-speech') {
          setIsPushToTalkActive(false);
        }
      };

      recognition.onend = () => {
        // Automatically restart if user is still in push-to-talk mode
        if (isPushToTalkActive) {
          try {
            recognition.start();
          } catch (_) {}
        }
      };

      recognitionRef.current = recognition;
    }
  }, [isPushToTalkActive]);

  // When last assistant message changes and we are in call, speak it automatically!
  useEffect(() => {
    if (isInCall && lastAssistantMessage && !isLoading) {
      speakText(lastAssistantMessage);
    }
  }, [lastAssistantMessage, isLoading, isInCall]);

  const speakText = async (text: string) => {
    if (!text || isMuted) return;

    // Clean markdown
    const clean = text.replace(/[*_#`[\]()]/g, ' ').replace(/\s+/g, ' ').trim();
    if (!clean) return;

    setIsCompanionSpeaking(true);

    try {
      // Call server TTS
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: clean,
          voice: 'Zephyr',
          style: 'Clair, bienveillant, débit mesuré pour étudiant de Catane',
        }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.audio) {
          const audio = new Audio(`data:audio/wav;base64,${data.audio}`);
          audioPlayerRef.current = audio;
          audio.playbackRate = audioSpeed === 'slow' ? 0.85 : 1.0;
          audio.onended = () => {
            setIsCompanionSpeaking(false);
            audioPlayerRef.current = null;
          };
          audio.onerror = () => {
            fallbackSpeech(clean);
          };
          await audio.play();
          return;
        }
      }
      fallbackSpeech(clean);
    } catch (_) {
      fallbackSpeech(clean);
    }
  };

  const fallbackSpeech = (text: string) => {
    if (!('speechSynthesis' in window)) {
      setIsCompanionSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = audioSpeed === 'slow' ? 0.85 : 1.0;
    utterance.onend = () => setIsCompanionSpeaking(false);
    utterance.onerror = () => setIsCompanionSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  // Start call
  const startCall = () => {
    setIsInCall(true);
    setLiveTranscript('');
    // Speak greeting
    speakText(
      `Bonjour ! Je t'écoute pour la semaine ${currentWeek}. Prends la parole en français en appuyant sur le bouton.`
    );
  };

  // End call
  const endCall = () => {
    stopRecording();
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsInCall(false);
    setIsCompanionSpeaking(false);
    setLiveTranscript('');
  };

  // Start push-to-talk recording
  const startRecording = () => {
    if (!isInCall) {
      setIsInCall(true);
    }

    // Stop bot playback if it was talking
    if (audioPlayerRef.current) {
      audioPlayerRef.current.pause();
      audioPlayerRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsCompanionSpeaking(false);

    setLiveTranscript('');
    setIsPushToTalkActive(true);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (_) {}
    } else {
      // Fallback: media recorder
      startMediaRecording();
    }
  };

  // Stop recording and send speech
  const stopRecording = () => {
    if (!isPushToTalkActive) return;
    setIsPushToTalkActive(false);

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (_) {}
    }

    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }

    // Send the recognized transcript
    setTimeout(() => {
      if (liveTranscript.trim()) {
        onSendMessage(liveTranscript.trim());
        setLiveTranscript('');
      }
    }, 300);
  };

  const startMediaRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      audioChunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };

      mr.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64 = (reader.result as string)?.split(',')[1];
          if (base64) {
            try {
              const res = await fetch('/api/transcribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ audioData: base64, mimeType: 'audio/webm' }),
              });
              const data = await res.json();
              if (data.text) {
                onSendMessage(data.text);
              }
            } catch (err) {
              console.error('STT fallback error:', err);
            }
          }
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach((t) => t.stop());
      };

      mr.start();
    } catch (e) {
      console.warn('Mic access error:', e);
      setIsPushToTalkActive(false);
    }
  };

  // Toggle push to talk on click (or hold)
  const handlePushToTalkClick = () => {
    if (isPushToTalkActive) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  return (
    <>
      {/* Floating Telephone Widget Button (When closed) */}
      {!isOpen && (
        <button
          onClick={onToggle}
          type="button"
          title="Ouvrir le téléphone oral (Bas-Konuş)"
          className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-4 py-3 rounded-full bg-stone-900 text-stone-100 shadow-2xl border border-stone-700 hover:bg-stone-800 transition-all hover:scale-105 group"
        >
          <div className="relative w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white">
            <Phone className="w-4 h-4 animate-bounce" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-ping" />
          </div>
          <div className="text-left">
            <span className="block text-xs font-semibold leading-tight">Téléphone Oral</span>
            <span className="block text-[10px] text-stone-400">Mode Bas-Konuş</span>
          </div>
        </button>
      )}

      {/* Realistic Telephone Device Frame */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[320px] sm:w-[350px] bg-stone-950 text-stone-100 rounded-[38px] p-3 shadow-2xl border-4 border-stone-800 ring-1 ring-black/40 animate-in slide-in-from-bottom-5 duration-200">
          {/* Phone Top Notch & Speaker */}
          <div className="flex items-center justify-between px-4 pt-1 pb-2">
            <div className="flex items-center gap-1.5 text-[10px] text-stone-400 font-mono">
              <span>DISUM</span>
              <span>•</span>
              <span>4G</span>
            </div>
            {/* Notch */}
            <div className="w-20 h-4 bg-stone-900 rounded-full flex items-center justify-center">
              <div className="w-8 h-1 bg-stone-700 rounded-full" />
            </div>
            {/* Close / Minimize phone */}
            <button
              onClick={onToggle}
              className="text-stone-400 hover:text-white p-1 rounded-full transition-colors"
              title="Fermer le téléphone"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Phone Screen Display */}
          <div className="bg-gradient-to-b from-stone-900 to-stone-950 rounded-[28px] p-4 flex flex-col items-center justify-between min-h-[380px] border border-stone-800/80">
            {/* Caller Header Card */}
            <div className="w-full text-center space-y-1">
              <div className="relative mx-auto w-16 h-16 rounded-full bg-amber-800/90 border-2 border-amber-600 flex items-center justify-center text-amber-100 font-literary text-2xl font-bold shadow-lg">
                GD
                {isInCall && (
                  <span className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-emerald-500 border-2 border-stone-900" />
                )}
              </div>
              <h3 className="font-literary text-lg font-bold text-white pt-1">
                Compagnon Oral DISUM
              </h3>
              <p className="text-[11px] text-stone-400">
                Cours de Gökhan Dinar • Catane
              </p>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-stone-800 text-stone-300">
                {isInCall ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>{formatDuration(callDuration)}</span>
                  </>
                ) : (
                  <span>Prêt pour l'appel</span>
                )}
              </div>
            </div>

            {/* Middle Screen Display: Status / Waveform / Live Transcript */}
            <div className="w-full my-3 px-2 flex flex-col items-center justify-center text-center">
              {isInCall ? (
                <>
                  {/* Visual soundwave animation */}
                  <div className="h-10 flex items-center gap-1 my-2">
                    {isCompanionSpeaking ? (
                      <>
                        <span className="w-1.5 h-6 bg-amber-500 rounded-full animate-bounce" />
                        <span className="w-1.5 h-9 bg-amber-400 rounded-full animate-bounce [animation-delay:0.1s]" />
                        <span className="w-1.5 h-7 bg-amber-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                        <span className="w-1.5 h-10 bg-amber-500 rounded-full animate-bounce [animation-delay:0.3s]" />
                        <span className="w-1.5 h-5 bg-amber-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                      </>
                    ) : isPushToTalkActive ? (
                      <>
                        <span className="w-1.5 h-8 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="w-1.5 h-10 bg-emerald-400 rounded-full animate-pulse [animation-delay:0.1s]" />
                        <span className="w-1.5 h-6 bg-emerald-300 rounded-full animate-pulse [animation-delay:0.2s]" />
                        <span className="w-1.5 h-9 bg-emerald-500 rounded-full animate-pulse [animation-delay:0.15s]" />
                      </>
                    ) : (
                      <span className="text-xs text-stone-500 italic">
                        Maintenez ou touchez « Parler » ci-dessous
                      </span>
                    )}
                  </div>

                  {/* Realtime student transcription box */}
                  <div className="w-full min-h-[50px] max-h-[85px] overflow-y-auto px-3 py-2 bg-stone-900/90 rounded-xl border border-stone-800 text-xs text-stone-200">
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-1.5 text-amber-400 text-[11px]">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Le Compagnon formule sa réponse...
                      </span>
                    ) : isCompanionSpeaking ? (
                      <span className="text-amber-300/90 italic text-[11px]">
                        « {lastAssistantMessage?.slice(0, 100)}... »
                      </span>
                    ) : liveTranscript ? (
                      <span>{liveTranscript}</span>
                    ) : (
                      <span className="text-stone-500 text-[11px]">
                        Votre voix s'affichera ici en direct...
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div className="p-3 bg-stone-900/60 rounded-xl border border-stone-800/80 text-xs text-stone-400 space-y-1">
                  <p className="font-medium text-stone-300">Entraînement oral direct</p>
                  <p className="text-[11px]">
                    Semaine {currentWeek} • Décrochez pour simuler un appel oral à voix haute.
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Keypad Controls: PUSH-TO-TALK & CALL BUTTONS */}
            <div className="w-full space-y-3 pt-1 border-t border-stone-800">
              {isInCall ? (
                <>
                  {/* MAIN PUSH-TO-TALK BUTTON ("BAS KONUŞ") */}
                  <div className="flex flex-col items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handlePushToTalkClick}
                      onMouseDown={startRecording}
                      onMouseUp={stopRecording}
                      onTouchStart={startRecording}
                      onTouchEnd={stopRecording}
                      disabled={isLoading}
                      className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95 ${
                        isPushToTalkActive
                          ? 'bg-rose-600 text-white ring-4 ring-rose-500/30 animate-pulse'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      <Mic className={`w-5 h-5 ${isPushToTalkActive ? 'animate-bounce' : ''}`} />
                      <span>
                        {isPushToTalkActive ? 'Enregistrement en cours...' : 'Bas-Konuş (Parler)'}
                      </span>
                    </button>
                    <span className="text-[10px] text-stone-400">
                      Touchez pour démarrer, touchez à nouveau pour envoyer
                    </span>
                  </div>

                  {/* Secondary in-call action buttons */}
                  <div className="flex items-center justify-between px-3 pt-1">
                    {/* Speed toggle (0.85x slow French for Italian B1-B2) */}
                    <button
                      type="button"
                      onClick={() => setAudioSpeed(audioSpeed === 'slow' ? 'normal' : 'slow')}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-mono border transition-colors ${
                        audioSpeed === 'slow'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-stone-800 text-stone-400 border-stone-700'
                      }`}
                      title="Vitesse de la voix du professeur (0.85x ralentie pour étudiants italiens)"
                    >
                      {audioSpeed === 'slow' ? 'Vitesse: 0.85x' : 'Vitesse: 1.0x'}
                    </button>

                    {/* Mute button */}
                    <button
                      type="button"
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-2 rounded-full bg-stone-800 text-stone-300 hover:text-white"
                      title={isMuted ? 'Activer le son' : 'Couper le son'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                    </button>

                    {/* Red Hangup button */}
                    <button
                      type="button"
                      onClick={endCall}
                      className="p-2.5 rounded-full bg-rose-700 hover:bg-rose-600 text-white shadow-md transition-colors"
                      title="Raccrocher l'appel"
                    >
                      <PhoneOff className="w-5 h-5" />
                    </button>
                  </div>
                </>
              ) : (
                /* Start call button (Green phone receiver) */
                <div className="flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={startCall}
                    className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2.5 shadow-lg transition-all hover:scale-[1.02]"
                  >
                    <Phone className="w-5 h-5" />
                    <span>Démarrer l'Appel Oral (Décrocher)</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
