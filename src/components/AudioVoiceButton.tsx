import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX, Loader2, Play, Square } from 'lucide-react';

interface AudioVoiceButtonProps {
  text: string;
  size?: 'sm' | 'md' | 'lg';
  voice?: 'Zephyr' | 'Kore' | 'Fenrir' | 'Puck' | 'Charon';
  label?: string;
  className?: string;
}

// In-memory cache for audio base64 to avoid redundant requests
const audioCache = new Map<string, string>();

export const AudioVoiceButton: React.FC<AudioVoiceButtonProps> = ({
  text,
  size = 'sm',
  voice = 'Zephyr',
  label,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [slowRate, setSlowRate] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
  };

  const handleSpeak = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (isPlaying) {
      stopPlayback();
      return;
    }

    // Clean plain text without markdown markers for natural speech
    const cleanText = text
      .replace(/[*_#`[\]()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    setIsLoading(true);

    try {
      // 1. Try server-side Gemini 3.8 Flash Lite TTS
      let audioBase64 = audioCache.get(cleanText);

      if (!audioBase64) {
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            text: cleanText,
            voice,
            style: 'Clair, bienveillant, débit mesuré et expressif pour étudiants italophones de niveau B1-B2',
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.audio && typeof data.audio === 'string') {
            audioBase64 = data.audio;
            audioCache.set(cleanText, data.audio);
          }
        }
      }

      if (audioBase64) {
        const audio = new Audio(`data:audio/wav;base64,${audioBase64}`);
        audioRef.current = audio;
        audio.playbackRate = slowRate ? 0.85 : 1.0;

        audio.onended = () => {
          setIsPlaying(false);
          audioRef.current = null;
        };

        audio.onerror = () => {
          fallbackWebSpeech(cleanText);
        };

        await audio.play();
        setIsPlaying(true);
        setIsLoading(false);
        return;
      }

      // If server TTS was not available, fallback to Web Speech
      fallbackWebSpeech(cleanText);
    } catch (err) {
      console.warn('TTS error, falling back to Web Speech:', err);
      fallbackWebSpeech(cleanText);
    } finally {
      setIsLoading(false);
    }
  };

  const fallbackWebSpeech = (cleanText: string) => {
    if (!('speechSynthesis' in window)) {
      setIsLoading(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'fr-FR';
    utterance.rate = slowRate ? 0.82 : 0.95; // Slightly slower for foreign language comprehension
    utterance.pitch = 1.0;

    // Pick French voice if available
    const voices = window.speechSynthesis.getVoices();
    const frVoice = voices.find((v) => v.lang.startsWith('fr') || v.name.includes('French'));
    if (frVoice) utterance.voice = frVoice;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsLoading(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsLoading(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      <button
        onClick={handleSpeak}
        disabled={isLoading}
        type="button"
        title={isPlaying ? 'Arrêter la lecture' : 'Écouter la prononciation française'}
        className={`group inline-flex items-center gap-1.5 rounded-full border transition-all duration-150 ${
          isPlaying
            ? 'bg-amber-700 text-white border-amber-800 shadow-sm animate-pulse'
            : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200 hover:border-stone-300'
        } ${
          size === 'sm'
            ? 'px-2.5 py-1 text-xs'
            : size === 'md'
            ? 'px-3 py-1.5 text-sm font-medium'
            : 'px-4 py-2 text-base font-medium'
        }`}
      >
        {isLoading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-700" />
        ) : isPlaying ? (
          <>
            <Square className="w-3.5 h-3.5 fill-current" />
            <span className="flex items-center gap-0.5">
              <span className="w-1 h-2.5 bg-white rounded-full animate-bounce"></span>
              <span className="w-1 h-3.5 bg-white rounded-full animate-bounce [animation-delay:0.15s]"></span>
              <span className="w-1 h-2 bg-white rounded-full animate-bounce [animation-delay:0.3s]"></span>
            </span>
          </>
        ) : (
          <Volume2 className="w-3.5 h-3.5 text-stone-600 group-hover:text-amber-800 transition-colors" />
        )}
        <span>{isPlaying ? 'Arrêter' : label || 'Écouter'}</span>
      </button>

      {/* Speed toggle button (0.85x slow for Italian B1-B2 students) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setSlowRate(!slowRate);
          if (audioRef.current) {
            audioRef.current.playbackRate = !slowRate ? 0.85 : 1.0;
          }
        }}
        title={slowRate ? 'Vitesse ralentie (0.85x) active' : 'Passer en vitesse ralentie (0.85x) pour mieux comprendre'}
        className={`px-1.5 py-0.5 rounded text-[10px] font-mono border transition-colors ${
          slowRate
            ? 'bg-amber-100 text-amber-900 border-amber-300 font-semibold'
            : 'bg-stone-50 text-stone-500 border-stone-200 hover:text-stone-700'
        }`}
      >
        {slowRate ? '0.85x' : '1.0x'}
      </button>
    </div>
  );
};
