import React from 'react';
import { UserCheck, Award, RefreshCw, MessageSquare, BookOpen, Sparkles, Feather } from 'lucide-react';
import { COURSE_WEEKS, CourseWeek, WRITER_PERSONAS, WriterPersona } from '../data/courseData';

interface ActivitySelectorProps {
  currentActivity: string;
  onSelectActivity: (activityId: string) => void;
  currentWeek: string;
  onSelectWeek: (weekId: string) => void;
  selectedWriter: string;
  onSelectWriter: (writerId: string) => void;
}

export const ActivitySelector: React.FC<ActivitySelectorProps> = ({
  currentActivity,
  onSelectActivity,
  currentWeek,
  onSelectWeek,
  selectedWriter,
  onSelectWriter,
}) => {
  const activeWeekData = COURSE_WEEKS.find((w) => w.id === currentWeek) || COURSE_WEEKS[0];

  const activities = [
    {
      id: '1',
      title: '1. Parler avec un écrivain',
      desc: 'Dialogue simulé avec un auteur du programme (Chateaubriand, Baudelaire, Zola...)',
      icon: Feather,
      badge: 'Hypothèse de lecture',
    },
    {
      id: '2',
      title: '2. Oral blanc',
      desc: 'Simulation bienveillante de l\'épreuve DISUM : lecture, traduction, problématique et axes',
      icon: Award,
      badge: 'Examen officiel',
    },
    {
      id: '3',
      title: '3. Révision de la semaine',
      desc: 'Questions rapides une à une sur dates, notions sociocritiques et auteurs clés',
      icon: RefreshCw,
      badge: 'Quiz & Indices',
    },
    {
      id: '4',
      title: '4. Débat contradictoire',
      desc: 'Défense de thèses opposées avec preuves et citations tirées des textes',
      icon: MessageSquare,
      badge: 'Confrontation',
    },
  ];

  return (
    <div className="bg-white border-b border-stone-200 p-4 space-y-4">
      {/* Weeks Row */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-stone-500">
          <span className="font-semibold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-amber-700" />
            Programme des 8 Semaines (DISUM 2026) :
          </span>
          <span className="text-[11px] font-mono text-amber-800">
            {activeWeekData.period} • Notion : {activeWeekData.sociocriticismConcept}
          </span>
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {COURSE_WEEKS.map((w) => {
            const isSelected = w.id === currentWeek;
            return (
              <button
                key={w.id}
                type="button"
                onClick={() => onSelectWeek(w.id)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-xl border text-xs text-left transition-all ${
                  isSelected
                    ? 'bg-amber-800 text-white border-amber-900 shadow-xs font-semibold'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-mono font-bold text-[11px]">{w.id}</span>
                  <span className="truncate max-w-[140px] text-[11px] opacity-90">{w.period}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
        {activities.map((act) => {
          const Icon = act.icon;
          const isSelected = currentActivity === act.id;
          return (
            <button
              key={act.id}
              type="button"
              onClick={() => onSelectActivity(act.id)}
              className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                isSelected
                  ? 'bg-stone-900 text-stone-100 border-stone-900 shadow-sm ring-2 ring-amber-500/30'
                  : 'bg-stone-50/70 hover:bg-white text-stone-800 border-stone-200 hover:border-amber-400'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`p-1.5 rounded-lg ${isSelected ? 'bg-stone-800 text-amber-400' : 'bg-stone-200 text-stone-700'}`}>
                    <Icon className="w-4 h-4" />
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    isSelected ? 'bg-stone-800 text-stone-300' : 'bg-stone-200/70 text-stone-600'
                  }`}>
                    {act.badge}
                  </span>
                </div>
                <h4 className="font-semibold text-xs leading-snug font-literary pt-1">
                  {act.title}
                </h4>
                <p className={`text-[11px] leading-relaxed ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                  {act.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Writer Selector (Shown only when activity 1 is active) */}
      {currentActivity === '1' && (
        <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-amber-950 flex items-center gap-1.5">
              <Feather className="w-3.5 h-3.5 text-amber-700" />
              Choisissez l'auteur à rencontrer :
            </span>
            <span className="text-[11px] text-amber-800 italic">
              Simulation d'une hypothèse de lecture
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {WRITER_PERSONAS.map((wp) => {
              const isSelected = selectedWriter === wp.id;
              return (
                <button
                  key={wp.id}
                  type="button"
                  onClick={() => onSelectWriter(wp.id)}
                  className={`px-2.5 py-1 rounded-lg border transition-all text-xs ${
                    isSelected
                      ? 'bg-amber-800 text-white border-amber-900 font-medium'
                      : 'bg-white text-stone-700 border-amber-200 hover:bg-amber-100'
                  }`}
                >
                  <span className="font-mono text-[10px] mr-1 opacity-70">[{wp.avatarText}]</span>
                  {wp.name}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
