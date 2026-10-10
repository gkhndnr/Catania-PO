export interface CourseWeek {
  id: string; // S1, S2...
  num: number;
  period: string;
  title: string;
  authors: string[];
  keyTexts: string[];
  method: string;
  methodDescription: string;
  sociocriticismConcept: string;
  sociocriticismQuestion: string;
  italianParallel: {
    author: string;
    work: string;
    concept: string;
  };
  sampleExcerpt: {
    author: string;
    work: string;
    year: string;
    textFr: string;
    sentenceToTranslate: string;
    translationIt: string;
    context: string;
    suggestedProblematic: string;
    axes: [string, string];
  };
  revisionQuestions: Array<{
    question: string;
    hint: string;
    answer: string;
  }>;
  debateTopic: {
    question: string;
    aiStance: string;
    studentStance: string;
    contextPrompt: string;
  };
}

export interface WriterPersona {
  id: string;
  name: string;
  dates: string;
  weekId: string;
  avatarText: string;
  bioShort: string;
  style: string;
  firstQuestion: string;
  textToVerify: string;
}

export const COURSE_WEEKS: CourseWeek[] = [
  {
    id: 'S1',
    num: 1,
    period: '1782-1820',
    title: 'Seuils du siècle : Rousseau, Chateaubriand et les origines',
    authors: ['Jean-Jacques Rousseau', 'François-René de Chateaubriand', 'Madame de Staël', 'Bernardin de Saint-Pierre'],
    keyTexts: ['Rêveries du promeneur solitaire (1782)', 'René (1802)', 'De la littérature (1800)', 'Paul et Virginie (1788)'],
    method: 'Lire avant d\'analyser & Définir la nouvelle',
    methodDescription: 'Distinguer roman et nouvelle selon Schaeffer et Grojnowski : concision, crise, effet de clôture.',
    sociocriticismConcept: 'Dire, former, taire',
    sociocriticismQuestion: 'Que tait le texte aristocratique ou post-révolutionnaire sur les traumatismes de la Terreur ?',
    italianParallel: {
      author: 'Ugo Foscolo',
      work: 'Ultime lettere di Jacopo Ortis (1802)',
      concept: 'Même année 1802 : le mal du siècle, la mélancolie politique et l\'exil identitaire.',
    },
    sampleExcerpt: {
      author: 'François-René de Chateaubriand',
      work: 'René',
      year: '1802',
      textFr: '« Je me trouvai bientôt plus isolé dans ma patrie que je ne l\'avais été sur une terre étrangère. Je voulus me jeter pendant quelque temps dans un monde qui ne me disait rien et qui ne m\'entendait pas. Mon âme, qu\'aucune émotion n\'avait encore usée, cherchait un objet qui pût l\'attacher ; mais je m\'aperçus que je donnais plus que je ne recevais. Ce n\'était ni un langage élevé ni de profonds sentiments qu\'on me demandait. »',
      sentenceToTranslate: '« Je voulus me jeter pendant quelque temps dans un monde qui ne me disait rien et qui ne m\'entendait pas. »',
      translationIt: '« Volli gettarmi per qualche tempo in un mondo che non mi diceva nulla e che non mi capiva. »',
      context: 'Paru d\'abord dans Le Génie du christianisme en 1802, René incarne le désenchantement d\'une jeunesse déracinée par la Révolution.',
      suggestedProblematic: 'Comment le sentiment d\'inadaptation de René traduit-il la rupture historique et sociale de l\'après-1789 ?',
      axes: [
        '1. L\'expression pathétique du désenchantement et du vague des passions.',
        '2. Une mise à distance critique de la sociabilité mondaine et des faux semblants.'
      ]
    },
    revisionQuestions: [
      {
        question: 'En quelle année paraît René de Chateaubriand, et dans quel grand ouvrage était-il inséré ?',
        hint: 'C\'est l\'année du Concordat avec le pape sous Bonaparte, et l\'œuvre défend la religion.',
        answer: 'René paraît en mille huit cent deux, inséré dans Le Génie du christianisme.'
      },
      {
        question: 'Quelles sont les trois questions fondamentales de la sociocritique ?',
        hint: 'Pense aux trois verbes : dire, comment le dire, et ce qu\'on ne dit pas.',
        answer: 'Que dit le texte de sa société ? Comment le dit-il ? Que tait-il ?'
      },
      {
        question: 'Quel roman épistolaire italien de la même année partage ce « mal du siècle » avec René ?',
        hint: 'Un héros passionné nommé Jacopo...',
        answer: 'Les Dernières Lettres de Jacopo Ortis (Ultime lettere di Jacopo Ortis) d\'Ugo Foscolo en mille huit cent deux.'
      }
    ],
    debateTopic: {
      question: 'René est-il seulement une victime mélancolique ou un aristocrate orgueilleux qui refuse la société ?',
      aiStance: 'René est un individualiste aristocratique nombriliste qui méprise le réel et refuse tout devoir collectif.',
      studentStance: 'René est le porte-voix lucide d\'une génération brisée par les bouleversements politiques de son temps.',
      contextPrompt: 'Appuie-toi sur le texte de Chateaubriand : cite ou paraphrase un passage précis.'
    }
  },
  {
    id: 'S2',
    num: 2,
    period: '1820-1836',
    title: 'La bataille romantique : poésie, théâtre et contestation',
    authors: ['Alphonse de Lamartine', 'Victor Hugo', 'Alfred de Vigny', 'Alfred de Musset', 'Prosper Mérimée'],
    keyTexts: ['Méditations poétiques : Le Lac (1820)', 'Préface de Cromwell (1827)', 'Hernani (1830)', 'Mateo Falcone (1829)'],
    method: 'Compter les syllabes (alexandrin vs endecasillabo)',
    methodDescription: 'Maîtriser le décompte du "e" muet, l\'hémistiche 6/6, la césure et comparer avec l\'accentuation italienne (endecasillabo piano).',
    sociocriticismConcept: 'Le champ littéraire (Pierre Bourdieu)',
    sociocriticismQuestion: 'Comment la jeunesse romantique conquiert-elle son autonomie contre les académies classiques d\'État ?',
    italianParallel: {
      author: 'Giacomo Leopardi',
      work: 'L\'infinito (1819) / Canti',
      concept: 'Le sentiment de la nature, la fuite du temps et la mélancolie cosmique face à Lamartine.',
    },
    sampleExcerpt: {
      author: 'Alphonse de Lamartine',
      work: 'Méditations poétiques, « Le Lac »',
      year: '1820',
      textFr: '« Ô temps ! suspends ton vol, et vous, heures propices !\nSuspendez votre cours :\nLaissez-nous savourer les rapides délices\nDes plus beaux de nos jours !\n\nAssez de malheureux ici-bas vous implorent,\nCoulez, coulez pour eux ;\nPrenez avec leurs jours les soins qui les dévorent ;\nOubliez les heureux. »',
      sentenceToTranslate: '« Ô temps ! suspends ton vol, et vous, heures propices ! Suspendez votre cours : »',
      translationIt: '« O tempo! sospendi il tuo volo, e voi, ore propizie! Sospendete il vostro corso: »',
      context: 'Publié en 1820, ce poème fonde le romantisme lyrique français en chantant l\'amour pour Julie Charles au lac du Bourget.',
      suggestedProblematic: 'En quoi l\'apostrophe lyrique au temps transforme-t-elle l\'angoisse de la mortalité en éternité poétique ?',
      axes: [
        '1. La dramatisation du passage du temps par l\'alternance des alexandrins et des hexamètres.',
        '2. L\'élégie amoureuse et la quête d\'un refuge dans la nature protectrice.'
      ]
    },
    revisionQuestions: [
      {
        question: 'En quelle année paraissent les Méditations poétiques de Lamartine, acte de naissance officiel du romantisme poétique ?',
        hint: 'Le début des années vingt au dix-neuvième siècle.',
        answer: 'En mille huit cent vingt.'
      },
      {
        question: 'Dans quelle préface de 1827 Victor Hugo théorise-t-il le drame romantique et l\'alliance du grotesque et du sublime ?',
        hint: 'Une pièce sur un dirigeant anglais du dix-septième siècle...',
        answer: 'La Préface de Cromwell en mille huit cent vingt-sept.'
      },
      {
        question: 'Quelle est la différence majeure entre le décompte d\'un alexandrin français et celui d\'un endecasillabo italien ?',
        hint: 'Pense au « e » muet en français et à la position de l\'accent tonique final en italien (verso piano).',
        answer: 'L\'alexandrin compte douze syllabes fixes avec les « e » muets prononcés devant consonne, tandis que l\'endecasillabo italien est défini par son dixième accent tonique.'
      }
    ],
    debateTopic: {
      question: 'La bataille d\'Hernani en 1830 fut-elle une vraie révolution esthétique ou un simple coup de publicité d\'Hugo ?',
      aiStance: 'Ce n\'était qu\'une provocation de bande organisée pour faire parler des romantiques dans la presse bourgeoise.',
      studentStance: 'C\'était une véritable émancipation politique et stylistique brisant le carcan des règles classiques étouffantes.',
      contextPrompt: 'Rappelle la règle des trois unités ou la dislocation de l\'alexandrin (« Je marche... »).'
    }
  },
  {
    id: 'S3',
    num: 3,
    period: '1830-1848',
    title: 'Le roman, miroir et marché : Balzac, Stendhal et l\'essor de la presse',
    authors: ['Honoré de Balzac', 'Stendhal', 'Théophile Gautier'],
    keyTexts: ['Le Père Goriot (1835)', 'Le Rouge et le Noir (1830)', 'La Morte amoureuse (1836)', 'Illusions perdues (1837-1843)'],
    method: 'Formuler une problématique littéraire',
    methodDescription: 'Transformer une simple observation thématique en tension problématique (paradoxe, conflit de valeurs, contradiction textuelle).',
    sociocriticismConcept: 'Les capitaux (économique vs symbolique)',
    sociocriticismQuestion: 'Comment l\'argent et l\'industrialisation du journal (le roman-feuilleton) transforment-ils l\'œuvre d\'art en marchandise ?',
    italianParallel: {
      author: 'Alessandro Manzoni',
      work: 'I promessi sposi (1827 / 1840)',
      concept: 'Le roman historique et moral face au réalisme balzacien dominé par la faim d\'ascension sociale et le capital.',
    },
    sampleExcerpt: {
      author: 'Honoré de Balzac',
      work: 'Le Père Goriot',
      year: '1835',
      textFr: '« Rastignac, resté seul, fit quelques pas vers le haut du cimetière et vit Paris tortueusement couché le long des deux rives de la Seine où commençaient à briller les lumières. Ses yeux s\'attachèrent presque avidement entre la colonne de la place Vendôme et le dôme des Invalides, là où vivait ce beau monde dans lequel il avait voulu pénétrer. Il lança sur cette ruche bourdonnante un regard qui semblait par avance en pomper le miel, et dit ces mots grandioses : « À nous deux maintenant ! » Et pour premier acte du défi qu\'il portait à la Société, Rastignac alla dîner chez madame de Nucingen. »',
      sentenceToTranslate: '« Il lança sur cette ruche bourdonnante un regard qui semblait par avance en pomper le miel, et dit ces mots grandioses : « À nous deux maintenant ! » »',
      translationIt: '« Lanciò su quell\'alveare ronzante uno sguardo che sembrava in anticipo succhiarne il miele, e disse queste parole grandiose: «A noi due adesso!» »',
      context: 'Clôture du Père Goriot au cimetière du Père-Lachaise : Rastignac enterre le vieillard et enterre avec lui ses scrupules moraux.',
      suggestedProblematic: 'Comment cette scène finale fait-elle de l\'ambition individuelle le miroir impitoyable du cynisme social sous la monarchie de Juillet ?',
      axes: [
        '1. La mise en scène panoramique et métaphorique de Paris comme proie prédatrice.',
        '2. L\'initiation morale dégradée : du deuil tragique au ralliement cynique au grand monde.'
      ]
    },
    revisionQuestions: [
      {
        question: 'Quelle est la phrase finale célèbre lancée par Rastignac à Paris depuis le Père-Lachaise ?',
        hint: 'Un défi en quatre mots : « À ... »',
        answer: '« À nous deux maintenant ! »'
      },
      {
        question: 'En quelle année paraît Le Père Goriot de Balzac ?',
        hint: 'Au milieu des années trente du dix-neuvième siècle.',
        answer: 'En mille huit cent trente-cinq.'
      },
      {
        question: 'Selon la théorie sociocritique des capitaux de Bourdieu, quels sont les deux types de capitaux qui s\'affrontent dans le champ littéraire ?',
        hint: 'L\'un est lié à la richesse monétaire, l\'autre au prestige et à la reconnaissance.',
        answer: 'Le capital économique et le capital symbolique (ou culturel).'
      }
    ],
    debateTopic: {
      question: 'Rastignac est-il un arriviste méprisable ou un héros réaliste lucide dans une société corrompue ?',
      aiStance: 'Rastignac est un traître sans cœur qui abandonne la fidélité morale dès que le vieillard est sous terre.',
      studentStance: 'Rastignac a compris les lois du monde balzacien : être dupe ou être complice, il choisit de survivre avec lucidité.',
      contextPrompt: 'Mentionne les conseils de Vautrin ou le contraste avec Bianchon l\'étudiant en médecine.'
    }
  },
  {
    id: 'S4',
    num: 4,
    period: '1835-1877',
    title: '1857, l\'année des procès : Baudelaire, Flaubert et l\'art pour l\'art',
    authors: ['Charles Baudelaire', 'Gustave Flaubert', 'Théophile Gautier'],
    keyTexts: ['Les Fleurs du mal (1857)', 'Madame Bovary (1857)', 'Le Spleen de Paris : L\'Étranger, Enivrez-vous (1869)', 'Un cœur simple (1877)'],
    method: 'Construire un plan de commentaire en deux ou trois axes',
    methodDescription: 'Établir une progression argumentative dynamique sans catalogue thématique, reliant forme esthétique et sens critique.',
    sociocriticismConcept: 'Le monde à l\'envers & L\'autonomie esthétique',
    sociocriticismQuestion: 'Pourquoi la justice impériale de Napoléon III s\'attaque-t-elle à la fois au roman bourgeois et à la poésie moderne en 1857 ?',
    italianParallel: {
      author: 'Giosuè Cardoni / Scapigliatura milanese',
      work: 'Preludio (Praga, 1864) / Emilio Praga',
      concept: 'La révolte antibourgeoise des Scapigliati italiens, disciples directs du spleen baudelairien.',
    },
    sampleExcerpt: {
      author: 'Charles Baudelaire',
      work: 'Le Spleen de Paris, « L\'Étranger »',
      year: '1869',
      textFr: '« — Qui aimes-tu le mieux, homme énigmatique, dis ? ton père, ta mère, ta sœur ou ton frère ?\n— Je n\'ai ni père, ni mère, ni sœur, ni frère.\n— Tes amis ?\n— Vous vous servez là d\'une parole dont le sens m\'est resté jusqu\'à ce jour inconnu.\n— Ta patrie ?\n— J\'ignore sous quelle latitude elle est située.\n— La beauté ?\n— Je l\'aimerais bien, déesse et immortelle.\n— L\'or ?\n— Je le hais comme vous haïssez Dieu.\n— Eh ! qu\'aimes-tu donc, extraordinaire étranger ?\n— J\'aime les nuages... les nuages qui passent... là-bas... là-bas... les merveilleux nuages ! »',
      sentenceToTranslate: '« — Eh ! qu\'aimes-tu donc, extraordinaire étranger ? — J\'aime les nuages... les nuages qui passent... là-bas... là-bas... les merveilleux nuages ! »',
      translationIt: '« — E che cosa ami allora, straordinario straniero? — Amo le nuvole... le nuvole che passano... laggiù... laggiù... le meravigliose nuvole! »',
      context: 'Poème d\'ouverture du Spleen de Paris : fable dialoguée proclamant la rupture totale du poète moderne avec les valeurs bourgeoises (famille, patrie, argent).',
      suggestedProblematic: 'Comment le dialogue dépouillé de « L\'Étranger » érige-t-il la rupture sociale en condition de la liberté poétique ?',
      axes: [
        '1. Le refus méthodique des institutions bourgeoises par une structure catéchétique inversée.',
        '2. L\'élévation vers l\'éphémère : les nuages comme allégorie de l\'idéal et de l\'exil moderne.'
      ]
    },
    revisionQuestions: [
      {
        question: 'Quels deux chefs-d\'œuvre majeurs de la littérature française subissent un procès en 1857 pour outrage à la morale ?',
        hint: 'Un recueil de poèmes et un roman normand...',
        answer: 'Les Fleurs du mal de Charles Baudelaire et Madame Bovary de Gustave Flaubert en mille huit cent cinquante-sept.'
      },
      {
        question: 'Qui est l\'auteur de la doctrine de « l\'art pour l\'art » développée dans la préface de Mademoiselle de Maupin ?',
        hint: 'Un poète et romancier du Parnasse...',
        answer: 'Théophile Gautier.'
      },
      {
        question: 'Que dénonce Baudelaire dans « L\'Étranger » à travers les questions de son interlocuteur ?',
        hint: 'Pense aux idoles bourgeoises : famille, patrie, argent.',
        answer: 'Il dénonce les piliers de la société bourgeoise utilitaire : la famille, la patrie et l\'argent.'
      }
    ],
    debateTopic: {
      question: 'Faut-il condamner Les Fleurs du mal en 1857 au nom de la santé morale publique ?',
      aiStance: 'Oui, ce recueil exhibe la charogne, le péché et la morbidité sans proposer aucun remède édifiant pour le peuple.',
      studentStance: 'Non, Baudelaire extrait la beauté du mal avec une rigueur classique et révèle la crise spirituelle de son époque.',
      contextPrompt: 'Cite des poèmes emblématiques comme « Une charogne » ou « Au lecteur ».'
    }
  },
  {
    id: 'S5',
    num: 5,
    period: '1870-1887',
    title: 'L\'âge d\'or de la nouvelle : Zola, Maupassant et le naturalisme',
    authors: ['Émile Zola', 'Guy de Maupassant', 'Jules Barbey d\'Aurevilly', 'Alphonse Daudet'],
    keyTexts: ['Les Soirées de Médan (1880)', 'Boule de suif (1880)', 'Le Horla (1887)', 'Le Rideau cramoisi (1874)', 'La Dernière Classe (1873)'],
    method: 'Rédiger une introduction d\'oral et d\'écrit',
    methodDescription: 'Les quatre piliers indispensables : accroche historique, présentation de l\'œuvre et de l\'extrait, problématique formulée, annonce des axes.',
    sociocriticismConcept: 'Le recueil collectif et la sociabilité littéraire',
    sociocriticismQuestion: 'Comment le collectif des Soirées de Médan critique-t-il le patriotisme cocardier après la défaite de 1870 contre la Prusse ?',
    italianParallel: {
      author: 'Giovanni Verga',
      work: 'Vita dei campi (1880) / Rosso Malpelo',
      concept: 'Même année 1880 : le vérisme sicilien dialogue avec le naturalisme français autour du déterminisme social.',
    },
    sampleExcerpt: {
      author: 'Guy de Maupassant',
      work: 'Boule de suif',
      year: '1880',
      textFr: '« Les trois hommes aussi, rapprochés par un instinct de conservateurs à l\'aspect de Cornudet, parlaient d\'argent avec un certain ton de mépris pour les pauvres. Le comte Hubert parlait des dégâts causés par les Prussiens, des pertes qui résulteraient du bétail volé et des récoltes perdues, avec une aisance de grand seigneur dix fois millionnaire que ces ravages ne gêneraient pas deux ans. M. Carré-Lamadon, fort éprouvé dans l\'industrie cotonnière, avait eu soin d\'envoyer six cent mille francs en Angleterre, une poire pour la soif qu\'il se ménageait à toute éventualité. Enfin Loiseau s\'était arrangé pour vendre à l\'intendance française tous ses vins communs qui lui restaient en cave, de sorte que l\'État lui devait une somme formidable, qu\'il comptait bien toucher au Havre. »',
      sentenceToTranslate: '« Les trois hommes aussi, rapprochés par un instinct de conservateurs à l\'aspect de Cornudet, parlaient d\'argent avec un certain ton de mépris pour les pauvres. »',
      translationIt: '« Anche i tre uomini, uniti da un istinto di conservatori alla vista di Cornudet, parlavano di denaro con un certo tono di disprezzo per i poveri. »',
      context: 'Nouvelle parue en 1880 dans Les Soirées de Médan : tableau féroce de la lâcheté et du calcul égoïste des classes dirigeantes pendant la guerre franco-prussienne.',
      suggestedProblematic: 'Comment Maupassant retourne-t-il la hiérarchie morale en montrant que les patriotes proclamés sont de purs profiteurs de guerre ?',
      axes: [
        '1. La satire sociologique des trois notables bourgeois et aristocrates.',
        '2. L\'argent comme véritable patrie des dominants face au sacrifice de la prostituée.'
      ]
    },
    revisionQuestions: [
      {
        question: 'Quel recueil collectif de six nouvelles sur la guerre de 1870 a lancé la carrière de Maupassant en 1880 ?',
        hint: 'Le nom de la maison de campagne d\'Émile Zola...',
        answer: 'Les Soirées de Médan en mille huit cent quatre-vingts.'
      },
      {
        question: 'Quelle est la profession de l\'héroïne Élisabeth Rousset dans Boule de suif ?',
        hint: 'Une femme marginalisée socialement mais patriote de cœur...',
        answer: 'Elle est prostituée (courtisane galante).'
      },
      {
        question: 'Quel mouvement littéraire italien correspond directement au naturalisme français à la même époque ?',
        hint: 'Porté par Giovanni Verga et Luigi Capuana...',
        answer: 'Le vérisme (il verismo).'
      }
    ],
    debateTopic: {
      question: 'Le naturalisme de Zola et Maupassant est-il une vraie science objective ou un pessimisme noir complaisant ?',
      aiStance: 'Le naturalisme ne fait que salir la nature humaine en réduisant l\'homme à la bête et à l\'hérédité physiologique.',
      studentStance: 'Le naturalisme est un acte de lucidité politique dévoilant les injustices et les hypocrisies de classe de la IIIe République.',
      contextPrompt: 'Appuie-toi sur Boule de suif ou Le Roman expérimental.'
    }
  },
  {
    id: 'S6',
    num: 6,
    period: '1871-1886',
    title: 'La poésie en crise : Rimbaud, Verlaine, Mallarmé et le Symbolisme',
    authors: ['Arthur Rimbaud', 'Paul Verlaine', 'Stéphane Mallarmé', 'Jean Moréas', 'Villiers de l\'Isle-Adam'],
    keyTexts: ['Le Bateau ivre (1871)', 'Art poétique (1874/1882)', 'Manifeste du Symbolisme (1886)', 'Véra (1874)'],
    method: 'Construire un paragraphe d\'analyse littéraire',
    methodDescription: 'Méthode en 4 temps : Idée directrice, Citation courte intégrée, Analyse stylistique/procédé, Conclusion sociocritique.',
    sociocriticismConcept: 'Le sociolecte & La crise du vers',
    sociocriticismQuestion: 'Pourquoi la poésie symboliste invente-t-elle une langue hermétique en réponse à la société marchande et journalistique ?',
    italianParallel: {
      author: 'Giovanni Pascoli / Gabriele D\'Annunzio',
      work: 'Myricae (1891) / Il Piacere (1889)',
      concept: 'Le symbolisme sonore, l\'onomatopée et la quête de la musicalité pure du vers.',
    },
    sampleExcerpt: {
      author: 'Paul Verlaine',
      work: 'Jadis et Naguère, « Art poétique »',
      year: '1882',
      textFr: '« De la musique avant toute chose,\nEt pour cela préfère l\'Impair\nPlus vague et plus soluble dans l\'air,\nSans rien en lui qui pèse ou qui pose.\n\nIl faut aussi que tu n\'ailles point\nChoisir tes mots sans quelque méprise :\nRien de plus cher que la chanson grise\nOù l\'Indécis au Précis se joint. »',
      sentenceToTranslate: '« De la musique avant toute chose, et pour cela préfère l\'Impair plus vague et plus soluble dans l\'air, »',
      translationIt: '« Musica prima di ogni altra cosa, e per questo preferisci il Dispari, più vago e più solubile nell\'aria, »',
      context: 'Écrit en 1874 en prison et publié en 1882, ce manifeste poétique proclame la rupture avec la lourdeur oratoire et parnassienne.',
      suggestedProblematic: 'En quoi l\'éloge de l\'impair et de l\'indécis refonde-t-il la modernité poétique contre la rigidité académique ?',
      axes: [
        '1. La revendication musicale et le rejet de la rhétorique lourde (« tords le cou à l\'Éloquence »).',
        '2. L\'esthétique de la nuance et de la suggestion opposée au réalisme positiviste.'
      ]
    },
    revisionQuestions: [
      {
        question: 'Quel vers ouvre le célèbre « Art poétique » de Paul Verlaine ?',
        hint: 'Une priorité absolue donnée à un art fraternel de la poésie...',
        answer: '« De la musique avant toute chose ».'
      },
      {
        question: 'En quelle année Jean Moréas publie-t-il dans Le Figaro le Manifeste du Symbolisme ?',
        hint: 'L\'année de la fondation officielle du mouvement à Paris...',
        answer: 'En mille huit cent quatre-vingt-six.'
      },
      {
        question: 'Quel mètre poétique Verlaine recommande-t-il pour rendre le poème « plus soluble dans l\'air » ?',
        hint: 'Le contraire du pair (7, 9, 11 syllabes)...',
        answer: 'Le vers impair (l\'Impair).'
      }
    ],
    debateTopic: {
      question: 'La poésie symboliste de Mallarmé est-elle un pur jeu aristocratique stérile ou le sommet de l\'art ?',
      aiStance: 'C\'est une poésie incompréhensible, coupée de la vie des hommes réels, réservée à quelques initiés prétentieux.',
      studentStance: 'C\'est une recherche sublime pour rendre la langue sacrée et résister à la vulgarité commerciale du monde moderne.',
      contextPrompt: 'Rappelle la célèbre formule de Mallarmé : « donner un sens plus pur aux mots de la tribu ».'
    }
  },
  {
    id: 'S7',
    num: 7,
    period: '1891-1901',
    title: 'Fin de siècle : décadence, scandale et renouveau',
    authors: ['Oscar Wilde', 'Alfred Jarry', 'André Gide', 'Renée Vivien'],
    keyTexts: ['Salomé (1891 en français)', 'Ubu Roi (1896)', 'Les Nourritures terrestres (1897)', 'Études et préludes (1901)'],
    method: 'Conclure et ouvrir un commentaire oral',
    methodDescription: 'Bilan synthétique des acquis de l\'analyse sans redite, puis ouverture historique, comparatiste (avec l\'Italie) ou moderne.',
    sociocriticismConcept: 'Scandale et consécration',
    sociocriticismQuestion: 'Comment le scandale public théâtral (Ubu Roi) devient-il le moteur paradoxal de la consécration d\'avant-garde ?',
    italianParallel: {
      author: 'Gabriele D\'Annunzio',
      work: 'Il trionfo della morte (1894)',
      concept: 'L\'esthétisme décadent, le culte de la volupté et la fascination morbide fin-de-siècle.',
    },
    sampleExcerpt: {
      author: 'Alfred Jarry',
      work: 'Ubu Roi',
      year: '1896',
      textFr: '« PÈRE UBU. — Merdre !\nMÈRE UBU. — Ô ! voilà du joli, Père Ubu, vous estes un fort grand voyou.\nPÈRE UBU. — Que ne vous assommoir-je, Mère Ubu !\nMÈRE UBU. — Ce n\'est pas moi, Père Ubu, c\'est un autre qu\'il faudrait assassiner.\nPÈRE UBU. — De par ma chandelle verte, je ne comprends pas.\nMÈRE UBU. — Comment, Père Ubu, vous estes content de votre sort ?\nPÈRE UBU. — De par ma chandelle verte, merdre, madame, certes oui, je suis content. On le serait à moins : capitaine de dragons, officier de confiance du roi Venceslas, décoré de l\'ordre de l\'Aigle Rouge de Pologne et ancien roi d\'Aragon, que voulez-vous de mieux ? »',
      sentenceToTranslate: '« PÈRE UBU. — Merdre ! MÈRE UBU. — Ô ! voilà du joli, Père Ubu, vous estes un fort grand voyou. »',
      translationIt: '« PADRE UBU. — Merdraccian! MADRE UBU. — Oh! che bello, Padre Ubu, siete proprio un gran mascalzone. »',
      context: '10 décembre 1896 au Théâtre de l\'Œuvre : le premier mot (« Merdre ») déclenche une bagarre générale de quinze minutes dans la salle.',
      suggestedProblematic: 'Comment la provocation carnavalesque d\'Ubu Roi dynamite-t-elle les codes bourgeois du théâtre dramatique ?',
      axes: [
        '1. L\'agression du public bourgeois par la subversion langagière et grotesque.',
        '2. La parodie tragique (Macbeth) dévoilant la férocité primitive du pouvoir moderne.'
      ]
    },
    revisionQuestions: [
      {
        question: 'Quel est le premier mot scandaleux prononcé sur scène lors de la première d\'Ubu Roi en 1896 ?',
        hint: 'Un juron célèbre enrichi d\'une lettre supplémentaire...',
        answer: '« Merdre ! » avec un « r » supplémentaire.'
      },
      {
        question: 'En quelle langue Oscar Wilde a-t-il écrit sa pièce Salomé en 1891 ?',
        hint: 'Il ne l\'a pas écrite en anglais...',
        answer: 'En français.'
      },
      {
        question: 'Quelle poétesse symboliste et lesbienne publie Études et préludes en 1901 à Paris ?',
        hint: 'Son prénom est Renée et son nom Vivien...',
        answer: 'Renée Vivien en mille neuf cent un.'
      }
    ],
    debateTopic: {
      question: 'Ubu Roi est-il une farce d\'écolier puérile ou un avertissement visionnaire sur les tyrannies du XXe siècle ?',
      aiStance: 'Ce n\'est qu\'un canular d\'adolescents boutonneux du lycée de Rennes sans réelle valeur littéraire.',
      studentStance: 'C\'est une intuition géniale anticipant les dictatures sanglantes, absurdes et cupides du vingtième siècle.',
      contextPrompt: 'Évoque la cupidité de la « machine à décerveler » et le « croc à phynances ».'
    }
  },
  {
    id: 'S8',
    num: 8,
    period: '1909-1929',
    title: 'Vitesse, guerre et Années folles : du Futurisme à l\'après-guerre',
    authors: ['Filippo Tommaso Marinetti', 'Blaise Cendrars', 'Alain-Fournier', 'André Gide'],
    keyTexts: ['Manifeste du futurisme (Le Figaro, 1909)', 'La Prose du Transsibérien (1913)', 'Le Grand Meaulnes (1913)', 'Les Caves du Vatican (1914)'],
    method: 'Le commentaire complet : synthèse et maîtrise du temps',
    methodDescription: 'Gestion chronométrée de l\'oral d\'examen DISUM : 15 min d\'intervention étudiant structurée sans trou de mémoire.',
    sociocriticismConcept: 'Faire date & La rupture de la modernité',
    sociocriticismQuestion: 'Pourquoi Paris était-il le centre obligatoire de consécration internationale où publier le Manifeste du futurisme italien en 1909 ?',
    italianParallel: {
      author: 'Filippo Tommaso Marinetti / Futuristi italiani',
      work: 'Fondazione e Manifesto del Futurismo (1909)',
      concept: 'Le lien organique direct Italie-France : rédigé en français pour la une du Figaro à Paris, puis traduit en italien.',
    },
    sampleExcerpt: {
      author: 'Blaise Cendrars',
      work: 'La Prose du Transsibérien et de la petite Jehanne de France',
      year: '1913',
      textFr: '« En ce temps-là j\'étais en mon adolescence\nJ\'avais à peine seize ans et je ne me souvenais déjà plus de mon enfance\nJ\'étais à seize mille lieues du lieu de ma naissance\nJ\'étais à Moscou dans la ville des mille et trois clochers et des sept gares\nEt je n\'avais pas assez des sept gares et des mille et trois tours\nCar mon adolescence était alors si ardente et si folle\nQue mon cœur tour à tour brûlait comme le temple d\'Éphèse ou comme la place Rouge\nQuand le soleil se couche.\nEt mes yeux éclairaient des voies anciennes.\nEt j\'étais déjà si mauvais poète\nQue je ne savais pas aller jusqu\'au bout. »',
      sentenceToTranslate: '« J\'avais à peine seize ans et je ne me souvenais déjà plus de mon enfance, j\'étais à seize mille lieues du lieu de ma naissance. »',
      translationIt: '« Avevo appena sedici anni e già non ricordavo più la mia infanzia, ero a sedicimila leghe dal luogo della mia nascita. »',
      context: 'Publié en 1913 avec les couleurs simultanées de Sonia Delaunay : le premier livre simultané, poème-fleuve du voyage ferroviaire et de la vitesse moderne.',
      suggestedProblematic: 'Comment Cendrars réinvente-t-il l\'épopée poétique à travers le vertige de la vitesse et de la mémoire nomade ?',
      axes: [
        '1. L\'ivresse de l\'espace et du rail rompant avec le lyrisme intime traditionnel.',
        '2. La polyphonie moderne unissant mélancolie existentielle et énergie cosmique.'
      ]
    },
    revisionQuestions: [
      {
        question: 'Dans quel grand quotidien parisien Marinetti a-t-il choisi de publier en français le premier Manifeste du futurisme le 20 février 1909 ?',
        hint: 'Le quotidien français le plus prestigieux de l\'époque pour les lettres...',
        answer: 'Dans Le Figaro le vingt février mille neuf cent neuf.'
      },
      {
        question: 'Avec quelle artiste peintre Sonia Delaunay Blaise Cendrars a-t-il créé La Prose du Transsibérien en 1913 ?',
        hint: 'La pionnière du simultanéisme abstrait...',
        answer: 'Avec Sonia Delaunay en mille neuf cent treize.'
      },
      {
        question: 'Pourquoi parle-t-on d\'un « envers » des Années folles après la Première Guerre mondiale ?',
        hint: 'Pense aux gueules cassées, au deuil des tranchées et à la crise économique qui couve.',
        answer: 'Parce que sous la fête et l\'ivresse des années vingt se cachent le traumatisme des tranchées, les mutilés et la ruine morale.'
      }
    ],
    debateTopic: {
      question: 'Les Années folles ont-elles été une véritable libération joyeuse ou un mirage désespéré pour oublier la boucherie de 14-18 ?',
      aiStance: 'Elles ont été une fête artificielle et frénétique pour masquer le deuil atroce de plus d\'un million de jeunes Français morts.',
      studentStance: 'Elles ont été une authentique révolution créatrice, féministe et artistique qui a inventé la liberté moderne.',
      contextPrompt: 'Appuie-toi sur Cendrars, le jazz, les surréalistes ou la figure des garçonnes.'
    }
  }
];

