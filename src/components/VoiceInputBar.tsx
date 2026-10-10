import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Send, Loader2, Sparkles, Volume2 } from 'lucide-react';

interface VoiceInputBarProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  currentActivity: string;
  currentWeek: string;
  onOpenLiveVoice: () => void;
}

export const VoiceInputBar: React.FC<VoiceInputBarProps> = ({
  onSendMessage,
  isLoading,
  currentActivity,
  currentWeek,
  onOpenLiveVoice,
}) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Init SpeechRecognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'fr-FR';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setText(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const handleToggleMic = async () => {
    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Error starting recognition:', err);
      }
    } else {
      // Fallback: Record with MediaRecorder and call /api/transcribe
      startMediaRecording();
    }
  };

  const startMediaRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setIsTranscribing(true);
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = async () => {
          const base64Data = (reader.result as string)?.split(',')[1];
          if (base64Data) {
            try {
              const res = await fetch('/api/transcribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ audioData: base64Data, mimeType: 'audio/webm' }),
              });
              const json = await res.json();
              if (json.text) {
                setText(json.text);
              }
            } catch (err) {
              console.error('Transcription API error:', err);
            }
          }
          setIsTranscribing(false);
        };
        reader.readAsDataURL(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsListening(true);
    } catch (err) {
      console.error('Media recording error:', err);
    }
  };

  const handleStopMediaRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || isLoading) return;
    onSendMessage(text.trim());
    setText('');
  };

  // Quick suggestions based on activity
  const getSuggestions = () => {
    if (currentActivity === '1') {
      return [
        'Pourriez-vous me parler de votre vision de la société ?',
        'Comment le mal du siècle se reflète-t-il dans vos écrits ?',
        'Quel rapport entretenez-vous avec l\'argent et la critique ?',
      ];
    }
    if (currentActivity === '2') {
      return [
        'Je suis prêt pour la lecture expressive du passage.',
        'Voici ma proposition de traduction en italien.',
        'Ma problématique : en quoi ce texte subvertit-il les normes ?',
      ];
    }
    if (currentActivity === '3') {
      return [
        'Pose-moi une première question sur les dates de cette semaine.',
        'Peux-tu me donner un indice avant que je réponde ?',
        'Je voudrais résumer la semaine en trois phrases.',
      ];
    }
    if (currentActivity === '4') {
      return [
        'Je ne suis pas d\'accord, et voici ma preuve textuelle :',
        'Dans le texte de 1857, Baudelaire montre précisément le contraire.',
        'La réalité sociale dément cette idée reçue.',
      ];
    }
    return [
      `Bonjour ! Nous travaillons sur la semaine ${currentWeek}.`,
      'Je choisis l\'oral blanc avec vous.',
      'Je voudrais parler avec un écrivain du programme.',
    ];
  };

  return (
    <div className="border-t border-stone-200 bg-white/95 backdrop-blur-md p-4 space-y-3">
      {/* Suggestions Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs text-stone-600 no-scrollbar">
        <span className="flex-shrink-0 text-[11px] font-semibold text-stone-400 uppercase tracking-wider flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-600" />
          Pistes orales :
        </span>
        {getSuggestions().map((sug, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSendMessage(sug)}
            className="flex-shrink-0 px-2.5 py-1 rounded-full bg-stone-100 hover:bg-amber-100 hover:text-amber-900 border border-stone-200 text-stone-700 transition-colors whitespace-nowrap"
          >
            {sug}
          </button>
        ))}
      </div>

      {/* Main input form */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        {/* Live API Voice Room Button */}
        <button
          type="button"
          onClick={onOpenLiveVoice}
          title="Ouvrir le salon vocal en direct (gemini-3.8-live)"
          className="flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-800 hover:to-amber-900 text-white text-xs font-semibold shadow-xs transition-all hover:shadow-sm"
        >
          <Volume2 className="w-4 h-4" />
          <span className="hidden sm:inline">Oral Direct</span>
        </button>

        {/* Microphone STT button */}
        <button
          type="button"
          onClick={
            mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording'
              ? handleStopMediaRecording
              : handleToggleMic
          }
          className={`flex-shrink-0 p-2.5 rounded-xl border transition-all ${
            isListening
              ? 'bg-rose-600 text-white border-rose-700 animate-pulse shadow-md'
              : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-300'
          }`}
          title={isListening ? 'Arrêter l\'enregistrement' : 'Parler au micro en français'}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Text Input */}
        <div className="relative flex-1">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              isListening
                ? 'À vous la parole en français (dictée vocale active)...'
                : isTranscribing
                ? 'Transcription audio par Gemini en cours...'
                : 'Parlez au micro ou tapez votre réponse en français...'
            }
            disabled={isLoading}
            className="w-full px-4 py-2.5 text-sm rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-600/50 focus:border-amber-700 bg-stone-50/50 placeholder:text-stone-400"
          />
        </div>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!text.trim() || isLoading}
          className="flex-shrink-0 p-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white shadow-xs transition-all"
          title="Envoyer"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>
    </div>
  );
};
