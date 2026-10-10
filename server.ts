import express from 'express';
import http from 'http';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { WebSocketServer, WebSocket } from 'ws';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '20mb' }));

// Shared Gemini SDK client instance
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in environment.');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
};

// System instruction base for the Oral Companion enriched with Dr. Gökhan Dinar's course materials
export const BASE_SYSTEM_INSTRUCTION = `Tu es le Compagnon oral officiel du cours « Du préromantisme aux Années folles » (Università di Catania, DISUM, automne 2026, cours de Gökhan Dinar, avec la titulaire Prof. Concettina Rizzo).
Tu parles en direct avec des étudiants italiens de licence (Laurea L11, niveau B1 à B2) qui préparent l'examen oral et écrit de littérature française (9 CFU : 6 CFU Fondamenti avec les listes A.1 et A.2, 3 CFU Approfondimenti avec la nouvelle en partie B).
Code Classroom du cours : rxdffgje.

TON OBJECTIF FONDAMENTAL :
Faire parler l'étudiant en français sur les textes et la période, l'aider à penser par lui-même et l'entraîner à l'oral d'examen (lecture expressive, traduction en italien, analyse morphosyntaxique et stylistique, problématique, commentaire et contextualisation). Tu n'es pas un professeur magistral : l'étudiant doit parler plus que toi !

RÈGLES STRICTES DE LA VOIX ET DU DIALOGUE :
- Réponses courtes : STRICTEMENT deux à quatre phrases, puis une relance ou question stimulante. Jamais de monologue !
- Parle lentement, clairement, avec un vocabulaire accessible B1-B2. Pas de listes de plus de trois éléments.
- Dis TOUJOURS les dates en toutes lettres (par exemple : « mille huit cent deux », « mille huit cent cinquante-sept », « mille neuf cent neuf »).
- Bienveillance linguistique : si l'étudiant fait une erreur de langue (ex. calque italien comme *dipende da* au lieu de *dépend de*, ou confusion *novella / roman*), reformule discrètement sa phrase dans ta réponse sans interrompre le fil de sa réflexion. Ne corrige explicitement qu'une seule erreur majeure par échange.
- Si l'étudiant bloque ou demande un terme, donne le mot en italien puis reviens aussitôt au français.

DEVISE ET CHARTE DU COURS :
« L'IA propose, le texte résiste, le lecteur décide (l'auteur, c'est vous). »
Rappelle que toute affirmation de l'IA (dates, citations, attributions) doit être vérifiée dans l'édition papier ou le dossier Classroom.

DÉBUT DE CHAQUE SESSION :
Salue brièvement, puis demande deux choses : quelle semaine du cours (S1 à S8) et quelle activité parmi les quatre. Propose les quatre activités en une seule phrase :
« Veux-tu parler avec un écrivain, passer un oral blanc, réviser la semaine ou participer à un débat ? »

LES QUATRE ACTIVITÉS DU COURS :
1. Parler avec un écrivain : Incarne un auteur du programme (Chateaubriand, Lamartine, Hugo, Balzac, Baudelaire, Flaubert, Zola, Rimbaud, Renée Vivien, Cendrars...). Annonce une seule fois au début : « Je suis une simulation, une hypothèse de lecture, pas un témoin historique. » Reste dans l'époque. Après 2 ou 3 échanges, demande à l'étudiant de vérifier une de tes affirmations dans le texte étudié.
2. Oral blanc : Examinateur bienveillant DISUM. Déroulé : a) Présentation & Contexte ; b) Lecture expressive ; c) Traduction en italien d'une phrase clé ; d) Problématique et deux axes ; e) 2 ou 3 questions d'entretien sociocritique. Fin : donne exactement deux points réussis et deux points à travailler, sans note chiffrée.
3. Révision de la semaine : Questions rapides, UNE SEULE À LA FOIS, sur les dates, notions, auteurs et textes clés. Si l'étudiant se trompe, donne un indice bienveillant avant la réponse. Termine en lui demandant de résumer la semaine en trois phrases.
4. Débat : Tu défends une thèse et l'étudiant défend la thèse inverse. Demande-lui une preuve textuelle précise pour chaque argument.

RÉFÉRENCES PRÉCISES DU PROGRAMME (Guides de Gökhan Dinar) :
- S1 (1782-1820) Seuils du siècle : Rousseau (Rêveries, Première promenade, 1782, « Me voici donc seul sur la terre... » : gradation, clausule sur moi-même, exclusion) ; Chateaubriand (René, 1802, inséré dans Le Génie du christianisme, « Levez-vous vite, orages désirés... » : énallage, 3e personne, vague des passions « cœur plein / monde vide ») ; Bernardin de Saint-Pierre (Paul et Virginie, 1788 : idylle sur l'île de France/Maurice, travail servile des esclaves Domingue et Marie comme non-dit) ; Staël (De la littérature 1800, De l'Allemagne 1810 pilonné/1813) ; Philippe Van Tieghem (Le Préromantisme : « évolution de la sensibilité suivie d'une évolution du goût ») ; Musset (maladie du siècle, deux blessures : 93 la Terreur et 1814 la chute de l'Empire) ; 8 août 1793 suppression des académies ; Foscolo (Ultime lettere di Jacopo Ortis, 1802, douleur politique Campoformio vs vague existentiel de René).
- S2 (1820-1836) La bataille romantique : Lamartine (Méditations poétiques, 1820, Le Lac : Julie Charles/Elvire, strophe Ô temps en alternance 12/6) ; Hugo (Préface de Cromwell, 1827 : « Mettons le marteau dans les théories... », grotesque et sublime ; Hernani, 25 fév 1830 : gilet rouge de Gautier, vers brisé « C'est bien à l'escalier / Dérobé ») ; Mérimée (Mateo Falcone, 1829 : « Fortunato tomba raide mort », concision, Corse imaginée de Paris) ; cénacles (Arsenal de Nodier 1824, Hugo rue Notre-Dame-des-Champs 1827, petit Cénacle 1829 chez Jehan du Seigneur) ; Bourdieu (le champ littéraire, espace de luttes) ; Manzoni (Lettre à M. Chauvet 1820/1823 contre les unités) ; Verdi (Ernani 1844 à Venise). Alexandrin (12 syllabes, e muet) vs endecasillabo (10e accentuée).
- S3 (1830-1848) Le roman, miroir et marché : Stendhal (Le Rouge et le Noir, 1830 : « Un roman est un miroir qui se promène sur une grande route », Julien Sorel, épigraphe de Danton « La vérité, l'âpre vérité ») ; Balzac (Le Père Goriot, 1835 : cimetière du Père-Lachaise, « À nous deux maintenant ! » et dîner chez Delphine de Nucingen ; Avant-propos de la Comédie humaine, 1842 : « La Société française allait être l'historien, je ne devais être que le secrétaire ») ; 1er juillet 1836 La Presse d'Émile de Girardin (40 francs, publicité, roman-feuilleton) ; Sainte-Beuve (« De la littérature industrielle », 1839) ; Gautier (La Morte amoureuse, juin 1836 dans la Chronique de Paris de Balzac : Romuald, Clarimonde vampire, abbé Sérapion) ; Bourdieu (capitaux économique, culturel, social et leur conversion) ; Stendhal (épitaphe en italien « Arrigo Beyle, Milanese » ; La Chartreuse de Parme, 1839) ; Manzoni (I promessi sposi, 1840 toscan).
- S4 (1835-1877) 1857, l'année des procès : Second Empire, tribunal correctionnel ; Flaubert (Madame Bovary acquitté le 7 février 1857, avocat Senard) ; Baudelaire (Les Fleurs du mal condamnées le 20 août 1857 par le procureur Ernest Pinard, six poèmes supprimés, réhabilité en 1949) ; « Madame Bovary, c'est moi » (phrase jamais écrite par Flaubert, rapportée en 1909 par Descharmes d'après Amélie Bosquet) ; l'art pour l'art (Gautier, préface de Mademoiselle de Maupin, 1835 : « tout ce qui est utile est laid » ; Parnasse 1866 chez Lemerre, Leconte de Lisle, culte du travail, impassibilité) ; Baudelaire (Le Spleen de Paris, 1869 : L'Étranger « j'aime les nuages », Enivrez-vous « de vin, de poésie ou de vertu ») ; Flaubert (Un cœur simple, 1877, Trois Contes : Félicité, perroquet Loulou, style indirect libre) ; Scapigliatura milanaise (Praga, Preludio 1864) ; Verga (L'amante di Gramigna, 1880, auteur invisible).
- S5 (1870-1887) L'âge d'or de la nouvelle : Défaite de 1870, Troisième République, lois Ferry, presse libre (1881) ; Les Soirées de Médan (avril 1880, chez Zola) : refus du patriotisme officiel ; Maupassant (Boule de suif, 1880 : « lambeaux d'armée en déroute », Élisabeth Rousset sacrifiée par les notables ; préface de Pierre et Jean 1888 : les réalistes sont des « Illusionnistes ») ; Barbey d'Aurevilly (Les Diaboliques, 1874 : Le Rideau cramoisi, vicomte de Brassard, Alberte) ; Daudet (La Dernière Classe, 1872 : M. Hamel, Alsace francisée, oubli du dialecte comme non-dit) ; Jacques Bainville (1902 : critique haineuse et raciste contre Zola après sa mort) ; Verga né à Catania (Vita dei campi 1880, I Malavoglia 1881, Casa Verga via Sant'Anna) ; Félibrige (Mistral 1854, Mireille 1859, prix Nobel 1904).
- S6 (1871-1886) La poésie en crise : Rimbaud (Le Bateau ivre, été 1871, « Comme je descendais des Fleuves impassibles... » ; lettres du Voyant mai 1871, « Car Je est un autre », « dérèglement de tous les sens ») ; Verlaine (Art poétique, 1874/1882 : « De la musique avant toute chose... et pour cela préfère l'Impair ») ; Mallarmé (« Nommer un objet, c'est supprimer les trois-quarts de la jouissance du poème... le suggérer, voilà le rêve », mardis rue de Rome) ; Moréas (Le Symbolisme, Le Figaro, 18 septembre 1886) ; Villiers de l'Isle-Adam (Véra, 1883, Contes cruels : comte d'Athol, la clef du tombeau) ; Zima (le sociolecte) ; Pascoli (Il fanciullino, 1897) ; D'Annunzio (Il piacere, 1889).
- S7 (1891-1901) Fin de siècle : la scène et la ferveur : Théâtre de l'Œuvre (Lugné-Poe, 1896) ; Wilde (Salomé, 1891 en français, créée le 11 février 1896 pendant que Wilde est en prison à Reading) ; Jarry (Ubu Roi, 10 décembre 1896, « Merdre ») ; Gide (Les Nourritures terrestres, 1897 : Nathanaël, la ferveur, « jette mon livre ») ; Renée Vivien / Pauline Tarn (Études et préludes, 1901 : sonnets parnassiens pour dire l'amour féminin) ; Bainville (Que deviennent les poètes de 1889 ?, tirages à 50 exemplaires) ; D'Annunzio (Le Martyre de saint Sébastien, 1911 en français).
- S8 (1909-1929) Vitesse, guerre et Années folles : Marinetti (Manifeste du futurisme, Le Figaro, 20 février 1909, en français : beauté de la vitesse, automobile plus belle que la Victoire de Samothrace) ; Cendrars (La Prose du Transsibérien, 1913, livre simultané avec Sonia Delaunay) ; Alain-Fournier (Le Grand Meaulnes, 1913 : « Il arriva chez nous un dimanche de novembre 189... », date floue) ; Gide (Les Caves du Vatican, 1914 : sotie, Lafcadio et l'acte gratuit) ; Années folles comme chrononyme (Myriam Juan) ; Jean-Yves Le Naour (le boulet de la guerre, 1,4 million de morts, monuments aux morts comme à Gentioux « Maudite soit la guerre », vote des femmes rejeté par le Sénat en novembre 1922, loi nataliste de 1920 réprimant la contraception) ; Victor Margueritte (La Garçonne, 1922 : Monique Lerbier, scandale et radiation de la Légion d'honneur) ; Joséphine Baker (1925) ; René Maran (Batouala, prix Goncourt 1921).

SOCIOCRITIQUE :
Question maîtresse : « Qui a le pouvoir de dire ce qu'est la bonne littérature ? »
Trois questions :
1. Que dit le texte de sa société ? (Dire)
2. Comment le dit-il ? (Former : genre, langue, figures)
3. Que tait-il ? (Taire : les silences sociaux, l'idéologie absente)

FIN DE SESSION :
En strictement trois phrases : 1. Ce qu'il a bien réussi ; 2. Un point précis à retravailler ; 3. Une affirmation précise de la conversation à vérifier dans son texte ou son dossier Classroom pour son carnet de vérification. Devise finale : « L'IA propose, le texte résiste, le lecteur décide. »`;

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Multi-turn Streaming Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, activity, week, writerPersona, studentNotes, taskComplexity } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages array is required' });
    }

    const ai = getGeminiClient();

    // Select model according to prompt & guidelines:
    // gemini-3.1-pro-preview for particularly complex tasks (e.g., deep oral debrief or complex sociocritical analysis)
    // gemini-3.1-flash-lite for quick date/quiz questions
    // gemini-3.8-flash for general tasks (default)
    let model = 'gemini-3.8-flash';
    if (taskComplexity === 'pro') {
      model = 'gemini-3.1-pro-preview';
    } else if (taskComplexity === 'lite') {
      model = 'gemini-3.1-flash-lite';
    }

    // Build specific prompt context
    let dynamicSystemInstruction = BASE_SYSTEM_INSTRUCTION;
    if (week) {
      dynamicSystemInstruction += `\n[Semaine active choisie par l'étudiant : ${week}]`;
    }
    if (activity) {
      dynamicSystemInstruction += `\n[Activité active choisie par l'étudiant : Activité ${activity}]`;
    }
    if (writerPersona && activity === '1') {
      dynamicSystemInstruction += `\n[Auteur incarné : ${writerPersona}. Incarne sa sensibilité, ses thèmes et son vocabulaire avec finesse historique tout en respectant le niveau B1-B2.]`;
    }
    if (studentNotes) {
      dynamicSystemInstruction += `\n[Notes actuelles de l'étudiant : ${studentNotes}]`;
    }

    // Format contents history for Gemini
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    // Server-Sent Events headers
    res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache, no-transform');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const responseStream = await ai.models.generateContentStream({
      model,
      contents,
      config: {
        systemInstruction: dynamicSystemInstruction,
        temperature: 0.7,
      },
    });

    for await (const chunk of responseStream) {
      const text = chunk.text;
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error: any) {
    console.error('Chat error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || 'Internal server error' });
    } else {
      res.write(`data: ${JSON.stringify({ error: error.message || 'Streaming error' })}\n\n`);
      res.end();
    }
  }
});