export const WRITER_PERSONAS: WriterPersona[] = [
  {
    id: 'chateaubriand',
    name: 'François-René de Chateaubriand',
    dates: '1768 - 1848',
    weekId: 'S1',
    avatarText: 'FRC',
    bioShort: 'Vicomte d\'outre-tombe, voyageur en Amérique, peintre du vague des passions et du désenchantement aristocratique.',
    style: 'Majestueux, mélancolique, noble, méditatif.',
    firstQuestion: '« Bonjour, jeune voyageur de Catane. J\'ai arpenté les forêts du Nouveau Monde et les ruines de l\'Histoire. Dites-moi : que cherchez-vous dans la solitude de mon pauvre René ? »',
    textToVerify: 'Vérifie dans René la description de la tempête et du cloître où se réfugie sa sœur Amélie.'
  },
  {
    id: 'lamartine',
    name: 'Alphonse de Lamartine',
    dates: '1790 - 1869',
    weekId: 'S2',
    avatarText: 'AL',
    bioShort: 'Poète du Lac et tribun de la Seconde République, chantre de l\'harmonie céleste et de l\'amour éternel.',
    style: 'Harmonieux, lyrique, doux, élégiaque.',
    firstQuestion: '« Salve à vous, ami des rives ioniennes. Le temps passe et nous emporte. Avez-vous déjà ressenti au bord de l\'eau cette blessure que les mots seuls peuvent adoucir ? »',
    textToVerify: 'Compte précisément les syllabes de la deuxième strophe du « Lac » pour observer l\'alternance de l\'alexandrin et du vers de six syllabes.'
  },
  {
    id: 'hugo',
    name: 'Victor Hugo',
    dates: '1802 - 1885',
    weekId: 'S2',
    avatarText: 'VH',
    bioShort: 'Le chef de file flamboyant des romantiques, pourfendeur du carcan classique, défenseur des misérables.',
    style: 'Vibrant, épique, combatif, généreux.',
    firstQuestion: '« Jeune esprit, la poésie n\'est pas une cage d\'académicien, c\'est un volcan en éruption ! Pourquoi pensez-vous que nous avons mené la bataille d\'Hernani en mille huit cent trente ? »',
    textToVerify: 'Vérifie dans la Préface de Cromwell l\'argumentation sur le grotesque et le sublime.'
  },
  {
    id: 'balzac',
    name: 'Honoré de Balzac',
    dates: '1799 - 1850',
    weekId: 'S3',
    avatarText: 'HB',
    bioShort: 'L\'historien des mœurs de La Comédie humaine, forçat de la plume buvant cinquante tasses de café par nuit.',
    style: 'Énergique, perspicace, observateur des rouages financiers.',
    firstQuestion: '« Ah ! un jeune étudiant de Catane ! Regardez Paris, regardez le monde : tout s\'y achète et s\'y vend. Selon vous, qu\'est-ce qui a corrompu Eugène de Rastignac dans la pension Vauquer ? »',
    textToVerify: 'Retrouve dans Le Père Goriot la description minutieuse de la pension Vauquer et les odeurs qui s\'en dégagent.'
  },
  {
    id: 'baudelaire',
    name: 'Charles Baudelaire',
    dates: '1821 - 1867',
    weekId: 'S4',
    avatarText: 'CB',
    bioShort: 'Dandy maudit, alchimiste transformant la boue de Paris en or poétique, pourfendeur du progrès bourgeois.',
    style: 'Ciselé, ironique, lucide, sombre et raffiné.',
    firstQuestion: '« Bonjour. Vous vivez sous le soleil de Sicile, loin des brumes et du pavé gras de Paris. Pourquoi les juges de mille huit cent cinquante-sept ont-ils cru que mes vers étaient du poison ? »',
    textToVerify: 'Vérifie dans « L\'Étranger » du Spleen de Paris la progression des refus : famille, amis, patrie, or.'
  },
  {
    id: 'zola',
    name: 'Émile Zola',
    dates: '1840 - 1902',
    weekId: 'S5',
    avatarText: 'EZ',
    bioShort: 'Le chef de file du naturalisme, observateur des tares physiologiques et des luttes ouvrières, auteur de J\'accuse.',
    style: 'Direct, rigoureux, engagé, méthodique.',
    firstQuestion: '« Bonjour camarade d\'études. Pour moi, le roman est un laboratoire scientifique où l\'on observe la machine humaine. Avez-vous remarqué comment Maupassant dissèque l\'égoïsme bourgeois dans Boule de suif ? »',
    textToVerify: 'Vérifie dans Boule de suif le contenu exact du panier de victuailles que partage la généreuse courtisane.'
  },
  {
    id: 'rimbaud',
    name: 'Arthur Rimbaud',
    dates: '1854 - 1891',
    weekId: 'S6',
    avatarText: 'AR',
    bioShort: 'L\'enfant prodigue aux semelles de vent, dérégleur de tous les sens, briseur de syntaxe à seize ans.',
    style: 'Vif, insolent, fulgurant, visionnaire.',
    firstQuestion: '« Tiens, salut. Qu\'est-ce qu\'on vous apprend à l\'université sur moi ? Croyez-vous vraiment qu\'on puisse changer la vie sans d\'abord fracasser les vieux vers ronronnants ? »',
    textToVerify: 'Cherche dans « Le Bateau ivre » les vers où le bateau se libère de ses haleurs et des cotons anglais.'
  },
  {
    id: 'vivien',
    name: 'Renée Vivien',
    dates: '1877 - 1909',
    weekId: 'S7',
    avatarText: 'RV',
    bioShort: 'Poétesse anglo-américaine écrivant en français, disciple de Sappho, figure majeure et courageuse du Paris 1900.',
    style: 'Mélodieux, mystérieux, précieux, subversif.',
    firstQuestion: '« Bienvenue à vous. On a souvent voulu nous réduire au silence ou au scandale à la Belle Époque. Selon vous, comment la poésie peut-elle réinventer l\'amour sans la tutelle masculine ? »',
    textToVerify: 'Vérifie dans Études et préludes les motifs de la nuit, de la mer et des violettes.'
  },
  {
    id: 'cendrars',
    name: 'Blaise Cendrars',
    dates: '1887 - 1961',
    weekId: 'S8',
    avatarText: 'BC',
    bioShort: 'Bourlingueur du monde, amputé du bras droit pendant la guerre, premier poète à rouler à toute vapeur vers l\'Orient.',
    style: 'Rythmé, rugueux, moderne, cinématographique.',
    firstQuestion: '« Montez dans le wagon ! Les locomotives sifflent et le siècle a changé d\'allure. Pourquoi le vieux sonnet ne suffisait-il plus pour raconter le Transsibérien ? »',
    textToVerify: 'Vérifie dans La Prose du Transsibérien le refrain inquiet de la petite Jehanne : « Dis, Blaise, sommes-nous bien loin de Montmartre ? »'
  }
];

