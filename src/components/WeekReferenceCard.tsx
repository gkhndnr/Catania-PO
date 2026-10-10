import React, { useState } from 'react';
import { BookOpen, Languages, Sparkles, HelpCircle, ChevronDown, ChevronUp, Quote } from 'lucide-react';
import { CourseWeek } from '../data/courseData';
import { AudioVoiceButton } from './AudioVoiceButton';

interface WeekReferenceCardProps {
  week: CourseWeek;
}

export const WeekReferenceCard: React.FC<WeekReferenceCardProps> = ({ week }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showItalianTranslation, setShowItalianTranslation] = useState(false);

  return (
    <div className="bg-stone-50 border border-stone-200 rounded-xl overflow-hidden shadow-2xs">
      {/* Summary Header */}
      <div className="p-3.5 bg-white border-b border-stone-200 flex items-center justify-between gap-3">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-mono font-bold text-xs">
              {week.id}
            </span>
            <span className="text-xs text-stone-500 font-mono">{week.period}</span>
            <span className="text-xs font-semibold text-stone-800 font-literary">
              {week.title}
            </span>
          </div>
          <p className="text-[11px] text-stone-500 line-clamp-1">
            Auteurs : {week.authors.join(', ')} • Méthode : {week.method}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium text-stone-600 bg-stone-100 hover:bg-stone-200 border border-stone-200 transition-colors"
        >
          <span>{isExpanded ? 'Masquer le dossier' : 'Consulter l\'extrait & clés'}</span>
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expanded Study Details */}
      {isExpanded && (
        <div className="p-4 space-y-4 text-xs animate-in fade-in duration-150">
          {/* Excerpt Box */}
          <div className="p-4 bg-amber-50/50 rounded-xl border border-amber-200/70 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Quote className="w-4 h-4 text-amber-800" />
                <span className="font-semibold text-stone-900 font-literary text-sm">
                  {week.sampleExcerpt.author}, <em>{week.sampleExcerpt.work}</em> ({week.sampleExcerpt.year})
                </span>
              </div>
              <AudioVoiceButton
                text={week.sampleExcerpt.textFr}
                size="sm"
                label="Écouter l'extrait"
              />
            </div>

            <p className="font-literary text-stone-800 leading-relaxed italic text-sm whitespace-pre-line bg-white/70 p-3 rounded-lg border border-amber-100">
              {week.sampleExcerpt.textFr}
            </p>

            {/* Translation Training Section */}
            <div className="pt-2 border-t border-amber-200/60 space-y-1.5">
              <span className="font-semibold text-stone-700 block">
                Phrase d'entraînement à la traduction orale (vers l'italien) :
              </span>
              <p className="text-stone-800 font-medium">
                {week.sampleExcerpt.sentenceToTranslate}
              </p>
              <div>
                <button
                  type="button"
                  onClick={() => setShowItalianTranslation(!showItalianTranslation)}
                  className="text-[11px] text-emerald-800 underline hover:text-emerald-950 font-medium"
                >
                  {showItalianTranslation ? 'Cacher la traduction' : 'Afficher la proposition de traduction en italien'}
                </button>
                {showItalianTranslation && (
                  <p className="mt-1 p-2 rounded bg-emerald-50 text-emerald-900 border border-emerald-200 italic">
                    {week.sampleExcerpt.translationIt}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sociocriticism & Italian Parallel Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Sociocriticism Focus */}
            <div className="p-3 rounded-xl bg-white border border-stone-200 space-y-1.5">
              <span className="font-semibold text-amber-900 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                Regard Sociocritique
              </span>
              <p className="text-stone-600">
                <strong>Notion clé :</strong> {week.sociocriticismConcept}
              </p>
              <p className="text-stone-600">
                <strong>Question du cours :</strong> {week.sociocriticismQuestion}
              </p>
              <p className="text-[11px] text-stone-500 italic pt-1">
                Rappel : « Que dit le texte ? Comment le dit-il ? Que tait-il ? »
              </p>
            </div>

            {/* Italian Parallel */}
            <div className="p-3 rounded-xl bg-white border border-stone-200 space-y-1.5">
              <span className="font-semibold text-emerald-900 flex items-center gap-1.5">
                <Languages className="w-3.5 h-3.5 text-emerald-700" />
                Pont avec la Littérature Italienne
              </span>
              <p className="text-stone-700 font-medium">
                {week.italianParallel.author} — <em>{week.italianParallel.work}</em>
              </p>
              <p className="text-stone-600">
                {week.italianParallel.concept}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