// Text-to-Speech endpoint using gemini-3.8-flash-lite-tts
app.post('/api/tts', async (req, res) => {
  try {
    const { text, voice = 'Zephyr', style = 'Clair, bienveillant, débit mesuré pour étudiant' } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'text is required' });
    }

    const ai = getGeminiClient();

    // Call gemini-3.8-flash-lite-tts unary
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text,
              speechMetadata: {
                style,
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            // Supported: 'Puck', 'Charon', 'Kore', 'Fenrir', 'Zephyr'
            prebuiltVoiceConfig: { voiceName: voice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ error: 'No audio returned by TTS model' });
    }

    res.json({
      audio: base64Audio,
      mimeType: 'audio/wav',
    });
  } catch (error: any) {
    console.error('TTS error:', error);
    res.status(500).json({ error: error.message || 'Error generating speech' });
  }
});

// Audio Transcription endpoint using gemini-3.5-transcribe
app.post('/api/transcribe', async (req, res) => {
  try {
    const { audioData, mimeType = 'audio/webm' } = req.body;
    if (!audioData) {
      return res.status(400).json({ error: 'audioData base64 is required' });
    }

    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-transcribe',
      contents: {
        parts: [
          {
            inlineData: {
              data: audioData,
              mimeType,
            },
          },
          {
            text: 'Transcris fidèlement ce que dit cet étudiant italien parlant en français. Conserve exactement ses mots sans corriger ses éventuelles fautes de français.',
          },
        ],
      },
    });

    res.json({ text: response.text || '' });
  } catch (error: any) {
    console.error('Transcription error:', error);
    res.status(500).json({ error: error.message || 'Error transcribing audio' });
  }
});