export const ITALIAN_FRENCH_GLOSSARY = [
  { fr: 'Le roman', it: 'Il romanzo', note: 'Attention : "la nouvelle" se traduit par "il racconto" ou "la novella", jamais par "novel" !' },
  { fr: 'Dépendre de', it: 'Dipendere da', note: 'Calque fréquent : en français on dit "cela dépend DE", pas "cela dépend da".' },
  { fr: 'Le champ littéraire', it: 'Il campo letterario', note: 'Concept clé de Pierre Bourdieu : l\'espace de concurrence entre les écrivains pour la légitimité.' },
  { fr: 'L\'hémistiche', it: 'L\'emistichio', note: 'La moitié d\'un vers alexandrin (6 syllabes // 6 syllabes), séparée par la césure.' },
  { fr: 'L\'endecasillabo', it: 'L\'endecasillabo', note: 'Défini en italien par l\'accent sur la 10e syllabe ; l\'alexandrin français compte 12 syllabes prononcées.' },
  { fr: 'La problématique', it: 'La problematica / La tesi di ricerca', note: 'La tension centrale ou paradoxe qui guide tout le commentaire.' },
  { fr: 'Que tait le texte ?', it: 'Cosa tace il testo?', note: 'Question sociocritique capitale : les non-dits idéologiques et sociaux de l\'époque.' },
  { fr: 'Le sociolecte', it: 'Il socioletto', note: 'La variété de langue propre à une classe sociale donnée dans un texte.' },
];
