import React, { useState } from 'react';
import { X, BookOpen, Calculator, Info, Sparkles, CheckCircle2 } from 'lucide-react';

interface SyllableCounterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SyllableCounterModal: React.FC<SyllableCounterModalProps> = ({ isOpen, onClose }) => {
  const [verseInput, setVerseInput] = useState(
    'Ô temps ! suspends ton vol, et vous, heures propices !'
  );
  const [selectedLanguage, setSelectedLanguage] = useState<'fr' | 'it'>('fr');

  if (!isOpen) return null;

  // Basic French syllable heuristic with 'e' muet detection
  const analyzeFrenchVerse = (line: string) => {
    const clean = line.trim();
    if (!clean) return { count: 0, meterType: '0 syllabe', wordAnalyses: [] };

    const words = clean.split(/\s+/);
    let totalSyllables = 0;
    const wordAnalyses: Array<{ word: string; count: number; note?: string }> = [];

    words.forEach((word, index) => {
      const isLastWord = index === words.length - 1;
      const nextWord = !isLastWord ? words[index + 1] : '';
      const nextStartsWithVowel = /^[aeiouyhéèêëàâîïôûü]/i.test(
        nextWord.replace(/^[^\w\s]/, '')
      );

      // Clean punctuation
      const stripped = word.replace(/[.,;:!?«»"—]/g, '');
      if (!stripped) return;

      // Approximate syllable vowel groups
      const vowels = stripped.match(/[aeiouyàâäéèêëîïôöùûü]+/gi) || [];
      let count = vowels.length;

      // E muet check at the end of word
      if (/e$/i.test(stripped) && count > 1) {
        if (isLastWord) {
          count = Math.max(1, count - 1);
          wordAnalyses.push({
            word: stripped,
            count,
            note: '« e » muet en fin de vers : ne compte pas',
          });
          totalSyllables += count;
          return;
        } else if (nextStartsWithVowel) {
          count = Math.max(1, count - 1);
          wordAnalyses.push({
            word: stripped,
            count,
            note: '« e » suivi d\'une voyelle : élision (ne compte pas)',
          });
          totalSyllables += count;
          return;
        } else {
          wordAnalyses.push({
            word: stripped,
            count,
            note: '« e » suivi d\'une consonne : prononcé et compté',
          });
          totalSyllables += count;
          return;
        }
      }

      wordAnalyses.push({ word: stripped, count });
      totalSyllables += count;
    });

    let meterType = `${totalSyllables} syllabes`;
    if (totalSyllables === 12) meterType = 'Alexandrin (12 syllabes / dodécasyllabe)';
    else if (totalSyllables === 10) meterType = 'Décasyllabe (10 syllabes)';
    else if (totalSyllables === 8) meterType = 'Octosyllabe (8 syllabes)';
    else if (totalSyllables === 6) meterType = 'Hexamètre / hémistiche (6 syllabes)';

    return {
      count: totalSyllables,
      meterType,
      wordAnalyses,
    };
  };

  const frAnalysis = analyzeFrenchVerse(verseInput);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-amber-900 text-amber-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Calculator className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-semibold text-lg font-literary">
                Atelier Métrique : Alexandrin vs Endecasillabo
              </h3>
              <p className="text-xs text-amber-200/80">
                Semaine 2 • Méthode : compter les syllabes et comparaison franco-italienne
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-amber-200 hover:text-white hover:bg-amber-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Quick presets */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-600 uppercase tracking-wider block">
              Exemples du programme à tester
            </label>
            <div className="flex flex-wrap gap-2 text-xs">
              <button
                type="button"
                onClick={() =>
                  setVerseInput('Ô temps ! suspends ton vol, et vous, heures propices !')
                }
                className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-amber-100 hover:text-amber-900 text-stone-700 border border-stone-200 transition-colors"
              >
                Lamartine : « Ô temps ! suspends ton vol... »
              </button>
              <button
                type="button"
                onClick={() =>
                  setVerseInput('Laissez-nous savourer les rapides délices')
                }
                className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-amber-100 hover:text-amber-900 text-stone-700 border border-stone-200 transition-colors"
              >
                Lamartine : « Laissez-nous savourer... »
              </button>
              <button
                type="button"
                onClick={() =>
                  setVerseInput('Comme je descendais des Fleuves impassibles')
                }
                className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-amber-100 hover:text-amber-900 text-stone-700 border border-stone-200 transition-colors"
              >
                Rimbaud : « Le Bateau ivre » (v. 1)
              </button>
              <button
                type="button"
                onClick={() =>
                  setVerseInput('Sempre caro mi fu quest\'ermo colle')
                }
                className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-teal-100 hover:text-teal-900 text-stone-700 border border-stone-200 transition-colors"
              >
                Leopardi : « L\'infinito » (v. 1)
              </button>
            </div>
          </div>

          {/* Verse Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-stone-800">
              Tapez ou collez un vers :
            </label>
            <input
              type="text"
              value={verseInput}
              onChange={(e) => setVerseInput(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 font-literary text-lg bg-stone-50/50"
              placeholder="Entrez un vers français ou italien..."
            />
          </div>

          {/* Metric Analysis Result */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-semibold text-amber-800 tracking-wider">
                Décompte approximatif
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-700 text-white">
                {frAnalysis.count} syllabes métriques
              </span>
            </div>
            <p className="text-sm font-semibold text-stone-800">{frAnalysis.meterType}</p>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {frAnalysis.wordAnalyses.map((w, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-1 rounded bg-white border border-amber-200 text-xs text-stone-700 shadow-2xs"
                  title={w.note || `${w.count} syllabe(s)`}
                >
                  <span className="font-literary text-sm font-medium">{w.word}</span>
                  <span className="text-[10px] px-1 rounded bg-amber-100 text-amber-800 font-mono">
                    {w.count}
                  </span>
                </span>
              ))}
            </div>
          </div>

          {/* Comparative rules table (France vs Italy) */}
          <div className="rounded-xl border border-stone-200 overflow-hidden text-xs">
            <div className="bg-stone-100 px-4 py-2 font-semibold text-stone-700 border-b border-stone-200 flex items-center justify-between">
              <span>Règles comparatives indispensables pour l'examen oral</span>
              <span className="text-[10px] text-stone-500">Français vs Italiano</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-200 bg-white p-4 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 font-semibold text-stone-900">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  L'alexandrin français (12 syllabes)
                </div>
                <ul className="space-y-1.5 text-stone-600 list-disc list-inside">
                  <li>
                    <strong>Décompte fixe :</strong> 12 syllabes obligatoires, rythmées par un hémistiche (6 + 6) et une césure.
                  </li>
                  <li>
                    <strong>Le « e » muet :</strong> prononcé et compté devant consonne ; élidé (non compté) devant voyelle ou h muet ; jamais compté en fin de vers.
                  </li>
                  <li>
                    <strong>Diérèse / Synérèse :</strong> prononciation en deux syllabes (ex. <em>li-on</em>) ou une seule (<em>lion</em>).
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-1.5 font-semibold text-stone-900">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                  L'endecasillabo italien (accent tonique en 10)
                </div>
                <ul className="space-y-1.5 text-stone-600 list-disc list-inside">
                  <li>
                    <strong>Définition par l'accent :</strong> la 10e syllabe porte toujours l'accent tonique principal.
                  </li>
                  <li>
                    <strong>Verso piano (11 syllabes) :</strong> mot paroxyton final (le plus fréquent en italien).
                  </li>
                  <li>
                    <strong>Sinalefe :</strong> deux voyelles contiguës entre deux mots se fondent en une seule position métrique (comme <em>mi fu quest'ermo</em>).
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-800 text-white hover:bg-stone-900 text-xs font-medium transition-colors"
          >
            Fermer l'atelier
          </button>
        </div>
      </div>
    </div>
  );
};
