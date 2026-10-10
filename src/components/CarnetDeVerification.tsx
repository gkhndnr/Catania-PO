import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, Plus, Trash2, BookOpen, AlertCircle, Sparkles, Copy, Check } from 'lucide-react';

export interface VerificationItem {
  id: string;
  weekId: string;
  claim: string;
  work: string;
  isVerified: boolean;
  notes?: string;
  createdAt: string;
}

const DEFAULT_VERIFICATIONS: VerificationItem[] = [
  {
    id: 'init-1',
    weekId: 'S1',
    claim: 'Vérifier la date de publication exacte de René (1802) et sa parution originale au sein du Génie du christianisme.',
    work: 'Chateaubriand, René',
    isVerified: false,
    notes: 'Dossier Classroom S1',
    createdAt: '2026-10-01',
  },
  {
    id: 'init-2',
    weekId: 'S2',
    claim: 'Compter les 12 syllabes et vérifier l\'hémistiche (6/6) sur la première strophe du poème « Le Lac ».',
    work: 'Lamartine, Méditations poétiques (1820)',
    isVerified: true,
    notes: 'Vérifié avec l\'atelier métrique : alexandrins et vers de six syllabes alternés.',
    createdAt: '2026-10-03',
  },
  {
    id: 'init-3',
    weekId: 'S3',
    claim: 'Relever dans la scène du cimetière du Père-Lachaise la phrase exacte du défi de Rastignac.',
    work: 'Balzac, Le Père Goriot (1835)',
    isVerified: false,
    notes: '« À nous deux maintenant ! »',
    createdAt: '2026-10-05',
  },
  {
    id: 'init-4',
    weekId: 'S4',
    claim: 'Vérifier les six pièces condamnées lors du procès de 1857 des Fleurs du mal (« Les Bijoux », « Le Léthé », etc.).',
    work: 'Baudelaire, Les Fleurs du mal',
    isVerified: false,
    notes: 'Voir le jugement du tribunal correctionnel de la Seine du 20 août 1857.',
    createdAt: '2026-10-07',
  },
  {
    id: 'init-5',
    weekId: 'S8',
    claim: 'Vérifier la date exacte du Manifeste du futurisme de Marinetti en une du Figaro (20 février 1909).',
    work: 'Marinetti, Manifeste du futurisme',
    isVerified: false,
    notes: 'Publié en français avant la version italienne à Milan.',
    createdAt: '2026-10-09',
  },
];

interface CarnetDeVerificationProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNote?: (item: VerificationItem) => void;
}

export const CarnetDeVerification: React.FC<CarnetDeVerificationProps> = ({
  isOpen,
  onClose,
}) => {
  const [items, setItems] = useState<VerificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('disum_verification_notebook');
      return saved ? JSON.parse(saved) : DEFAULT_VERIFICATIONS;
    } catch {
      return DEFAULT_VERIFICATIONS;
    }
  });

  const [newClaim, setNewClaim] = useState('');
  const [newWork, setNewWork] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('disum_verification_notebook', JSON.stringify(items));
    } catch (e) {
      console.error('Error saving notebook', e);
    }
  }, [items]);

  if (!isOpen) return null;

  const toggleVerify = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, isVerified: !it.isVerified } : it))
    );
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
  };

  const addItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClaim.trim()) return;

    const newItem: VerificationItem = {
      id: `item-${Date.now()}`,
      weekId: 'S' + (Math.floor(Math.random() * 8) + 1),
      claim: newClaim.trim(),
      work: newWork.trim() || 'Texte du programme',
      isVerified: false,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setItems([newItem, ...items]);
    setNewClaim('');
    setNewWork('');
  };

  const copyForClass = () => {
    const summary = items
      .map(
        (it) =>
          `[${it.isVerified ? 'VÉRIFIÉ' : 'À VÉRIFIER'}] ${it.work}: ${it.claim} ${
            it.notes ? `(${it.notes})` : ''
          }`
      )
      .join('\n');

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/75 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-900 text-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <BookOpen className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-semibold text-lg font-literary">
                Carnet de Vérification de l'Étudiant
              </h3>
              <p className="text-xs text-stone-400">
                « L'IA propose, le texte résiste, le lecteur décide. »
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Description Banner */}
        <div className="bg-amber-50/70 border-b border-amber-200/60 px-6 py-3 text-xs text-amber-900 flex items-start gap-3">
          <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
          <p>
            Ce carnet recense les citations, dates et faits évoqués pendant vos oraux.
            Vérifiez-les systématiquement dans vos éditions papier ou les dossiers Classroom du cours
            de Gökhan Dinar avant l'examen !
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Add Form */}
          <form onSubmit={addItem} className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
            <span className="text-xs font-semibold uppercase text-stone-700 tracking-wider block">
              Ajouter une affirmation à vérifier
            </span>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Œuvre / Auteur (ex: Baudelaire, Spleen)"
                value={newWork}
                onChange={(e) => setNewWork(e.target.value)}
                className="px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
              />
              <input
                type="text"
                placeholder="Point à vérifier dans le texte..."
                value={newClaim}
                onChange={(e) => setNewClaim(e.target.value)}
                className="md:col-span-2 px-3 py-2 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-white"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={!newClaim.trim()}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-stone-800 text-white hover:bg-stone-900 disabled:opacity-50 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Ajouter au carnet
              </button>
            </div>
          </form>

          {/* Items List */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs text-stone-500 px-1">
              <span>{items.filter((i) => i.isVerified).length} sur {items.length} points vérifiés</span>
              <button
                type="button"
                onClick={copyForClass}
                className="inline-flex items-center gap-1 text-stone-700 hover:text-amber-800 font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copié !' : 'Copier mes notes'}
              </button>
            </div>

            {items.map((it) => (
              <div
                key={it.id}
                className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                  it.isVerified
                    ? 'bg-stone-50/60 border-stone-200 opacity-75'
                    : 'bg-white border-stone-200 shadow-2xs hover:border-amber-300'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleVerify(it.id)}
                  className="mt-0.5 text-stone-400 hover:text-amber-700 transition-colors"
                >
                  {it.isVerified ? (
                    <CheckSquare className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Square className="w-4 h-4" />
                  )}
                </button>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-stone-900 font-literary">
                      {it.work}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 font-mono">
                      {it.weekId}
                    </span>
                  </div>
                  <p
                    className={`text-xs text-stone-700 leading-relaxed ${
                      it.isVerified ? 'line-through text-stone-400' : ''
                    }`}
                  >
                    {it.claim}
                  </p>
                  {it.notes && (
                    <p className="text-[11px] text-stone-500 italic">Note : {it.notes}</p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(it.id)}
                  className="p-1 text-stone-400 hover:text-rose-600 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-stone-50 border-t border-stone-200 flex justify-between items-center text-xs">
          <span className="text-stone-500 italic">Disum - Università di Catania</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-stone-800 text-white hover:bg-stone-900 font-medium transition-colors"
          >
            Fermer le carnet
          </button>
        </div>
      </div>
    </div>
  );
};
