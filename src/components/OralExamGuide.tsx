import React, { useState, useEffect } from 'react';
import { X, Award, Clock, Play, Pause, RotateCcw, CheckCircle2, BookOpen } from 'lucide-react';

interface OralExamGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OralExamGuide: React.FC<OralExamGuideProps> = ({ isOpen, onClose }) => {
  const [seconds, setSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (timerActive) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else if (!timerActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerActive, seconds]);

  if (!isOpen) return null;

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-900 text-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Award className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-semibold text-lg font-literary">
                Grille de l'Oral Blanc DISUM
              </h3>
              <p className="text-xs text-stone-400">
                Università di Catania • Cours de Gökhan Dinar (Automne 2026)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Practice Timer Header */}
        <div className="bg-amber-50 px-6 py-3 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-amber-900">
            <Clock className="w-4 h-4 text-amber-700" />
            <span>Chronomètre d'entraînement oral (durée cible : 10 à 15 minutes)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-bold text-sm text-stone-900 bg-white px-2 py-0.5 rounded border border-amber-300">
              {formatTime(seconds)}
            </span>
            <button
              onClick={() => setTimerActive(!timerActive)}
              className="p-1 rounded bg-amber-700 text-white hover:bg-amber-800 transition-colors"
              title={timerActive ? 'Pause' : 'Démarrer'}
            >
              {timerActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              onClick={() => {
                setTimerActive(false);
                setSeconds(0);
              }}
              className="p-1 rounded bg-stone-200 text-stone-700 hover:bg-stone-300 transition-colors"
              title="Réinitialiser"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="space-y-3">
            {/* Step 1 */}
            <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/70 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-amber-900 uppercase tracking-wider">
                  Étape 1 • Présentation & Contexte
                </span>
                <span className="text-[11px] text-stone-500 font-mono">~ 2 minutes</span>
              </div>
              <p className="text-xs text-stone-700">
                Présentez l'auteur, l'œuvre, sa date de parution (dite en toutes lettres !) et la situation précise du passage dans l'intrigue ou le recueil.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/70 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-amber-900 uppercase tracking-wider">
                  Étape 2 • Lecture expressive à voix haute
                </span>
                <span className="text-[11px] text-stone-500 font-mono">~ 1 minute</span>
              </div>
              <p className="text-xs text-stone-700">
                Lisez avec fluidité, en respectant la ponctuation, le ton, les liaisons obligatoires et les accents expressifs.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/70 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-amber-900 uppercase tracking-wider">
                  Étape 3 • Traduction d'une phrase en italien
                </span>
                <span className="text-[11px] text-stone-500 font-mono">~ 2 minutes</span>
              </div>
              <p className="text-xs text-stone-700">
                Traduisez fidèlement la phrase demandée dans un italien fluide et soigné, sans calque syntaxique artificiel.
              </p>
            </div>

            {/* Step 4 */}
            <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/70 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-amber-900 uppercase tracking-wider">
                  Étape 4 • Problématique & Deux axes
                </span>
                <span className="text-[11px] text-stone-500 font-mono">~ 3 minutes</span>
              </div>
              <p className="text-xs text-stone-700">
                Formulez une problématique sociocritique claire sous forme de question, puis annoncez distinctement deux axes d'analyse complémentaires.
              </p>
            </div>

            {/* Step 5 */}
            <div className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/70 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-amber-900 uppercase tracking-wider">
                  Étape 5 • Entretien & Questions sociocritiques
                </span>
                <span className="text-[11px] text-stone-500 font-mono">~ 4 minutes</span>
              </div>
              <p className="text-xs text-stone-700">
                Répondez aux 2 ou 3 questions de l'examinateur : Que dit le texte de sa société ? Comment le dit-il ? Que tait-il ? Proposez un pont avec la littérature italienne.
              </p>
            </div>
          </div>

          {/* Debrief note */}
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1">
            <h4 className="font-semibold flex items-center gap-1.5 text-emerald-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Évaluation bienveillante finale
            </h4>
            <p>
              À l'issue de la simulation, le Compagnon vous formulera toujours deux points forts réussis
              et deux points précis à travailler, sans note chiffrée, pour vous encourager dans votre progression.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-800 text-white hover:bg-stone-900 text-xs font-medium transition-colors"
          >
            Fermer le guide
          </button>
        </div>
      </div>
    </div>
  );
};
