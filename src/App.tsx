/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  BookOpen,
  Phone,
  PhoneCall,
  Volume2,
  Mic,
  RotateCcw,
  Sparkles,
  Info,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Award,
} from 'lucide-react';
import { COURSE_WEEKS, CourseWeek } from './data/courseData';
import { AudioVoiceButton } from './components/AudioVoiceButton';
import { VoiceInputBar } from './components/VoiceInputBar';
import { PhoneCallDevice } from './components/PhoneCallDevice';
import { CarnetDeVerification } from './components/CarnetDeVerification';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  week?: string;
  activity?: string;
}

export default function App() {
  const [currentWeek, setCurrentWeek] = useState<string>('S1');
  const [currentActivity, setCurrentActivity] = useState<string>('2'); // Default to Oral blanc (2)
  const [isPhoneOpen, setIsPhoneOpen] = useState(false);
  const [isCarnetOpen, setIsCarnetOpen] = useState(false);
  const [showCourseDetails, setShowCourseDetails] = useState(false);

  // Initial greeting following teacher's direct instructions
  const INITIAL_WELCOME: Message = {
    id: 'msg-init',
    role: 'assistant',
    content:
      'Bonjour ! Bienvenue à votre entraînement oral pour le cours « Du préromantisme aux Années folles » (DISUM, Université de Catane, cours de Gökhan Dinar).\n\nSur quelle semaine du cours souhaites-tu travailler aujourd\'hui, et veux-tu parler avec un écrivain, passer un oral blanc, réviser la semaine ou participer à un débat ?',
    timestamp: 'DISUM',
    week: 'S1',
    activity: '2',
  };

  const [messages, setMessages] = useState<Message[]>([INITIAL_WELCOME]);
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const activeWeekData =
    COURSE_WEEKS.find((w) => w.id === currentWeek) || COURSE_WEEKS[0];

  // Send message to Gemini through streaming SSE endpoint
  const handleSendMessage = async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      week: currentWeek,
      activity: currentActivity,
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setIsLoading(true);

    const assistantMsgId = `msg-${Date.now()}-assistant`;
    let accumulatedText = '';

    setMessages((prev) => [
      ...prev,
      {
        id: assistantMsgId,
        role: 'assistant',
        content: '',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        week: currentWeek,
        activity: currentActivity,
      },
    ]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          activity: currentActivity,
          week: currentWeek,
          taskComplexity: currentActivity === '2' ? 'pro' : currentActivity === '3' ? 'lite' : 'flash',
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');

      if (reader) {
        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('data: ')) {
              const dataPayload = trimmed.slice(6);
              if (dataPayload === '[DONE]') {
                break;
              }
              try {
                const parsed = JSON.parse(dataPayload);
                if (parsed.text) {
                  accumulatedText += parsed.text;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMsgId
                        ? { ...msg, content: accumulatedText }
                        : msg
                    )
                  );
                } else if (parsed.error) {
                  accumulatedText += `\n[Erreur: ${parsed.error}]`;
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === assistantMsgId
                        ? { ...msg, content: accumulatedText }
                        : msg
                    )
                  );
                }
              } catch (_) {}
            }
          }
        }
      }
    } catch (err: any) {
      console.error('Chat error:', err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantMsgId
            ? {
                ...msg,
                content:
                  accumulatedText ||
                  'Une difficulté de connexion est survenue. Répétez votre phrase à voix haute.',
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetSession = () => {
    setMessages([
      {
        id: `msg-${Date.now()}`,
        role: 'assistant',
        content: `Bonjour ! Nouvelle session pour la semaine ${currentWeek}. Veux-tu parler avec un écrivain, passer un oral blanc, réviser la semaine ou participer à un débat ?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        week: currentWeek,
        activity: currentActivity,
      },
    ]);
  };

  const lastAssistantMsg = messages
    .filter((m) => m.role === 'assistant')
    .slice(-1)[0]?.content;

  const activities = [
    { id: '1', label: '1. Écrivain' },
    { id: '2', label: '2. Oral blanc' },
    { id: '3', label: '3. Révision' },
    { id: '4', label: '4. Débat' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#fcfbfa] text-stone-900 font-sans selection:bg-amber-100">
      {/* Sleek, Minimal Academic Header */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-stone-900 text-amber-200 flex items-center justify-center font-literary font-bold text-base shadow-xs">
              D
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-stone-900 font-literary sm:text-base leading-tight">
                Compagnon Oral • DISUM Catania
              </h1>
              <p className="text-[11px] text-stone-500 hidden sm:block">
                Du préromantisme aux Années folles • Cours de Gökhan Dinar
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Phone Toggle ("Aç/Kapa Telefon") */}
            <button
              type="button"
              onClick={() => setIsPhoneOpen(!isPhoneOpen)}
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold shadow-xs transition-all ${
                isPhoneOpen
                  ? 'bg-emerald-700 text-white ring-2 ring-emerald-500/30'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
              title={isPhoneOpen ? 'Fermer le téléphone' : 'Ouvrir le téléphone (Bas-Konuş)'}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{isPhoneOpen ? 'Fermer Téléphone' : 'Téléphone (Bas-Konuş)'}</span>
            </button>

            {/* Carnet de vérification */}
            <button
              type="button"
              onClick={() => setIsCarnetOpen(true)}
              className="p-2 rounded-full text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              title="Carnet de vérification"
            >
              <BookOpen className="w-4 h-4" />
            </button>

            {/* Reset */}
            <button
              type="button"
              onClick={handleResetSession}
              className="p-2 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
              title="Réinitialiser"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Minimalist Selection Controls: Week (S1-S8) & Activity (1-4) */}
        <div className="border-t border-stone-100 bg-stone-50/70 px-4 py-2">
          <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Week Pills */}
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-[11px] font-semibold text-stone-400 uppercase mr-1">
                Semaine :
              </span>
              {COURSE_WEEKS.map((w) => (
                <button
                  key={w.id}
                  type="button"
                  onClick={() => {
                    setCurrentWeek(w.id);
                    handleSendMessage(`Travaillons sur la semaine ${w.id}.`);
                  }}
                  className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                    currentWeek === w.id
                      ? 'bg-stone-900 text-white font-medium shadow-2xs'
                      : 'bg-white text-stone-600 hover:bg-stone-200 border border-stone-200/80'
                  }`}
                >
                  {w.id}
                </button>
              ))}
            </div>

            {/* Activity Pills */}
            <div className="flex items-center gap-1.5 py-0.5">
              <span className="text-[11px] font-semibold text-stone-400 uppercase mr-1">
                Activité :
              </span>
              {activities.map((act) => (
                <button
                  key={act.id}
                  type="button"
                  onClick={() => {
                    setCurrentActivity(act.id);
                    handleSendMessage(`Je choisis l'activité ${act.id} : ${act.label}.`);
                  }}
                  className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                    currentActivity === act.id
                      ? 'bg-amber-800 text-white font-medium shadow-2xs'
                      : 'bg-white text-stone-600 hover:bg-stone-200 border border-stone-200/80'
                  }`}
                >
                  {act.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-4">
        {/* Compact Week Dossier Expander (Simple & Clean) */}
        <div className="rounded-xl border border-stone-200 bg-white shadow-2xs overflow-hidden text-xs">
          <div
            onClick={() => setShowCourseDetails(!showCourseDetails)}
            className="px-4 py-2.5 flex items-center justify-between cursor-pointer hover:bg-stone-50/80 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                {activeWeekData.id} ({activeWeekData.period})
              </span>
              <span className="font-literary font-medium text-stone-800 text-sm">
                {activeWeekData.title}
              </span>
            </div>
            <div className="flex items-center gap-2 text-stone-500">
              <span className="hidden sm:inline text-[11px]">
                Notion : {activeWeekData.sociocriticismConcept}
              </span>
              {showCourseDetails ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </div>
          </div>

          {showCourseDetails && (
            <div className="p-4 bg-stone-50/70 border-t border-stone-100 space-y-3 animate-in fade-in duration-150">
              <div className="p-3 bg-white rounded-lg border border-stone-200 text-stone-700 space-y-1">
                <p>
                  <strong>Extrait de référence :</strong> {activeWeekData.sampleExcerpt.author},{' '}
                  <em>{activeWeekData.sampleExcerpt.work}</em> ({activeWeekData.sampleExcerpt.year})
                </p>
                <p className="italic text-stone-600 font-literary pt-1">
                  « {activeWeekData.sampleExcerpt.textFr} »
                </p>
                <p className="pt-2 text-[11px] text-emerald-800">
                  <strong>Traduction vers l'italien :</strong> {activeWeekData.sampleExcerpt.sentenceToTranslate}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 bg-white rounded-lg border border-stone-200">
                  <span className="font-semibold text-amber-900 block">Sociocritique (Dire, Former, Taire)</span>
                  <span className="text-stone-600">{activeWeekData.sociocriticismQuestion}</span>
                </div>
                <div className="p-2.5 bg-white rounded-lg border border-stone-200">
                  <span className="font-semibold text-emerald-900 block">Pont avec l'Italie</span>
                  <span className="text-stone-600">{activeWeekData.italianParallel.author} ({activeWeekData.italianParallel.concept})</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Minimalist Message Thread */}
        <div className="flex-1 rounded-2xl border border-stone-200 bg-white shadow-2xs flex flex-col overflow-hidden min-h-[480px]">
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isAssistant = msg.role === 'assistant';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isAssistant ? 'justify-start' : 'justify-end'} animate-in fade-in duration-150`}
                >
                  {isAssistant && (
                    <div className="w-7 h-7 rounded-full bg-stone-900 text-amber-300 flex items-center justify-center font-literary font-bold text-xs flex-shrink-0 shadow-2xs">
                      GD
                    </div>
                  )}

                  <div
                    className={`max-w-[88%] sm:max-w-[78%] rounded-2xl p-4 space-y-2 shadow-2xs ${
                      isAssistant
                        ? 'bg-[#f9f8f6] border border-stone-200/90 text-stone-800'
                        : 'bg-stone-900 text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] opacity-70">
                      <span>{isAssistant ? 'Compagnon Oral' : 'Vous (Étudiant)'}</span>
                      <span className="font-mono text-[10px]">{msg.timestamp}</span>
                    </div>

                    <p
                      className={`text-sm sm:text-[15px] leading-relaxed whitespace-pre-line ${
                        isAssistant ? 'font-serif text-stone-900 text-base' : 'font-sans'
                      }`}
                    >
                      {msg.content}
                    </p>

                    {isAssistant && (
                      <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between">
                        <AudioVoiceButton
                          text={msg.content}
                          size="sm"
                          label="Écouter à voix haute"
                        />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-3 justify-start animate-pulse">
                <div className="w-7 h-7 rounded-full bg-stone-900 text-amber-300 flex items-center justify-center font-literary font-bold text-xs">
                  GD
                </div>
                <div className="bg-[#f9f8f6] border border-stone-200 rounded-2xl p-3 text-xs text-stone-500">
                  Le compagnon formule sa réponse orale...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Clean Input Bar */}
          <VoiceInputBar
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            currentActivity={currentActivity}
            currentWeek={currentWeek}
            onOpenLiveVoice={() => setIsPhoneOpen(true)}
          />
        </div>
      </div>

      {/* Realistic Telephone Device (Aç/Kapa Bas-Konuş Telefon Görseli) */}
      <PhoneCallDevice
        isOpen={isPhoneOpen}
        onToggle={() => setIsPhoneOpen(!isPhoneOpen)}
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
        currentWeek={currentWeek}
        currentActivity={currentActivity}
        lastAssistantMessage={lastAssistantMsg}
      />

      {/* Carnet de vérification */}
      <CarnetDeVerification
        isOpen={isCarnetOpen}
        onClose={() => setIsCarnetOpen(false)}
      />
    </div>
  );
}
