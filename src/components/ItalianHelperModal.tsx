import React from 'react';
import { X, Languages, HelpCircle, Check } from 'lucide-react';
import { ITALIAN_FRENCH_GLOSSARY } from '../data/courseData';

interface ItalianHelperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ItalianHelperModal: React.FC<ItalianHelperModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-emerald-900 text-emerald-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Languages className="w-5 h-5 text-emerald-300" />
            <div>
              <h3 className="font-semibold text-lg font-literary">
                Passerelles Linguistiques : Français ↔ Italien
              </h3>
              <p className="text-xs text-emerald-200/80">
                Faux-amis fréquents, prépositions et vocabulaire de l'analyse littéraire
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900">
            <strong>Règle du cours :</strong> Parlez en français. Si un terme vous échappe,
            dites le mot en italien ou demandez « Comment dit-on... en français ? » ; le compagnon vous
            donnera l'équivalent et reprendra le fil en français.
          </div>

          <div className="space-y-2.5">
            {ITALIAN_FRENCH_GLOSSARY.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-white hover:border-emerald-300 transition-colors space-y-1"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-900 font-literary text-sm">
                    {item.fr}
                  </span>
                  <span className="text-emerald-700 font-medium italic">
                    {item.it}
                  </span>
                </div>
                <p className="text-xs text-stone-600">{item.note}</p>
              </div>
            ))}
          </div>

          <div className="rounded-xl border border-stone-200 p-4 bg-white text-xs space-y-2">
            <h4 className="font-semibold text-stone-900">Les 3 verbes d'analyse essentiels :</h4>
            <ul className="space-y-1.5 text-stone-600 list-disc list-inside">
              <li>
                <strong>Suggérer :</strong> « Le poète suggère la fuite du temps à travers la métaphore du lac. » (pas « suggerisce »)
              </li>
              <li>
                <strong>Témoigner de :</strong> « Ce passage témoigne de la violence des procès de mille huit cent cinquante-sept. »
              </li>
              <li>
                <strong>Mettre en lumière :</strong> « L'auteur met en lumière les faux semblants de la haute société parisienne. »
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-800 text-white hover:bg-stone-900 text-xs font-medium transition-colors"
          >
            Compris, retour à l'oral
          </button>
        </div>
      </div>
    </div>
  );
};