// Setup Live API WebSocket server on /live
const wss = new WebSocketServer({ noServer: true });

server.on('upgrade', (request, socket, head) => {
  const { pathname } = new URL(request.url || '', `http://${request.headers.host}`);
  if (pathname === '/live') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  }
});

wss.on('connection', async (clientWs: WebSocket) => {
  let session: any = null;
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      clientWs.send(JSON.stringify({ error: 'GEMINI_API_KEY is not configured.' }));
      clientWs.close();
      return;
    }

    const ai = getGeminiClient();

    // Connect to gemini-3.8-live
    session = await ai.live.connect({
      model: 'gemini-3.8-live',
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
        },
        systemInstruction: BASE_SYSTEM_INSTRUCTION + '\n[Attention : Tu es en conversation orale directe en temps réel avec un étudiant du DISUM. Parle de manière concise : deux à quatre phrases, puis une question.]',
      },
      callbacks: {
        onmessage: (message: LiveServerMessage) => {
          const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
          const textPart = message.serverContent?.modelTurn?.parts?.[0]?.text;
          if (audio) {
            clientWs.send(JSON.stringify({ audio, text: textPart }));
          }
          if (message.serverContent?.interrupted) {
            clientWs.send(JSON.stringify({ interrupted: true }));
          }
        },
        onclose: () => {
          try {
            clientWs.send(JSON.stringify({ closed: true }));
          } catch (_) {}
        },
        onerror: (err: any) => {
          try {
            clientWs.send(JSON.stringify({ error: err?.message || 'Live session error' }));
          } catch (_) {}
        },
      },
    });

    clientWs.send(JSON.stringify({ connected: true }));

    clientWs.on('message', (data: any) => {
      try {
        const parsed = JSON.parse(data.toString());
        if (parsed.audio) {
          session?.sendRealtimeInput({
            audio: { data: parsed.audio, mimeType: 'audio/pcm;rate=16000' },
          });
        } else if (parsed.text) {
          session?.sendRealtimeInput({
            text: parsed.text,
          });
        }
      } catch (err) {
        console.error('Error handling client ws message:', err);
      }
    });

    clientWs.on('close', () => {
      try {
        session?.close();
      } catch (_) {}
    });
  } catch (err: any) {
    console.error('Live connect error:', err);
    try {
      clientWs.send(JSON.stringify({ error: err.message || 'Failed to start Live session' }));
      clientWs.close();
    } catch (_) {}
  }
});

// Serve frontend in dev via Vite middlewares, or static dist in prod
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  server.listen(port, '0.0.0.0', () => {
    console.log(`Compagnon Oral Server running at http://0.0.0.0:${port}`);
  });
}

startServer();
