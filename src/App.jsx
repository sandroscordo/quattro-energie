import React, { useState, useEffect } from 'react';
import {
  Zap, Sparkles, Heart, Brain,
  ChevronRight, ChevronLeft, Printer, RotateCcw,
  Award, Users, MessageCircle, MessageSquareWarning,
  Eye, Compass, Lightbulb, Target, Briefcase,
  ArrowRight, CheckCircle2, AlertTriangle, Activity
} from 'lucide-react';

// ============================================================
//  PROFILO DELLE QUATTRO ENERGIE
//  Strumento di autovalutazione fondato sulla tipologia di C.G. Jung
//  (Tipi Psicologici, 1921 — pubblico dominio)
// ============================================================

const ELEMENTS = {
  azione: {
    key: 'azione',
    name: 'AZIONE',
    archetype: 'Il Realizzatore',
    color: '#B8412C',
    colorLight: '#F2E1DB',
    colorDark: '#7A2A1C',
    icon: Zap,
    tagline: 'Decidere · Eseguire · Guidare',
    essence: 'Energia che spinge al risultato. Decide, mobilita, conclude.',
  },
  ispirazione: {
    key: 'ispirazione',
    name: 'ISPIRAZIONE',
    archetype: "L'Animatore",
    color: '#C8932E',
    colorLight: '#F4E8CE',
    colorDark: '#8B651F',
    icon: Sparkles,
    tagline: 'Coinvolgere · Persuadere · Immaginare',
    essence: 'Energia che accende le persone e moltiplica le possibilità.',
  },
  armonia: {
    key: 'armonia',
    name: 'ARMONIA',
    archetype: 'Il Custode',
    color: '#5F7340',
    colorLight: '#E2E7D6',
    colorDark: '#3F4D2A',
    icon: Heart,
    tagline: 'Sostenere · Ascoltare · Stabilizzare',
    essence: 'Energia che protegge le relazioni e tiene insieme nel tempo.',
  },
  analisi: {
    key: 'analisi',
    name: 'ANALISI',
    archetype: "L'Analista",
    color: '#1E5470',
    colorLight: '#D6E1E9',
    colorDark: '#123649',
    icon: Brain,
    tagline: 'Approfondire · Verificare · Strutturare',
    essence: 'Energia che cerca la verità attraverso rigore e profondità.',
  },
};

const OPPOSITE = {
  azione: 'armonia',
  armonia: 'azione',
  ispirazione: 'analisi',
  analisi: 'ispirazione',
};

// ============================================================
//  BANCA QUESITI — 76 item cosciente (19 per energia, di cui 3 reverse-coded) + 12 sotto pressione
// ============================================================

const QUESTIONS_RAW = [
  // AZIONE
  { e: 'azione', t: 'Prendo decisioni rapide, anche con informazioni incomplete.' },
  { e: 'azione', t: 'Mi sento a mio agio quando dirigo un gruppo.' },
  { e: 'azione', t: 'Affronto direttamente i conflitti invece di evitarli.' },
  { e: 'azione', t: 'Mi attraggono le sfide difficili che mettono alla prova le mie capacità.' },
  { e: 'azione', t: 'Esprimo le mie opinioni con franchezza, anche se possono creare attriti.' },
  { e: 'azione', t: 'Sono competitivo e voglio raggiungere il risultato.' },
  { e: 'azione', t: 'Mi annoio facilmente quando le cose procedono lentamente.' },
  { e: 'azione', t: "Preferisco l'azione alla pianificazione prolungata." },
  { e: 'azione', t: 'Mi piace assumermi rischi calcolati.' },
  { e: 'azione', t: 'Tendo a essere impaziente con chi è lento o indeciso.' },
  { e: 'azione', t: 'Mantengo il controllo nelle situazioni di pressione.' },
  { e: 'azione', t: 'Sono diretto e vado dritto al punto.' },
  { e: 'azione', t: 'Preferisco risolvere i problemi piuttosto che parlarne a lungo.' },
  { e: 'azione', t: 'Mi piace fissare obiettivi ambiziosi.' },
  { e: 'azione', t: 'Non ho difficoltà a dire "no" quando necessario.' },
  { e: 'azione', t: 'Mi sento naturalmente in posizione di guida.' },
  // AZIONE — reverse-coded (alto accordo = bassa Azione)
  { e: 'azione', t: 'Tendo a posticipare le decisioni difficili sperando che si risolvano da sole.', r: true },
  { e: 'azione', t: 'Mi sento a disagio quando devo prendere il comando di un gruppo.', r: true },
  { e: 'azione', t: 'Preferisco lasciare che siano gli altri a fissare le direzioni.', r: true },

  // ISPIRAZIONE
  { e: 'ispirazione', t: 'Mi energizza stare in mezzo ad altre persone.' },
  { e: 'ispirazione', t: 'Penso meglio parlando ad alta voce.' },
  { e: 'ispirazione', t: 'Sono entusiasta nel proporre nuove idee.' },
  { e: 'ispirazione', t: 'Mi piace conoscere persone nuove.' },
  { e: 'ispirazione', t: 'Trovo facile influenzare gli altri con la comunicazione.' },
  { e: 'ispirazione', t: 'Vedo possibilità dove altri vedono ostacoli.' },
  { e: 'ispirazione', t: 'Preferisco la varietà alla routine.' },
  { e: 'ispirazione', t: "Tendo a parlare di più rispetto all'ascoltare." },
  { e: 'ispirazione', t: "Mi piace essere al centro dell'attenzione." },
  { e: 'ispirazione', t: 'Sono ottimista per natura.' },
  { e: 'ispirazione', t: 'Mi sento limitato dalle regole troppo rigide.' },
  { e: 'ispirazione', t: 'Genero molte idee creative anche se non tutte realizzabili.' },
  { e: 'ispirazione', t: 'Mi diverto a improvvisare.' },
  { e: 'ispirazione', t: 'Celebro volentieri i successi insieme agli altri.' },
  { e: 'ispirazione', t: 'Sono espressivo nei gesti e nel linguaggio.' },
  { e: 'ispirazione', t: 'Trovo motivazione nel riconoscimento sociale.' },
  // ISPIRAZIONE — reverse-coded
  { e: 'ispirazione', t: 'Mi sento esaurito dopo aver passato molto tempo con tante persone.', r: true },
  { e: 'ispirazione', t: 'Preferisco preparare con cura piuttosto che improvvisare.', r: true },
  { e: 'ispirazione', t: 'Trovo stancante dover essere sempre socievole o entusiasta.', r: true },

  // ARMONIA
  { e: 'armonia', t: 'Sono leale verso le persone e gli impegni presi.' },
  { e: 'armonia', t: 'Preferisco la stabilità ai cambiamenti improvvisi.' },
  { e: 'armonia', t: 'Ascolto attentamente prima di rispondere.' },
  { e: 'armonia', t: 'Mi prendo cura del benessere degli altri.' },
  { e: 'armonia', t: 'Cerco di evitare i conflitti quando possibile.' },
  { e: 'armonia', t: 'Mantengo la calma in situazioni di stress.' },
  { e: 'armonia', t: 'Sono paziente con chi ha tempi diversi dai miei.' },
  { e: 'armonia', t: 'Costruisco relazioni profonde e durature.' },
  { e: 'armonia', t: 'Sono affidabile: faccio quello che dico.' },
  { e: 'armonia', t: 'Preferisco lavorare in team coesi.' },
  { e: 'armonia', t: 'Tendo a mettere i bisogni altrui prima dei miei.' },
  { e: 'armonia', t: 'Apprezzo le tradizioni e i metodi consolidati.' },
  { e: 'armonia', t: 'Sono empatico verso le difficoltà degli altri.' },
  { e: 'armonia', t: "Cerco l'armonia e la coesione del gruppo." },
  { e: 'armonia', t: 'Considero con cura come le mie azioni impatteranno gli altri.' },
  { e: 'armonia', t: 'Mi piace creare ambienti accoglienti.' },
  // ARMONIA — reverse-coded
  { e: 'armonia', t: 'Non ho problemi a esprimere disaccordo, anche se crea tensione.', r: true },
  { e: 'armonia', t: 'I sentimenti altrui non influenzano molto le mie decisioni.', r: true },
  { e: 'armonia', t: 'Preferisco la verità diretta a un\'armonia di facciata.', r: true },

  // ANALISI
  { e: 'analisi', t: 'Analizzo a fondo prima di decidere.' },
  { e: 'analisi', t: "Apprezzo la precisione e l'accuratezza." },
  { e: 'analisi', t: 'Lavoro bene in autonomia.' },
  { e: 'analisi', t: 'Mi piace approfondire i temi che mi interessano.' },
  { e: 'analisi', t: 'Verifico due volte il mio lavoro.' },
  { e: 'analisi', t: 'Preferisco la qualità alla quantità.' },
  { e: 'analisi', t: 'Penso prima di parlare.' },
  { e: 'analisi', t: 'Faccio molte domande per capire a fondo.' },
  { e: 'analisi', t: 'Mi sento a mio agio con la complessità intellettuale.' },
  { e: 'analisi', t: 'Apprezzo i sistemi logici e ben strutturati.' },
  { e: 'analisi', t: 'Sono critico verso ragionamenti deboli o solo emotivi.' },
  { e: 'analisi', t: 'Preferisco i fatti alle opinioni.' },
  { e: 'analisi', t: 'Mi serve tempo per riflettere prima di esprimere un giudizio.' },
  { e: 'analisi', t: 'Sono un perfezionista nelle cose che mi importano.' },
  { e: 'analisi', t: 'Trovo soddisfazione nel risolvere problemi complessi.' },
  { e: 'analisi', t: 'Mi piace ridurre l\'incertezza con dati e analisi.' },
  // ANALISI — reverse-coded
  { e: 'analisi', t: 'Spesso decido d\'istinto senza analizzare a fondo.', r: true },
  { e: 'analisi', t: 'Preferisco l\'approssimazione rapida alla precisione lenta.', r: true },
  { e: 'analisi', t: 'Mi annoio velocemente con i dettagli tecnici.', r: true },
];

// Mescolamento deterministico per non creare un ordine prevedibile
function shuffleSeed(arr) {
  const buckets = { azione: [], ispirazione: [], armonia: [], analisi: [] };
  arr.forEach(q => buckets[q.e].push(q));

  // Per ogni bucket, redistribuisce gli item reverse-coded in posizioni
  // distribuite anziché lasciarli tutti in coda. Senza questo, dopo
  // l'interleaving gli ultimi 12 quesiti del test sarebbero TUTTI reverse,
  // e il rispondente potrebbe rilevare il pattern annullando il beneficio
  // del reverse-coding (che serve a mitigare l'acquiescence bias).
  Object.keys(buckets).forEach(k => {
    const bucket = buckets[k];
    const positives = bucket.filter(q => !q.r);
    const reverses = bucket.filter(q => q.r);
    if (reverses.length === 0) return;

    // Posizioni target distribuite uniformemente nel bucket
    const total = bucket.length;
    const targetPositions = reverses.map((_, i) =>
      Math.floor((i + 1) * total / (reverses.length + 1))
    );
    const result = [];
    let posIdx = 0;
    let revIdx = 0;
    for (let i = 0; i < total; i++) {
      if (revIdx < reverses.length && i === targetPositions[revIdx]) {
        result.push(reverses[revIdx]);
        revIdx++;
      } else if (posIdx < positives.length) {
        result.push(positives[posIdx]);
        posIdx++;
      }
    }
    while (revIdx < reverses.length) {
      result.push(reverses[revIdx]);
      revIdx++;
    }
    buckets[k] = result;
  });

  const maxLen = Math.max(...Object.values(buckets).map(b => b.length));
  const result = [];
  for (let i = 0; i < maxLen; i++) {
    ['azione', 'ispirazione', 'armonia', 'analisi'].forEach(k => {
      if (buckets[k][i]) result.push(buckets[k][i]);
    });
  }
  return result;
}

const QUESTIONS = shuffleSeed(QUESTIONS_RAW);

// ============================================================
//  DOMANDE "SOTTO PRESSIONE"
//  12 item che catturano la persona meno cosciente —
//  comportamenti che emergono in stress / stanchezza /
//  sovraccarico (Jung: la "Ombra" tende a manifestarsi
//  nelle situazioni in cui l'Io non riesce più a mediare).
// ============================================================

const STRESS_QUESTIONS_RAW = [
  // AZIONE sotto pressione → impositività / aggressività
  { e: 'azione', t: 'Sotto pressione divento più impositivo del solito.' },
  { e: 'azione', t: 'Quando sono stanco, tendo a forzare la mia volontà sugli altri.' },
  { e: 'azione', t: 'In situazioni difficili prendo decisioni ancora più rapide, talvolta affrettate.' },

  // ISPIRAZIONE sotto pressione → dispersione / bisogno di rassicurazione
  { e: 'ispirazione', t: 'Sotto stress parlo ancora di più per scaricare la tensione.' },
  { e: 'ispirazione', t: 'Quando sono sopraffatto, salto da un\'attività all\'altra senza concludere.' },
  { e: 'ispirazione', t: 'Nei momenti difficili cerco rassicurazione costante dalle persone vicine.' },

  // ARMONIA sotto pressione → ritiro / acquiescenza silenziosa
  { e: 'armonia', t: 'Sotto pressione tendo a chiudermi e a non esprimere il mio dissenso.' },
  { e: 'armonia', t: 'Quando ci sono conflitti, mi ritiro in silenzio.' },
  { e: 'armonia', t: 'Sotto stress accetto cose con cui non sono d\'accordo pur di evitare scontri.' },

  // ANALISI sotto pressione → paralisi analitica / isolamento
  { e: 'analisi', t: 'Sotto pressione mi blocco nel voler analizzare ulteriormente la situazione.' },
  { e: 'analisi', t: 'Quando sono sopraffatto, mi isolo e taglio i contatti.' },
  { e: 'analisi', t: 'In situazioni difficili divento ancora più critico verso gli altri.' },
];

const STRESS_QUESTIONS = shuffleSeed(STRESS_QUESTIONS_RAW);

// ============================================================
//  CONTENUTI DEI REPORT — un blocco per ciascun tipo
// ============================================================

const REPORT = {
  azione: {
    panoramica: {
      stile: "Sei una persona orientata all'azione e ai risultati. La tua mente lavora rapidamente, traducendo le idee in decisioni e le decisioni in movimento. Ti senti vivo nelle sfide e nei contesti dove c'è qualcosa da conquistare. Hai una naturale propensione alla leadership: assumi responsabilità senza esitazione e indirizzi le energie del gruppo verso obiettivi concreti. La tua determinazione è il tuo motore principale, e raramente ti lasci frenare da ostacoli che ad altri sembrerebbero insuperabili.",
      interazione: "Nelle interazioni sei diretto, talvolta sbrigativo. Vai al punto senza giri di parole e ti aspetti che gli altri facciano lo stesso. Non hai difficoltà ad affrontare conversazioni difficili, e quando il gruppo perde il focus sei tu a riportarlo sulla rotta. Tieni a distanza le emozioni quando devi prendere decisioni, e questo può farti apparire più freddo di quanto tu sia in realtà. Tuttavia, sei pronto a battere i pugni sul tavolo per difendere ciò in cui credi e le persone della tua squadra.",
      decisione: "Decidi in fretta, basandoti su fatti, esperienza e logica. La tua tolleranza per l'ambiguità prolungata è bassa: preferisci una decisione imperfetta presa adesso a una decisione perfetta presa troppo tardi. Sai assumerti la responsabilità delle tue scelte e non cerchi consenso quando il consenso rallenterebbe il processo. Il rischio non ti spaventa, anzi: lo consideri parte naturale del fare cose che contano.",
    },
    forza: [
      'Decisionale e veloce nel passare all\'azione.',
      'Naturalmente orientato a obiettivi e risultati misurabili.',
      'Coraggioso nell\'affrontare situazioni difficili.',
      'Capace di prendere il controllo nei momenti di crisi.',
      'Diretto e chiaro nella comunicazione.',
      'Tollerante allo stress e alla pressione.',
      'Promotore del cambiamento e dell\'iniziativa.',
      'Sa assumersi rischi calcolati.',
      'Mobilita le risorse rapidamente.',
      'Non si lascia distrarre da rumori secondari.',
    ],
    debolezza: [
      'Può apparire impaziente o brusco con chi ha ritmi diversi.',
      'Tende a sottovalutare l\'impatto emotivo delle proprie parole.',
      'Rischia di prendere decisioni senza ascoltare a sufficienza.',
      'Può sembrare prepotente o autoritario senza accorgersene.',
      'Sopporta poco i dettagli quando li percepisce come ostacoli.',
      'A volte agisce prima di valutare tutte le conseguenze.',
      'Difficoltà a mostrare vulnerabilità o ammettere errori.',
      'Può "calpestare" il contributo altrui pur di arrivare al risultato.',
      'Reagisce con frustrazione alle resistenze o ai rallentamenti.',
      'Tende ad assumersi più di quanto possa effettivamente gestire.',
    ],
    team: [
      'Imprime ritmo e direzione al gruppo.',
      'Sblocca decisioni che altrimenti resterebbero in sospeso.',
      'Si fa carico delle responsabilità più pesanti.',
      'Difende la squadra di fronte a pressioni esterne.',
      'Identifica rapidamente la priorità tra molte opzioni.',
      'Porta energia e urgenza ai progetti.',
      'Non si tira indietro davanti a compiti scomodi.',
      'Riconduce il team al risultato quando si disperde.',
      'Comunica obiettivi e aspettative con chiarezza.',
      'Rappresenta un punto di riferimento nei momenti di crisi.',
    ],
    comunicazione_si: [
      'Vai dritto al punto, evita preamboli lunghi.',
      'Porta dati, fatti e conclusioni chiare.',
      'Proponi soluzioni, non solo problemi.',
      'Rispetta il suo tempo: sii sintetico.',
      'Mostra fiducia nelle tue posizioni.',
      'Accetta il dibattito senza prenderlo sul personale.',
      'Sii pronto a difendere le tue tesi con argomenti solidi.',
      'Concludi con prossimi passi concreti.',
      'Riconosci i suoi risultati senza adularlo.',
      'Lasciagli spazio decisionale dove possibile.',
    ],
    comunicazione_no: [
      'Non perderti in dettagli irrilevanti.',
      'Non drammatizzare o emotivizzare le questioni di lavoro.',
      'Non girare attorno al messaggio: dillo chiaramente.',
      'Non aspettarti che ti rassicuri costantemente.',
      'Non interrompere il suo flusso decisionale con chiacchiere.',
      'Non presentarti impreparato a una riunione.',
      'Non promettere ciò che non puoi mantenere.',
      'Non confondere la sua direttezza con un attacco personale.',
      'Non lasciare le decisioni in sospeso senza motivo.',
      'Non utilizzare un tono lamentoso o vittimistico.',
    ],
    ignorati: "Potresti non renderti conto di quanto la tua intensità possa pesare sugli altri. La tua urgenza, percepita da te come energia produttiva, può apparire ai colleghi come pressione costante. Tendi a confondere la tua sicurezza con la verità oggettiva: quando sei convinto di una posizione, hai poca curiosità nel cercare prove contrarie. Le persone più riflessive intorno a te potrebbero avere intuizioni preziose, ma non sempre trovano lo spazio per esprimerle prima che tu sia già passato all'azione. Inoltre, la tua difficoltà a ricevere feedback critico ti priva di occasioni di crescita: chi ti circonda spesso modula i propri commenti per non innescare la tua reazione difensiva, e questo significa che ricevi meno verità di quanta te ne servirebbe.",
    opposto: "Il tuo opposto è l'ARMONIA — Il Custode. Dove tu sei rapido, il Custode è ponderato. Dove tu spingi, il Custode mantiene. Dove tu vai dritto al punto, il Custode cerca di preservare la relazione. Per te può sembrare lento, indeciso o eccessivamente preoccupato dei sentimenti altrui — ma la sua capacità di costruire fiducia e coesione è ciò che tiene insieme i risultati che tu produci. Senza il Custode, l'organizzazione che guidi rischia di bruciare le persone. Per relazionarti meglio: rallenta il ritmo nelle conversazioni con lui, ascolta senza interrompere, riconosci esplicitamente il suo contributo, e dagli tempo per elaborare prima di chiedere una risposta. Non confondere la sua calma con passività.",
    sviluppo: [
      'Pratica l\'ascolto attivo: lascia parlare l\'altro per almeno 60 secondi prima di rispondere.',
      'Prima di reagire a una proposta, fai una domanda di approfondimento.',
      'Concediti il dubbio: quando sei sicuro al 100%, cerca attivamente la prospettiva opposta.',
      'Riconosci i contributi altrui in modo specifico, non generico.',
      'Impara a distinguere tra urgenza reale e urgenza percepita.',
      'Sviluppa la consapevolezza emotiva: nota cosa provi prima di agire.',
      'Quando dai feedback critico, abbinalo a feedback positivo specifico.',
      'Sperimenta il dire "non lo so" come segno di forza, non di debolezza.',
      'Concedi tempo alle persone più riflessive per processare.',
      'Allena la pazienza con chi ha competenze diverse dalle tue.',
    ],
    ambiente: [
      'Obiettivi chiari e misurabili.',
      'Autonomia decisionale ampia.',
      'Ritmo veloce e capacità di esecuzione.',
      'Sfide costanti che mettono alla prova.',
      'Riconoscimento basato sui risultati.',
      'Strutture organizzative snelle.',
      'Possibilità di guidare progetti propri.',
      'Persone competenti che reggono il ritmo.',
      'Spazio per assumersi rischi calcolati.',
      'Visibilità sui propri risultati.',
    ],
    motivazione: [
      'Obiettivi ambiziosi e visibili.',
      'Posizioni di autorità e responsabilità.',
      'Competizione strutturata e leale.',
      'Riconoscimento pubblico dei risultati.',
      'Possibilità di influenzare la strategia.',
      'Progetti con impatto concreto e misurabile.',
      'Libertà di scegliere i mezzi per arrivare al risultato.',
      'Sfide che richiedono coraggio e iniziativa.',
      'Possibilità di costruire e guidare un team.',
      'Crescita di carriera rapida e meritocratica.',
    ],
    management: [
      'Tende a guidare con direzione chiara e standard elevati.',
      'Decide rapidamente e si aspetta esecuzione altrettanto rapida.',
      'Premia chi produce risultati e va al punto.',
      'Può essere percepito come esigente o duro.',
      'Fatica a gestire collaboratori che richiedono molto supporto emotivo.',
      'Eccelle nelle situazioni di crisi e di cambiamento rapido.',
      'A volte non spiega abbastanza il "perché" delle decisioni.',
      'Tende a delegare il "come" ma mantiene il controllo sul "cosa".',
      'Può sottovalutare l\'importanza dei riti di squadra e del riconoscimento.',
      'È leale verso chi dimostra competenza e affidabilità.',
    ],
  },

  ispirazione: {
    panoramica: {
      stile: "Sei una persona che si nutre delle relazioni e delle idee. La tua energia naturale è espansiva: pensi parlando, generi entusiasmo nelle persone che ti circondano, e vedi possibilità là dove altri vedono solo problemi. Sei creativo, comunicativo, e hai un talento naturale per ispirare e mobilitare gli altri. La tua mente salta da un argomento all'altro con facilità, cogliendo connessioni che a chi ti ascolta possono sembrare imprevedibili. Ami il movimento, la varietà, e i contesti in cui le cose accadono insieme.",
      interazione: "Sei socievole, caloroso e spesso al centro dell'attenzione senza nemmeno cercarlo. Le persone si aprono con te perché percepiscono il tuo interesse genuino. Sei un comunicatore persuasivo, capace di trasformare un'idea grezza in una visione che gli altri vogliono seguire. Tendi però a parlare più di quanto ascolti, e nei momenti di entusiasmo puoi promettere più di quanto poi riuscirai a mantenere. La tua espressività è contagiosa, e quando sei in forma sei in grado di trasformare l'energia di un'intera stanza.",
      decisione: "Decidi rapidamente, ma più sull'onda dell'intuizione e dell'emozione che del calcolo logico. Ti fidi del tuo istinto e dei segnali sociali — ti accorgi se un'idea ha 'risonanza' con le persone. Hai però difficoltà con i dettagli e con le decisioni che richiedono analisi prolungata: ti annoiano, e tendi a delegarle. Quando ti senti vincolato da troppe regole o da un eccesso di pianificazione, perdi energia e creatività. Funzioni meglio quando puoi adattare il piano in corso d'opera.",
    },
    forza: [
      'Comunicatore persuasivo e coinvolgente.',
      'Generatore inesauribile di idee e possibilità.',
      'Costruttore naturale di relazioni e network.',
      'Ottimista, anche nelle difficoltà.',
      'Catalizzatore di energia nei gruppi.',
      'Creativo e capace di pensare fuori dagli schemi.',
      'Adattabile e a suo agio nel cambiamento.',
      'Sa motivare gli altri verso una visione comune.',
      'Riesce a "vendere" idee a stakeholder diversi.',
      'Porta calore umano nei contesti professionali.',
    ],
    debolezza: [
      'Difficoltà con i dettagli e l\'esecuzione meticolosa.',
      'Tende a sovrapromettere, soprattutto nei momenti di entusiasmo.',
      'Si distrae facilmente quando l\'energia del progetto cala.',
      'Può sembrare superficiale a chi predilige la profondità.',
      'Fatica con la routine e con i compiti ripetitivi.',
      'Parla più di quanto ascolti.',
      'Ha difficoltà a portare a termine progetti che ha iniziato.',
      'Cerca approvazione sociale anche quando non serve.',
      'Evita conflitti aperti e questioni emotivamente difficili.',
      'Può perdere credibilità se le idee non si traducono in risultati.',
    ],
    team: [
      'Porta energia e morale al gruppo.',
      'Crea connessioni tra persone che altrimenti non si parlerebbero.',
      'Sa "vendere" il lavoro del team verso l\'esterno.',
      'Genera la creatività e la varietà delle idee in fase iniziale.',
      'Mantiene alto il livello motivazionale durante i progetti lunghi.',
      'Riconosce e celebra i contributi degli altri.',
      'Costruisce ponti nei momenti di tensione.',
      'Apporta una visione ampia ai problemi specifici.',
      'È il volto naturale della squadra in eventi e presentazioni.',
      'Ricorda al gruppo il "perché" del lavoro.',
    ],
    comunicazione_si: [
      'Coinvolgilo nella conversazione, non monopolizzare.',
      'Dagli spazio per pensare ad alta voce.',
      'Mostra entusiasmo per le sue idee.',
      'Usa esempi vivaci e storie concrete.',
      'Riconosci i suoi contributi creativi.',
      'Lascia margine per l\'imprevisto e l\'improvvisazione.',
      'Chiedi la sua opinione su questioni di squadra.',
      'Sii caloroso e personale, non solo transazionale.',
      'Permettigli di vedere la "big picture".',
      'Concludi su una nota positiva, anche dopo critiche.',
    ],
    comunicazione_no: [
      'Non sommergerlo di dettagli e dati senza contesto.',
      'Non essere freddo o eccessivamente formale.',
      'Non ignorare le sue idee anche quando sembrano stravaganti.',
      'Non costringerlo a routine rigide senza spiegare il perché.',
      'Non criticarlo davanti agli altri.',
      'Non interrompere bruscamente il suo flusso espressivo.',
      'Non aspettarti decisioni perfettamente strutturate sotto pressione.',
      'Non dare per scontato che il suo entusiasmo equivalga a un impegno.',
      'Non sottovalutare il suo bisogno di connessione umana.',
      'Non trascinarlo in dibattiti puramente tecnici senza coinvolgimento umano.',
    ],
    ignorati: "Potresti non vedere quanto il tuo bisogno di approvazione influenzi le tue decisioni. L'entusiasmo che ti caratterizza può oscurare segnali importanti: persone che hanno dubbi non te li esprimono perché percepiscono che li interpreteresti come freni. Tendi a confondere il consenso del momento con un impegno reale, e questo ti porta a contare su risorse che poi non ci sono. Inoltre, la tua difficoltà con i dettagli può essere percepita come superficialità o come scarsa affidabilità — quando in realtà la tua mente è semplicemente altrove. Le persone più strutturate intorno a te apprezzerebbero più ascolto, più follow-through, e una maggiore consapevolezza di quanto della tua promessa si trasformerà davvero in azione.",
    opposto: "Il tuo opposto è l'ANALISI — L'Analista. Dove tu sei espansivo, l'Analista è concentrato. Dove tu salti tra le idee, l'Analista va in profondità. Dove tu cerchi connessione, l'Analista cerca verità. Per te può sembrare distante, troppo critico, o eccessivamente lento — ma la sua capacità di analisi rigorosa è ciò che trasforma le tue idee in soluzioni che reggono nel tempo. Per relazionarti meglio: arriva preparato con dati, non solo con entusiasmo; rispetta il suo bisogno di tempo per riflettere; non prendere il suo silenzio come disinteresse; accetta che le sue domande critiche siano un segno di rispetto per il tuo lavoro, non un attacco.",
    sviluppo: [
      'Allena la disciplina dell\'esecuzione: chiudi un progetto prima di iniziarne un altro.',
      'Prima di promettere, conta fino a cinque.',
      'Pratica l\'ascolto silenzioso senza interrompere.',
      'Documenta le tue idee per filtrare quelle davvero realizzabili.',
      'Cerca attivamente feedback critico, non solo riconoscimento.',
      'Allenati sui dettagli: scegline uno e portalo a perfezione.',
      'Distingui tra il "sì" sociale e il "sì" reale.',
      'Pianifica momenti di silenzio e riflessione nella tua settimana.',
      'Approfondisci una competenza tecnica fino al livello di esperto.',
      'Lavora sulla puntualità come segno di rispetto verso gli altri.',
    ],
    ambiente: [
      'Interazioni frequenti con persone diverse.',
      'Varietà di compiti e progetti.',
      'Spazi aperti e collaborativi.',
      'Cultura aziendale calda e celebrativa.',
      'Possibilità di esprimersi creativamente.',
      'Visibilità del proprio contributo.',
      'Flessibilità nei modi di lavorare.',
      'Atmosfera positiva e energica.',
      'Opportunità di parlare in pubblico o presentare.',
      'Leadership che riconosce e valorizza pubblicamente.',
    ],
    motivazione: [
      'Riconoscimento entusiastico del suo lavoro.',
      'Possibilità di lavorare con persone interessanti.',
      'Progetti nuovi e stimolanti.',
      'Visibilità interna ed esterna.',
      'Libertà di esplorare idee originali.',
      'Eventi, lanci, momenti celebrativi.',
      'Ruoli che richiedono comunicazione e relazioni.',
      'Possibilità di costruire e influenzare la cultura.',
      'Feedback positivo frequente e specifico.',
      'Crescita verso ruoli di voce/portavoce.',
    ],
    management: [
      'Guida con visione e calore umano.',
      'Crea atmosfera positiva e ad alta energia.',
      'Tende a coinvolgere il team nelle decisioni.',
      'Fatica nel dare feedback critici diretti.',
      'Può promettere troppo al team e poi non mantenere.',
      'Eccelle nel motivare e ispirare.',
      'A volte trascura la pianificazione e l\'execution.',
      'Riconosce pubblicamente i contributi.',
      'Tende a evitare conflitti aperti tra persone.',
      'Fatica con i collaboratori più tecnici e introversi.',
    ],
  },

  armonia: {
    panoramica: {
      stile: "Sei una persona che porta stabilità, calore e affidabilità ovunque vai. La tua energia è solida e radicata: non cerchi i riflettori, ma sei spesso il pilastro su cui altri si appoggiano. Lavori in profondità sulle relazioni, e per te la fiducia non è un mezzo ma un valore. Hai pazienza, sei un ascoltatore attento, e percepisci i bisogni delle persone prima ancora che vengano espressi. Quando ti impegni in qualcosa, lo fai fino in fondo, e gli altri lo sanno.",
      interazione: "Nelle interazioni sei caloroso, paziente e diplomatico. Cerchi naturalmente l'armonia e fai da mediatore nei conflitti del gruppo. Le persone si confidano con te perché sanno che ascolterai senza giudicare. Tendi però a evitare gli scontri aperti, e questo a volte ti porta a non esprimere i tuoi bisogni o le tue critiche fino a quando il disagio non è diventato significativo. Sei il tipo di persona che ricorda i compleanni, che chiede come è andata la presentazione, che si accorge quando qualcuno è giù di morale.",
      decisione: "Decidi con calma, considerando l'impatto delle scelte sulle persone coinvolte. Non ti senti a tuo agio con le decisioni rapide e impersonali, e ti serve tempo per processare le opzioni. Tendi a consultare le persone di cui ti fidi prima di esprimerti, e a volte rimandi una decisione difficile sperando che la situazione si risolva da sola. Apprezzi la stabilità e tendi a privilegiare opzioni che preservano lo status quo rispetto a cambiamenti drastici.",
    },
    forza: [
      'Affidabile e coerente nel tempo.',
      'Ascoltatore profondo e attento.',
      'Costruttore di relazioni durature e fiduciose.',
      'Paziente nei momenti difficili.',
      'Mediatore naturale nei conflitti.',
      'Empatico e attento ai bisogni altrui.',
      'Stabilizzatore nei team in cambiamento.',
      'Mantiene la calma sotto pressione.',
      'Coerente tra ciò che dice e ciò che fa.',
      'Custode della cultura e dei valori del gruppo.',
    ],
    debolezza: [
      'Tende a evitare i conflitti necessari.',
      'Fatica a esprimere bisogni e dissenso.',
      'Resistenza al cambiamento, anche quando è necessario.',
      'Può accumulare frustrazione senza farlo notare.',
      'Decide lentamente quando serve velocità.',
      'Si carica troppe responsabilità per non deludere.',
      'Difficoltà a dire "no" anche quando dovrebbe.',
      'Può apparire passivo o senza opinioni forti.',
      'Tende a privilegiare il consenso sulla verità.',
      'Rischia di restare bloccato in dinamiche disfunzionali per lealtà.',
    ],
    team: [
      'Tiene unito il gruppo nei momenti difficili.',
      'Crea spazi sicuri per esprimere idee e dubbi.',
      'Fa da ponte tra colleghi in conflitto.',
      'Garantisce continuità e stabilità nei processi.',
      'Si prende cura delle persone nuove arrivate.',
      'Mantiene la memoria storica del team.',
      'Modera i toni quando le tensioni salgono.',
      'Sostiene chi è in difficoltà senza giudizio.',
      'Costruisce fiducia con stakeholder esterni.',
      'Garantisce che nessuno venga lasciato indietro.',
    ],
    comunicazione_si: [
      'Sii caloroso, non solo professionale.',
      'Dagli tempo per processare prima di chiedere risposta.',
      'Mostra interesse genuino per la sua persona, non solo per il lavoro.',
      'Sii coerente: ciò che dici oggi deve valere domani.',
      'Riconosci esplicitamente il suo contributo, anche silenzioso.',
      'Coinvolgilo nelle decisioni che riguardano il team.',
      'Comunica con calma, evita toni urgenti senza necessità.',
      'Crea un clima sicuro per il dissenso.',
      'Segui sempre le promesse fatte.',
      'Chiedi esplicitamente la sua opinione: spesso non te la darà spontaneamente.',
    ],
    comunicazione_no: [
      'Non metterlo sotto pressione per decisioni rapide.',
      'Non interrompere, non sovrappormi alle sue parole.',
      'Non dare per scontata la sua disponibilità.',
      'Non confondere il suo silenzio con l\'accordo.',
      'Non criticarlo in pubblico, mai.',
      'Non rompere accordi presi senza spiegare perché.',
      'Non trascurare la dimensione umana delle decisioni.',
      'Non essere brusco o eccessivamente diretto.',
      'Non parlargli solo quando hai bisogno di qualcosa.',
      'Non cambiare priorità di continuo senza coordinarti.',
    ],
    ignorati: "Potresti non vedere quanto la tua avversione al conflitto ti costi nel lungo periodo. Tendi a inghiottire frustrazioni piuttosto che esprimerle, e questo si accumula fino a esplodere in modi inaspettati o, più spesso, a diventare distacco silenzioso. Le persone intorno a te potrebbero non sapere quando sono andate oltre il tuo limite, perché tu non lo segnali. La tua lealtà, che è una grande forza, può diventare una trappola: resti in situazioni o relazioni che non ti fanno bene per non deludere. Inoltre, il tuo desiderio di armonia ti porta a non sostenere posizioni impopolari anche quando hai ragione, e questo significa che il gruppo perde una voce di saggezza che gli servirebbe.",
    opposto: "Il tuo opposto è l'AZIONE — Il Realizzatore. Dove tu costruisci pazientemente, il Realizzatore conquista rapidamente. Dove tu cerchi armonia, il Realizzatore accetta il conflitto. Dove tu metti le persone al centro, il Realizzatore mette il risultato. Per te può sembrare brusco, impaziente o insensibile — ma la sua capacità di prendere decisioni rapide e di mobilitare il movimento è ciò che genera i risultati che poi tu sai sostenere nel tempo. Per relazionarti meglio: vai al punto rapidamente nelle conversazioni; esprimi le tue posizioni con chiarezza, anche quando temi di scontentarlo; non interpretare la sua direttezza come mancanza di rispetto; accetta che a volte un conflitto ben gestito è meglio di un'armonia apparente.",
    sviluppo: [
      'Esercitati a esprimere il dissenso in tempo reale, non dopo giorni.',
      'Pratica il dire "no" in piccole occasioni, per allenare il muscolo.',
      'Identifica una posizione che tieni e difendila pubblicamente.',
      'Allenati a decidere con tempi più stretti su questioni minori.',
      'Riconosci quando il tuo bisogno di armonia ti sta sabotando.',
      'Distingui tra empatia (ti immedesimi) e fusione (ti dimentichi di te).',
      'Sviluppa il tuo profilo professionale visibile, non solo il contributo silenzioso.',
      'Sperimenta il cambiamento volontario in qualcosa di piccolo.',
      'Chiedi feedback espliciti sul tuo lavoro, non aspettare che arrivino.',
      'Onora i tuoi bisogni con la stessa cura che riservi a quelli altrui.',
    ],
    ambiente: [
      'Cultura aziendale stabile e basata sulla fiducia.',
      'Relazioni di lungo periodo con colleghi e clienti.',
      'Tempi adeguati per processare e decidere.',
      'Leadership coerente e prevedibile.',
      'Spazi di lavoro tranquilli e ordinati.',
      'Valori espliciti e rispettati.',
      'Processi chiari e consolidati.',
      'Riconoscimento del contributo silenzioso.',
      'Possibilità di lavorare in team coesi.',
      'Cambiamenti graduali e ben spiegati.',
    ],
    motivazione: [
      'Sentirsi utile e necessario al gruppo.',
      'Relazioni di fiducia con colleghi e capi.',
      'Stabilità del ruolo e della posizione.',
      'Riconoscimento sincero, non spettacolare.',
      'Valori aziendali allineati ai propri.',
      'Possibilità di aiutare gli altri concretamente.',
      'Cultura del rispetto e della cura.',
      'Continuità dei progetti nel tempo.',
      'Lealtà reciproca con l\'organizzazione.',
      'Possibilità di mentorare e formare altri.',
    ],
    management: [
      'Guida con calma, ascolto e attenzione alle persone.',
      'Crea ambienti stabili e psicologicamente sicuri.',
      'Costruisce team coesi e duraturi.',
      'Fatica a dare feedback critici diretti.',
      'Tende a proteggere troppo i collaboratori, anche da feedback necessari.',
      'Decide lentamente quando serve velocità.',
      'Eccelle nei momenti di crisi relazionale o turnover.',
      'A volte evita conversazioni difficili che dovrebbe avere.',
      'Privilegia la coesione sulla performance, talvolta a discapito di entrambe.',
      'È profondamente leale verso il proprio team.',
    ],
  },

  analisi: {
    panoramica: {
      stile: "Sei una persona profonda, riflessiva e analitica. La tua mente cerca naturalmente la struttura, la coerenza e la verità sotto la superficie. Non ti accontenti di risposte facili: vuoi capire come funzionano le cose, perché sono fatte così, e dove sono i punti deboli del ragionamento. Lavori bene in autonomia, hai bisogno di tempo per pensare, e sei a tuo agio con la complessità intellettuale. Le tue conclusioni, quando arrivano, sono solide perché sono state verificate.",
      interazione: "Sei riservato, misurato nelle parole, e le persone ti percepiscono spesso come distante prima di conoscerti. Non spendi parole inutili, e quando parli ti aspetti che gli altri ascoltino davvero. Hai poca pazienza per il chiacchiericcio, le opinioni superficiali o i ragionamenti emotivi. Le persone più sensibili intorno a te a volte si sentono giudicate, anche quando il tuo intento è solo capire. Sei però profondamente leale verso le persone con cui costruisci una relazione: non sono molte, ma sono quelle che contano.",
      decisione: "Decidi con metodo. Raccogli i dati, analizzi le opzioni, valuti le implicazioni, e solo allora ti pronunci. Hai poca tolleranza per chi salta le fasi e arriva a conclusioni affrettate. Vuoi precisione: una decisione presa con rigore, anche se lenta, vale più di dieci decisioni rapide e approssimative. Sotto pressione mantieni la lucidità, ma fatichi quando devi decidere senza sufficienti informazioni. La tua paura più grande è di sbagliare per superficialità.",
    },
    forza: [
      'Pensatore analitico e rigoroso.',
      'Capace di ragionare su problemi complessi.',
      'Preciso e attento ai dettagli che contano.',
      'Indipendente e produttivo in autonomia.',
      'Resistente alle pressioni emotive nelle decisioni.',
      'Capace di approfondimento e specializzazione.',
      'Mantiene standard di qualità elevati.',
      'Identifica errori logici e debolezze nei ragionamenti.',
      'Lavora con metodo e disciplina.',
      'Costruisce competenze profonde nelle aree di interesse.',
    ],
    debolezza: [
      'Può apparire distante, freddo o supponente.',
      'Tende al perfezionismo paralizzante.',
      'Decide lentamente quando serve velocità.',
      'Difficoltà a esprimere emozioni e dimensione umana.',
      'Critica eccessivamente i ragionamenti altrui.',
      'Sottovaluta l\'aspetto relazionale del lavoro.',
      'Può "scomparire" nelle proprie analisi e isolarsi.',
      'Resiste a decisioni "abbastanza buone" cercando le perfette.',
      'Comunica meno di quanto dovrebbe per coordinarsi.',
      'A volte dà per scontato che gli altri abbiano lo stesso rigore.',
    ],
    team: [
      'Garantisce qualità e rigore al lavoro del gruppo.',
      'Identifica errori e debolezze prima che diventino problemi.',
      'Apporta competenza tecnica profonda.',
      'Stabilizza il gruppo con pensiero lucido sotto pressione.',
      'Costruisce processi e strutture solide.',
      'Verifica le ipotesi prima che diventino decisioni.',
      'Eleva il livello del dibattito intellettuale.',
      'Sa lavorare bene in autonomia su parti complesse.',
      'Difende il rigore quando il gruppo è tentato dalle scorciatoie.',
      'Produce documentazione e analisi affidabili.',
    ],
    comunicazione_si: [
      'Arriva preparato con dati, non solo opinioni.',
      'Dagli tempo per riflettere, non aspettarti risposte immediate.',
      'Sii preciso nelle tue parole: usa termini esatti.',
      'Rispetta il suo bisogno di silenzio e di lavoro autonomo.',
      'Argomenta le tue posizioni con logica e prove.',
      'Accetta le sue domande critiche come segno di interesse.',
      'Permettigli di esplorare la complessità di un problema.',
      'Sii sintetico nelle conversazioni informali.',
      'Riconosci la sua competenza senza adularlo.',
      'Comunica per iscritto le questioni complesse.',
    ],
    comunicazione_no: [
      'Non sostenere posizioni con argomenti puramente emotivi.',
      'Non interromperlo mentre sta ragionando.',
      'Non aspettarti slancio sociale o "small talk".',
      'Non promettere qualcosa che non hai verificato.',
      'Non semplificare eccessivamente questioni complesse.',
      'Non chiedergli decisioni rapide su temi importanti.',
      'Non confondere il suo silenzio con assenso.',
      'Non sopravvalutare l\'effetto del riconoscimento pubblico.',
      'Non pretendere calore dove c\'è rispetto.',
      'Non ignorare le sue obiezioni: sono spesso ben fondate.',
    ],
    ignorati: "Potresti non vedere quanto il tuo distacco apparente venga interpretato dagli altri. Quello che per te è semplicemente concentrazione o riflessione, per chi ti circonda può sembrare freddezza, giudizio, o disinteresse. La tua precisione nel correggere errori altrui può ferire, anche quando il tuo intento è puramente costruttivo. Tendi a comunicare meno di quanto serva: presumi che gli altri capiscano cosa stai pensando, e quando non lo fanno te ne irriti. La tua autonomia, che è una grande forza, ti isola: ti perdi conversazioni informali in cui si decidono cose importanti. Inoltre, il tuo perfezionismo può diventare una scusa per non concludere: 'non è ancora pronto' è spesso più una protezione che una valutazione oggettiva.",
    opposto: "Il tuo opposto è l'ISPIRAZIONE — L'Animatore. Dove tu vai in profondità, l'Animatore va in larghezza. Dove tu cerchi precisione, l'Animatore cerca possibilità. Dove tu lavori in silenzio, l'Animatore lavora ad alta voce. Per te può sembrare superficiale, dispersivo, o eccessivamente sociale — ma la sua capacità di mobilitare persone e idee è ciò che dà visibilità e impatto al lavoro che tu hai costruito con rigore. Per relazionarti meglio: accetta che il suo entusiasmo non sia mancanza di sostanza; partecipa alle interazioni informali, non solo alle riunioni strutturate; esprimi apprezzamento esplicito, anche se ti sembra ovvio; lascia spazio alle sue intuizioni senza criticarle subito.",
    sviluppo: [
      'Allena la comunicazione esplicita: non presumere che gli altri capiscano i tuoi pensieri.',
      'Pratica il "abbastanza buono": consegna prima, perfeziona dopo.',
      'Investi tempo nelle conversazioni informali, anche quando sembrano improduttive.',
      'Distingui tra critica costruttiva e demolizione del lavoro altrui.',
      'Esprimi apprezzamento esplicito, non darlo per scontato.',
      'Identifica un\'area dove devi sviluppare velocità a discapito della precisione.',
      'Allena l\'empatia: chiedi come si sentono le persone, non solo cosa pensano.',
      'Riconosci l\'impatto del tuo tono e del tuo silenzio sugli altri.',
      'Pratica la decisione con dati incompleti come muscolo.',
      'Costruisci alleanze interne: la qualità del tuo lavoro non basta da sola.',
    ],
    ambiente: [
      'Spazi di lavoro silenziosi e poco interrotti.',
      'Tempo adeguato per analisi e approfondimento.',
      'Standard professionali elevati e rispettati.',
      'Persone competenti con cui confrontarsi intellettualmente.',
      'Strumenti tecnici di qualità.',
      'Aspettative chiare e ben definite.',
      'Cultura che valorizza il rigore.',
      'Possibilità di specializzazione profonda.',
      'Distinzione netta tra "drafts" e "finals".',
      'Riconoscimento basato sulla qualità del lavoro.',
    ],
    motivazione: [
      'Possibilità di approfondire una specializzazione.',
      'Problemi complessi e intellettualmente sfidanti.',
      'Riconoscimento della competenza tecnica.',
      'Autonomia di metodo e di tempo.',
      'Ambienti che valorizzano la qualità.',
      'Crescita verso ruoli di esperto/specialista.',
      'Risorse adeguate per fare le cose bene.',
      'Distanza dal "rumore" organizzativo.',
      'Lavoro su sistemi e processi solidi.',
      'Colleghi competenti con cui dibattere a livello tecnico.',
    ],
    management: [
      'Guida con standard elevati e attenzione alla qualità.',
      'Si aspetta autonomia e rigore dai collaboratori.',
      'Decide con metodo, evitando reazioni impulsive.',
      'Tende a sottovalutare la dimensione relazionale.',
      'Può essere percepito come distante o eccessivamente critico.',
      'Eccelle nella strutturazione di processi complessi.',
      'A volte non comunica abbastanza, dando per scontato troppe cose.',
      'Fatica con collaboratori che hanno bisogno di calore e affermazione.',
      'Riconosce competenza ma può ignorare lo sforzo emotivo.',
      'È profondamente leale verso chi dimostra rigore e affidabilità.',
    ],
  },
};

// ============================================================
//  MODULAZIONE SECONDARIA — come il secondario altera il dominante
//  Chiave: `${dominante}_${secondario}` (12 combinazioni)
// ============================================================

const MODULAZIONE_SECONDARIA = {
  azione_ispirazione: "La tua spinta all'azione è amplificata dalla capacità di coinvolgere le persone. Sei il tipo di leader che decide rapidamente e poi sa mobilitare un gruppo dietro alla decisione, vendendo la visione con energia. Eccelli nei ruoli di leadership commerciale, di trasformazione e di lancio. Rischio specifico: la combinazione velocità + persuasione può portarti a far adottare decisioni che non sono state davvero esaminate — l'entusiasmo del momento sostituisce l'analisi.",
  azione_armonia: "Sei un leader decisivo che si preoccupa genuinamente delle persone. Sai prendere decisioni difficili senza diventare freddo, e i tuoi collaboratori avvertono la tua cura sotto la fermezza. Sei adatto a ruoli di leadership operativa in contesti dove conta sia il risultato sia la coesione del team. Rischio specifico: la tensione interna tra il bisogno di risultato e quello di non ferire può portarti a procrastinare le conversazioni difficili, finché non esplodono.",
  azione_analisi: "La tua decisione è informata dal rigore. Non sei impulsivo: agisci rapidamente ma su basi solide. Eccelli in ruoli di leadership tecnica, strategica o di governance. Rischio specifico: combini la durezza dell'Azione con la precisione critica dell'Analisi, e questo può ferire molto chi non ha la stessa pelle dura. Tendi a essere implacabile su standard e tempi.",

  ispirazione_azione: "Trasformi il tuo entusiasmo in movimento. Non sei solo un'idea-broker: sai spingere le idee in azione e portare gli altri con te. Sei il tipo che apre nuovi mercati, lancia iniziative, evangelizza per nuove cause. Rischio specifico: puoi vendere troppo, promettere troppo, partire senza preparazione adeguata. La velocità con cui passi dall'idea all'azione lascia poco spazio alla verifica.",
  ispirazione_armonia: "Combini il calore comunicativo con la cura profonda delle persone. Sei un facilitatore naturale: fai sentire tutti visti, e le persone si aprono con te facilmente. Sei adatto a ruoli di people leadership, coaching, sviluppo del team. Rischio specifico: puoi diventare emotivamente esposto — assorbi le tensioni del gruppo e fatichi a porre limiti quando qualcuno chiede troppo. Rischi il burnout relazionale.",
  ispirazione_analisi: "Sei un comunicatore con sostanza. Non parli solo per parlare: hai studiato, hai approfondito, e poi sai rendere accessibile la complessità. Sei adatto a ruoli di formazione, divulgazione, consulenza, advocacy intellettuale. Rischio specifico: la tensione tra il bisogno di socialità e quello di rigore può lasciarti nel mezzo, mai del tutto soddisfatto né dalla profondità né dal calore.",

  armonia_azione: "Sei un leader che non cerca i riflettori, ma quando serve sa prendere posizione. La tua decisività emerge soprattutto a difesa delle persone o dei valori in cui credi. Sei adatto a ruoli di servant leadership, gestione di team consolidati, ruoli istituzionali. Rischio specifico: tendi a tollerare troppo a lungo, e quando finalmente agisci la decisione può apparire improvvisa o sproporzionata — perché il gruppo non ha visto l'accumulo.",
  armonia_ispirazione: "Combini la profondità relazionale con il calore comunicativo. Sei un tessitore di reti — connetti persone, costruisci comunità, mantieni vivi i legami nel tempo. Sei adatto a ruoli di community building, partnership management, mentorship. Rischio specifico: puoi accumulare troppe relazioni, sentirti responsabile del benessere di tutti, e finire emotivamente prosciugato. Il tuo calore diventa una risorsa che tutti attingono.",
  armonia_analisi: "Combini cura e rigore. Sei la persona a cui ci si rivolge per consigli ponderati: ascolti davvero, rifletti a fondo, e quando rispondi le tue parole hanno peso. Sei adatto a ruoli di mentorship, advisory, ricerca applicata. Rischio specifico: la riflessività profonda sommata all'evitamento del conflitto può renderti invisibile organizzativamente — fai un lavoro di grande valore che pochi vedono e che fatica a essere riconosciuto.",

  analisi_azione: "Sei un pensatore che agisce. Quando hai analizzato a fondo, decidi e implementi senza esitazioni. Sei adatto a ruoli di technical leadership, architettura di sistemi, governance, security. Rischio specifico: la tua direttezza nell'esprimere conclusioni può intimidire — hai ragione, ma il modo in cui la presenti può chiudere conversazioni che sarebbero state utili. Le tue critiche, anche corrette, possono pesare più del previsto.",
  analisi_ispirazione: "Hai la profondità del pensatore e la capacità di renderla viva. Non sei lo specialista che si chiude in silenzio: sai spiegare la complessità in modo coinvolgente. Sei adatto a ruoli di research advocacy, divulgazione tecnica, consulenza espositiva. Rischio specifico: puoi essere percepito come 'più bravo a parlarne che a farlo' — la tua capacità comunicativa può oscurare quanto effettivamente produci di sostanza.",
  analisi_armonia: "Sei un pensatore che rispetta le persone. Combini il rigore intellettuale con la sensibilità: critichi le idee senza umiliare chi le porta. Sei adatto a ruoli di ricerca, advisory, mentorship tecnica, qualità. Rischio specifico: i due lati introversi possono spingerti all'isolamento — fatichi a far valere la tua voce in contesti molto politici o competitivi, e il tuo contributo può essere appropriato da altri più visibili.",
};

// ============================================================
//  INTERPRETAZIONE GAP COSCIENTE ↔ SOTTO PRESSIONE
// ============================================================

function interpretStressGap(scores, stressScores, dominantKey) {
  const deltas = {};
  Object.keys(scores).forEach(k => {
    deltas[k] = stressScores[k] - scores[k];
  });

  const sorted = Object.entries(deltas).sort((a, b) => b[1] - a[1]);
  const exaggerated = sorted[0]; // [key, delta] — più alto sotto stress
  const abandoned = sorted[sorted.length - 1]; // [key, delta] — più basso sotto stress
  const maxAbsDelta = Math.max(...Object.values(deltas).map(Math.abs));

  // Caso 1: profilo stabile (tutti i gap < 12 punti)
  if (maxAbsDelta < 12) {
    return {
      summary: "Il tuo profilo cambia poco sotto pressione.",
      narrative: `Il tuo modo di funzionare resta sostanzialmente coerente anche quando sei stanco o sopraffatto: i gap tra persona cosciente e sotto pressione sono inferiori a 12 punti su tutte e quattro le energie. Questo è un segno di buon equilibrio interno e di consapevolezza dei tuoi pattern. Attenzione però: stabilità apparente può anche significare che hai già imparato a mascherare bene lo stress, anche con te stesso. Vale comunque la pena chiederti: c'è una persona della tua vita che vede una versione di te diversa quando sei sotto pressione? Cosa noterebbe?`,
      hasAbandonedSignal: false,
    };
  }

  const exKey = exaggerated[0];
  const exDelta = exaggerated[1];
  const abKey = abandoned[0];
  const abDelta = abandoned[1];

  // Caso 2: collasso generale — anche il delta massimo è ≤ 0
  // → tutte le energie scendono sotto stress: pattern di shutdown/esaurimento
  if (exDelta <= 0) {
    return {
      summary: "Sotto pressione tutte le tue energie si abbassano.",
      narrative: `Il dato più rilevante è che nessuna delle tue energie si amplifica sotto pressione: tutte e quattro scendono, e la più colpita è la tua ${ELEMENTS[abKey].name.toLowerCase()} (${abDelta} punti). Questo è un pattern di shutdown — un segnale di esaurimento, non di equilibrio. Quando sei sopraffatto, invece di esagerare il tuo dominante (che è la risposta più comune), tendi a "spegnerti" su tutti i fronti. Vale la pena guardare con attenzione: stai gestendo un carico cronicamente troppo alto? Stai recuperando abbastanza? Le persone che ti sono vicine probabilmente percepiscono il tuo ritiro più di quanto pensi.`,
      hasAbandonedSignal: true,
      exaggeratedKey: exKey,
      abandonedKey: abKey,
      deltas,
    };
  }

  // Frammenti narrativi per energia che si esagera
  const exaggerationText = {
    azione: `la tua **Azione si esagera** (+${exDelta} punti). Sotto pressione diventi più impositivo, decisi ancor più rapidamente, hai meno pazienza con chi non sta al tuo passo. La tua decisività — che è una forza nei momenti normali — sotto stress può diventare brutalità.`,
    ispirazione: `la tua **Ispirazione si esagera** (+${exDelta} punti). Sotto pressione parli ancora di più, cerchi rassicurazione costante, salti da un'attività all'altra senza concludere. La tua energia espansiva — che normalmente coinvolge — sotto stress diventa dispersione.`,
    armonia: `la tua **Armonia si esagera** (+${exDelta} punti). Sotto pressione ti chiudi ancora di più, dici "sì" a cose con cui non sei d'accordo, eviti di esprimere il dissenso anche quando sarebbe necessario. La tua diplomazia — che normalmente costruisce ponti — sotto stress diventa autocensura.`,
    analisi: `la tua **Analisi si esagera** (+${exDelta} punti). Sotto pressione ti blocchi nell'analisi ulteriore, ti isoli, diventi ancora più critico verso gli altri. Il tuo rigore — che normalmente protegge la qualità — sotto stress diventa paralisi e giudizio.`,
  };

  // Frammenti per energia che viene abbandonata
  const abandonmentText = {
    azione: `Allo stesso tempo, abbandoni la tua Azione (${abDelta} punti): perdi la decisività che ti servirebbe per uscire dallo stallo.`,
    ispirazione: `Allo stesso tempo, abbandoni la tua Ispirazione (${abDelta} punti): perdi il calore comunicativo che ti aiuterebbe a chiedere supporto.`,
    armonia: `Allo stesso tempo, abbandoni la tua Armonia (${abDelta} punti): perdi la cura delle relazioni che ti serve proprio quando le tensioni salgono.`,
    analisi: `Allo stesso tempo, abbandoni la tua Analisi (${abDelta} punti): perdi la lucidità riflessiva che ti aiuterebbe a vedere chiaro.`,
  };

  const isDominantExaggerated = exKey === dominantKey;
  let summary;
  if (isDominantExaggerated) {
    summary = `Sotto pressione, il tuo dominante (${ELEMENTS[dominantKey].name}) si amplifica ulteriormente.`;
  } else {
    summary = `Sotto pressione, emerge una versione diversa di te: la tua ${ELEMENTS[exKey].name.toLowerCase()} prende il sopravvento.`;
  }

  const narrative = `Il grafico mostra come cambi quando sei stanco, sopraffatto o in difficoltà. Lo scarto più grande è chiaro: ${exaggerationText[exKey]} ${abDelta < -8 ? abandonmentText[abKey] : ''} ${
    isDominantExaggerated
      ? "Questa traiettoria è coerente con il tuo profilo: le tue qualità migliori esagerate diventano i tuoi punti deboli sotto stress. La saggezza qui non è cambiare chi sei, ma riconoscere quando la tua forza sta superando il punto di equilibrio."
      : "Interessante: il tuo dominante non è quello che si esagera di più sotto stress. Questo può significare che la tua energia secondaria emerge in modo più reattivo, oppure che hai sviluppato sopra il dominante una versione più matura, lasciando la tua reazione automatica altrove."
  }`;

  return {
    summary,
    narrative,
    hasAbandonedSignal: abDelta < -8,
    exaggeratedKey: exKey,
    abandonedKey: abKey,
    deltas,
  };
}

// ============================================================
//  CALCOLO DEI PUNTEGGI
// ============================================================

function calculateScores(answers, pool) {
  const totals = { azione: 0, ispirazione: 0, armonia: 0, analisi: 0 };
  const counts = { azione: 0, ispirazione: 0, armonia: 0, analisi: 0 };
  pool.forEach((q, i) => {
    const v = answers[i];
    if (v != null) {
      // Item reverse-coded: alto accordo = basso punteggio per quell'energia.
      // Su scala 1-5, l'inversione è (6 - v): 5→1, 4→2, 3→3, 2→4, 1→5.
      const score = q.r ? (6 - v) : v;
      totals[q.e] += score;
      counts[q.e] += 1;
    }
  });
  const norm = {};
  Object.keys(totals).forEach(k => {
    const raw = totals[k];
    const min = counts[k] * 1;
    const max = counts[k] * 5;
    norm[k] = max > min ? Math.round(((raw - min) / (max - min)) * 100) : 0;
  });
  return norm;
}

function rankElements(scores) {
  return Object.entries(scores)
    .sort((a, b) => b[1] - a[1])
    .map(([k]) => k);
}

// ============================================================
//  COMPONENTI UI
// ============================================================

function FontInjector() {
  useEffect(() => {
    const id = 'pqe-fonts';
    if (document.getElementById(id)) return;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@300;400;500;600;700&display=swap';
    document.head.appendChild(link);

    const style = document.createElement('style');
    style.id = 'pqe-print-styles';
    style.textContent = `
      @media print {
        @page { size: A4; margin: 18mm 16mm; }
        body { background: white !important; }
        .no-print { display: none !important; }
        .print-only { display: block !important; }
        .print-page-break { page-break-after: always; }
        .print-avoid-break { page-break-inside: avoid; }
        .pqe-shell { background: white !important; padding: 0 !important; }
        .pqe-card { box-shadow: none !important; border: 1px solid #ddd !important; }
      }
      .print-only { display: none; }
      .pqe-display { font-family: 'Fraunces', 'Iowan Old Style', Georgia, serif; }
      .pqe-body { font-family: 'Inter', -apple-system, sans-serif; }
    `;
    document.head.appendChild(style);
  }, []);
  return null;
}

// --- LANDING ---
function Landing({ onStart }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12" style={{ background: '#F4EFE6' }}>
      <div className="max-w-3xl w-full">
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px flex-1" style={{ background: '#1A1A1A' }} />
            <span className="pqe-body text-xs tracking-[0.3em] uppercase" style={{ color: '#1A1A1A' }}>Strumento di autovalutazione</span>
            <div className="h-px flex-1" style={{ background: '#1A1A1A' }} />
          </div>
        </div>

        <h1 className="pqe-display text-6xl md:text-8xl leading-[0.95] mb-6" style={{ color: '#1A1A1A', fontWeight: 400, fontStyle: 'italic' }}>
          Profilo dei<br/>
          <span style={{ fontStyle: 'normal', fontWeight: 600 }}>Quattro Energie</span>
        </h1>

        <p className="pqe-body text-lg leading-relaxed mb-12 max-w-2xl" style={{ color: '#3A3A3A' }}>
          Un questionario in due parti — 76 affermazioni sulla tua <em>persona cosciente</em> e 12 brevi domande
          su come ti comporti <em>sotto pressione</em> — costruito sulla tipologia psicologica di Carl Gustav Jung.
          Mappa le tue energie dominanti — Azione, Ispirazione, Armonia, Analisi — e restituisce un report dettagliato
          su stile personale, comunicazione, lavoro in team, leadership e aree di sviluppo.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-12">
          {Object.values(ELEMENTS).map(el => {
            const Icon = el.icon;
            return (
              <div key={el.key} className="pqe-card p-5 print-avoid-break" style={{ background: el.colorLight, borderLeft: `3px solid ${el.color}` }}>
                <Icon size={20} style={{ color: el.colorDark }} className="mb-3" />
                <div className="pqe-display text-sm tracking-wider mb-1" style={{ color: el.colorDark, fontWeight: 600 }}>{el.name}</div>
                <div className="pqe-body text-xs" style={{ color: el.colorDark }}>{el.archetype}</div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-10">
          <button
            onClick={onStart}
            className="pqe-body group inline-flex items-center gap-3 px-8 py-4 text-white tracking-wide hover:opacity-90 transition"
            style={{ background: '#1A1A1A', fontWeight: 500 }}
          >
            <span>Inizia il questionario</span>
            <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
          </button>
          <div className="pqe-body text-sm" style={{ color: '#6B6B6B' }}>
            Tempo: 18–22 minuti · 88 affermazioni totali · scala 1–5
          </div>
        </div>

        <div className="pqe-card p-6 mb-8" style={{ background: '#FBF7EE', borderLeft: '3px solid #5F7340' }}>
          <div className="pqe-body text-xs tracking-[0.25em] uppercase mb-4" style={{ color: '#3F4D2A', fontWeight: 600 }}>
            Uso appropriato
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <div className="pqe-display text-sm mb-2 flex items-center gap-2" style={{ color: '#3F4D2A', fontWeight: 600 }}>
                <CheckCircle2 size={14} /> Va bene per
              </div>
              <ul className="pqe-body text-sm space-y-1.5" style={{ color: '#3A3A3A' }}>
                <li>— Autoesplorazione personale</li>
                <li>— Dialogo e retrospettive di team</li>
                <li>— Kickoff di workshop</li>
                <li>— Generare conversazione tra colleghi</li>
                <li>— Riflessione sulle proprie reazioni sotto stress</li>
              </ul>
            </div>
            <div>
              <div className="pqe-display text-sm mb-2 flex items-center gap-2" style={{ color: '#7A2A1C', fontWeight: 600 }}>
                <AlertTriangle size={14} /> NON va bene per
              </div>
              <ul className="pqe-body text-sm space-y-1.5" style={{ color: '#3A3A3A' }}>
                <li>— Selezione del personale</li>
                <li>— Decisioni di carriera o promozione</li>
                <li>— Valutazioni di performance</li>
                <li>— Diagnosi clinica o psicologica</li>
                <li>— Qualsiasi uso "diagnostico" sulla persona</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pqe-body text-xs leading-relaxed pt-8 border-t" style={{ color: '#6B6B6B', borderColor: '#D5CFC1' }}>
          <strong style={{ color: '#1A1A1A' }}>Nota tecnica.</strong> Strumento originale ispirato alla tipologia junghiana (Jung, <em>Tipi Psicologici</em>, 1921 — pubblico dominio).
          Non è uno strumento psicometrico validato né una replica di prodotti commerciali (Insights Discovery®, MBTI®, DISC® sono marchi registrati dei rispettivi proprietari).
          Per la valutazione professionale rivolgersi a uno psicologo certificato.
        </div>
      </div>
    </div>
  );
}

// --- TEST ---
function Test({ questions, answers, setAnswers, onComplete, onBack, phase = 'conscious', phaseLabel, instructionTitle, accentColor = '#1A1A1A' }) {
  const [page, setPage] = useState(0);
  const perPage = 8;
  const totalPages = Math.ceil(questions.length / perPage);
  const start = page * perPage;
  const pageQuestions = questions.slice(start, start + perPage);
  const answeredCount = answers.filter(a => a != null).length;
  const allAnswered = answeredCount === questions.length;
  const pageAnswered = pageQuestions.every((_, i) => answers[start + i] != null);

  const handleAnswer = (idx, value) => {
    const next = [...answers];
    next[start + idx] = value;
    setAnswers(next);
  };

  const labels = ['Per nulla', 'Poco', 'Né sì né no', 'Abbastanza', 'Molto'];

  return (
    <div className="min-h-screen px-6 py-12" style={{ background: '#F4EFE6' }}>
      <div className="max-w-3xl mx-auto">
        {/* Phase badge */}
        {phaseLabel && (
          <div className="mb-3">
            <span className="pqe-body inline-block text-[10px] tracking-[0.3em] uppercase px-3 py-1.5" style={{ background: accentColor, color: 'white' }}>
              {phaseLabel}
            </span>
          </div>
        )}

        {/* Progress */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <span className="pqe-body text-xs tracking-[0.25em] uppercase" style={{ color: '#1A1A1A' }}>
              Sezione {page + 1} di {totalPages}
            </span>
            <span className="pqe-body text-xs" style={{ color: '#6B6B6B' }}>
              {answeredCount} / {questions.length} risposte
            </span>
          </div>
          <div className="h-1 bg-stone-300 relative overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 transition-all duration-300"
              style={{ width: `${(answeredCount / questions.length) * 100}%`, background: accentColor }}
            />
          </div>
        </div>

        <h2 className="pqe-display text-3xl md:text-4xl mb-8" style={{ color: '#1A1A1A', fontWeight: 500 }}>
          {instructionTitle || "Quanto sei d'accordo con queste affermazioni?"}
        </h2>

        <div className="space-y-4 mb-10">
          {pageQuestions.map((q, idx) => {
            const globalIdx = start + idx;
            const current = answers[globalIdx];
            return (
              <div key={globalIdx} className="pqe-card bg-white p-6 shadow-sm">
                <div className="pqe-body text-base mb-4 leading-relaxed" style={{ color: '#1A1A1A' }}>
                  <span className="pqe-display italic mr-2" style={{ color: '#9A8F7C' }}>{globalIdx + 1}.</span>
                  {q.t}
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map(v => {
                    const selected = current === v;
                    return (
                      <button
                        key={v}
                        onClick={() => handleAnswer(idx, v)}
                        className={`pqe-body text-xs py-3 px-2 transition border ${selected ? 'text-white' : 'hover:bg-stone-100'}`}
                        style={{
                          background: selected ? accentColor : 'white',
                          borderColor: selected ? accentColor : '#D5CFC1',
                          color: selected ? 'white' : '#1A1A1A',
                          fontWeight: selected ? 500 : 400,
                        }}
                      >
                        <div className="text-base font-semibold mb-1">{v}</div>
                        <div className="text-[10px] leading-tight">{labels[v - 1]}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => page === 0 ? onBack() : setPage(page - 1)}
            className="pqe-body inline-flex items-center gap-2 px-6 py-3 hover:bg-stone-200 transition"
            style={{ color: '#1A1A1A' }}
          >
            <ChevronLeft size={16} />
            <span>{page === 0 ? 'Indietro' : 'Sezione precedente'}</span>
          </button>

          {page < totalPages - 1 ? (
            <button
              onClick={() => { setPage(page + 1); window.scrollTo(0, 0); }}
              disabled={!pageAnswered}
              className="pqe-body inline-flex items-center gap-2 px-6 py-3 text-white transition disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: accentColor }}
            >
              <span>Sezione successiva</span>
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={onComplete}
              disabled={!allAnswered}
              className="pqe-body inline-flex items-center gap-2 px-8 py-3 text-white transition disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ background: phase === 'stress' ? '#B8412C' : accentColor, fontWeight: 500 }}
            >
              <span>{phase === 'stress' ? 'Vedi il mio profilo completo' : 'Continua'}</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// --- RESULTS ---
function EnergyChart({ scores }) {
  const max = Math.max(...Object.values(scores), 1);
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 print-avoid-break">
      {Object.values(ELEMENTS).map(el => {
        const score = scores[el.key];
        const Icon = el.icon;
        return (
          <div key={el.key} className="pqe-card p-5" style={{ background: el.colorLight, borderTop: `3px solid ${el.color}` }}>
            <div className="flex items-center justify-between mb-3">
              <Icon size={20} style={{ color: el.colorDark }} />
              <div className="pqe-display text-3xl" style={{ color: el.colorDark, fontWeight: 600 }}>
                {score}
              </div>
            </div>
            <div className="pqe-display text-xs tracking-wider mb-1" style={{ color: el.colorDark, fontWeight: 600 }}>{el.name}</div>
            <div className="pqe-body text-xs mb-3" style={{ color: el.colorDark, opacity: 0.8 }}>{el.archetype}</div>
            <div className="h-2 bg-white/60 relative overflow-hidden">
              <div
                className="absolute inset-y-0 left-0"
                style={{ width: `${score}%`, background: el.color }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// --- DUAL ENERGY CHART (Cosciente vs Sotto Pressione) ---
function DualEnergyChart({ consciousScores, stressScores }) {
  const order = ['azione', 'ispirazione', 'armonia', 'analisi'];
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const maxR = 120;

  // Polar coordinates: 4 axes at 0, 90, 180, 270 degrees
  const angles = {
    azione: -Math.PI / 2,        // top
    ispirazione: 0,              // right
    analisi: Math.PI / 2,        // bottom
    armonia: Math.PI,            // left
  };

  const pointFor = (key, value) => {
    const angle = angles[key];
    const r = (value / 100) * maxR;
    return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
  };

  const consciousPath = order.map(k => pointFor(k, consciousScores[k]));
  const stressPath = order.map(k => pointFor(k, stressScores[k]));

  const toPolygon = (pts) => pts.map(p => p.join(',')).join(' ');

  return (
    <div className="pqe-card p-6 print-avoid-break" style={{ background: 'white', borderTop: '3px solid #1A1A1A' }}>
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* RADAR */}
        <div className="shrink-0">
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
            {/* Grid circles */}
            {[0.25, 0.5, 0.75, 1].map(f => (
              <circle key={f} cx={cx} cy={cy} r={maxR * f} fill="none" stroke="#D5CFC1" strokeWidth="1" />
            ))}
            {/* Axes lines */}
            {order.map(k => {
              const [x, y] = pointFor(k, 100);
              return <line key={k} x1={cx} y1={cy} x2={x} y2={y} stroke="#D5CFC1" strokeWidth="1" />;
            })}
            {/* Stress polygon (less conscious) - dashed outline */}
            <polygon
              points={toPolygon(stressPath)}
              fill="rgba(154, 143, 124, 0.15)"
              stroke="#9A8F7C"
              strokeWidth="1.5"
              strokeDasharray="4 3"
            />
            {/* Conscious polygon - solid */}
            <polygon
              points={toPolygon(consciousPath)}
              fill="rgba(26, 26, 26, 0.08)"
              stroke="#1A1A1A"
              strokeWidth="2"
            />
            {/* Element points - conscious */}
            {order.map(k => {
              const [x, y] = pointFor(k, consciousScores[k]);
              return <circle key={`c-${k}`} cx={x} cy={y} r="4" fill={ELEMENTS[k].color} />;
            })}
            {/* Element points - stress */}
            {order.map(k => {
              const [x, y] = pointFor(k, stressScores[k]);
              return <circle key={`s-${k}`} cx={x} cy={y} r="3" fill="white" stroke={ELEMENTS[k].color} strokeWidth="1.5" />;
            })}
            {/* Labels */}
            {order.map(k => {
              const el = ELEMENTS[k];
              const [x, y] = pointFor(k, 100);
              const offsetX = k === 'ispirazione' ? 14 : k === 'armonia' ? -14 : 0;
              const offsetY = k === 'azione' ? -10 : k === 'analisi' ? 16 : 4;
              const anchor = k === 'ispirazione' ? 'start' : k === 'armonia' ? 'end' : 'middle';
              return (
                <text
                  key={`l-${k}`}
                  x={x + offsetX}
                  y={y + offsetY}
                  textAnchor={anchor}
                  className="pqe-display"
                  fontSize="11"
                  fontWeight="600"
                  fill={el.colorDark}
                  letterSpacing="1"
                >
                  {el.name}
                </text>
              );
            })}
          </svg>
        </div>

        {/* LEGEND + DETAIL */}
        <div className="flex-1 w-full">
          <div className="mb-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-3" style={{ background: 'rgba(26, 26, 26, 0.15)', borderTop: '2px solid #1A1A1A' }} />
              <div>
                <div className="pqe-display text-sm font-semibold" style={{ color: '#1A1A1A' }}>Persona Cosciente</div>
                <div className="pqe-body text-xs" style={{ color: '#6B6B6B' }}>Come ti vedi e come agisci normalmente</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-3" style={{ background: 'rgba(154, 143, 124, 0.2)', borderTop: '2px dashed #9A8F7C' }} />
              <div>
                <div className="pqe-display text-sm font-semibold" style={{ color: '#1A1A1A' }}>Persona Meno Cosciente</div>
                <div className="pqe-body text-xs" style={{ color: '#6B6B6B' }}>Come tendi a comportarti sotto pressione</div>
              </div>
            </div>
          </div>

          {/* Numeric comparison */}
          <div className="space-y-2.5 pt-4 border-t" style={{ borderColor: '#D5CFC1' }}>
            {order.map(k => {
              const el = ELEMENTS[k];
              const c = consciousScores[k];
              const s = stressScores[k];
              const delta = s - c;
              return (
                <div key={k} className="flex items-center gap-3">
                  <div className="pqe-display text-xs w-24" style={{ color: el.colorDark, fontWeight: 600 }}>
                    {el.name}
                  </div>
                  <div className="pqe-display text-sm w-10 text-right" style={{ color: '#1A1A1A', fontWeight: 600 }}>{c}</div>
                  <div className="text-xs" style={{ color: '#9A8F7C' }}>→</div>
                  <div className="pqe-display text-sm w-10 text-right" style={{ color: '#9A8F7C' }}>{s}</div>
                  <div className="pqe-body text-xs ml-2" style={{ color: delta > 5 ? '#B8412C' : delta < -5 ? '#1E5470' : '#9A8F7C' }}>
                    {delta > 5 ? `↑ +${delta}` : delta < -5 ? `↓ ${delta}` : '~'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- TRANSITION (between conscious and stress phases) ---
function Transition({ onContinue }) {
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12" style={{ background: '#F4EFE6' }}>
      <div className="max-w-2xl w-full">
        <div className="pqe-body text-xs tracking-[0.3em] uppercase mb-4" style={{ color: '#9A8F7C' }}>
          Hai completato la prima parte
        </div>
        <h2 className="pqe-display text-4xl md:text-5xl mb-6 leading-tight" style={{ color: '#1A1A1A', fontWeight: 500, fontStyle: 'italic' }}>
          Ora pensa a te <strong style={{ fontStyle: 'normal' }}>sotto pressione.</strong>
        </h2>
        <p className="pqe-body text-base leading-relaxed mb-4" style={{ color: '#3A3A3A' }}>
          Le risposte che hai dato finora descrivono la tua <strong>persona cosciente</strong> — come ti vedi e come agisci nelle situazioni normali.
        </p>
        <p className="pqe-body text-base leading-relaxed mb-4" style={{ color: '#3A3A3A' }}>
          Ora ti chiediamo di pensare a come ti comporti quando sei <strong>stanco, sopraffatto, sotto stress o pressione</strong>. Spesso in quei momenti emergono comportamenti diversi — più automatici, meno filtrati. È quella che Jung chiamava la <em>persona meno cosciente</em>.
        </p>
        <p className="pqe-body text-base leading-relaxed mb-10" style={{ color: '#3A3A3A' }}>
          Sono solo <strong>12 brevi affermazioni</strong>. Rispondi con sincerità: nessuno vedrà queste risposte tranne te.
        </p>

        <div className="pqe-card p-5 mb-10" style={{ background: '#EFE6D5', borderLeft: '3px solid #9A8F7C' }}>
          <div className="pqe-body text-xs tracking-wider uppercase mb-2" style={{ color: '#6B5A3F', fontWeight: 600 }}>
            Suggerimento
          </div>
          <p className="pqe-body text-sm" style={{ color: '#3A3A3A' }}>
            Pensa a un momento recente in cui ti sei sentito davvero sopraffatto — un periodo intenso di lavoro, un conflitto, una scadenza serrata. Come ti comportavi? Cosa facevi <em>davvero</em>, anche se forse non vorresti ammetterlo?
          </p>
        </div>

        <button
          onClick={onContinue}
          className="pqe-body inline-flex items-center gap-3 px-8 py-4 text-white"
          style={{ background: '#1A1A1A', fontWeight: 500 }}
        >
          <span>Continua con la seconda parte</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

function ReportSection({ icon: Icon, title, subtitle, children, color = '#1A1A1A' }) {
  return (
    <section className="mb-12 print-avoid-break">
      <div className="flex items-start gap-4 mb-5 pb-3 border-b" style={{ borderColor: '#D5CFC1' }}>
        <div className="mt-1" style={{ color }}>
          <Icon size={22} strokeWidth={1.5} />
        </div>
        <div>
          <h3 className="pqe-display text-2xl md:text-3xl leading-tight mb-1" style={{ color: '#1A1A1A', fontWeight: 500 }}>
            {title}
          </h3>
          {subtitle && <div className="pqe-body text-xs tracking-wider uppercase" style={{ color: '#9A8F7C' }}>{subtitle}</div>}
        </div>
      </div>
      <div className="pqe-body" style={{ color: '#2A2A2A' }}>
        {children}
      </div>
    </section>
  );
}

function BulletList({ items, color = '#1A1A1A' }) {
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-3 leading-relaxed">
          <span className="pqe-display mt-0.5 shrink-0" style={{ color, fontWeight: 600 }}>—</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Results({ name, scores, stressScores, onRestart }) {
  const ranked = rankElements(scores);
  const dominant = ranked[0];
  const secondary = ranked[1];
  const least = ranked[3];
  const dominantEl = ELEMENTS[dominant];
  const secondaryEl = ELEMENTS[secondary];
  const oppositeKey = OPPOSITE[dominant];
  const oppositeEl = ELEMENTS[oppositeKey];
  const report = REPORT[dominant];

  const handlePrint = () => window.print();

  const dateStr = new Date().toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="pqe-shell min-h-screen" style={{ background: '#F4EFE6' }}>
      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-10 no-print">
          <div className="pqe-body text-xs tracking-[0.25em] uppercase" style={{ color: '#1A1A1A' }}>
            Report personale
          </div>
          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="pqe-body inline-flex items-center gap-2 px-4 py-2 text-sm border hover:bg-white/50 transition"
              style={{ borderColor: '#1A1A1A', color: '#1A1A1A' }}
            >
              <Printer size={14} />
              <span>Salva PDF / Stampa</span>
            </button>
            <button
              onClick={onRestart}
              className="pqe-body inline-flex items-center gap-2 px-4 py-2 text-sm hover:bg-white/50 transition"
              style={{ color: '#6B6B6B' }}
            >
              <RotateCcw size={14} />
              <span>Ricomincia</span>
            </button>
          </div>
        </div>

        {/* COVER */}
        <div className="mb-12 print-page-break">
          <div className="pqe-body text-xs tracking-[0.3em] uppercase mb-4" style={{ color: '#9A8F7C' }}>
            Profilo delle Quattro Energie
          </div>
          <h1 className="pqe-display text-5xl md:text-7xl leading-[0.95] mb-6" style={{ color: '#1A1A1A', fontWeight: 500 }}>
            {name || 'Profilo personale'}
          </h1>
          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-2 mb-10">
            <div className="pqe-display text-2xl italic" style={{ color: dominantEl.color }}>
              {dominantEl.archetype}
            </div>
            <div className="pqe-body text-sm" style={{ color: '#6B6B6B' }}>
              con energia secondaria {secondaryEl.name.toLowerCase()}
            </div>
          </div>

          <p className="pqe-body text-base md:text-lg leading-relaxed max-w-2xl mb-10" style={{ color: '#2A2A2A' }}>
            La tua energia dominante è <strong>{dominantEl.name}</strong>: {dominantEl.essence.toLowerCase()}
            La tua energia secondaria, <strong>{secondaryEl.name}</strong>, modula questo profilo aggiungendo
            sfumature di {secondaryEl.tagline.toLowerCase()}.
          </p>

          <EnergyChart scores={scores} />

          <div className="pqe-body text-xs mt-6 flex items-center gap-4" style={{ color: '#9A8F7C' }}>
            <span>{dateStr}</span>
            <span>·</span>
            <span>88 quesiti completati</span>
          </div>
        </div>

        {/* PANORAMICA */}
        <ReportSection icon={Eye} title="Panoramica generale" subtitle="Stile personale, interazione, decisione" color={dominantEl.color}>
          <div className="space-y-5">
            <div>
              <h4 className="pqe-display text-lg mb-2" style={{ color: dominantEl.colorDark, fontWeight: 600 }}>Lo stile personale</h4>
              <p className="leading-relaxed">{report.panoramica.stile}</p>
            </div>
            <div>
              <h4 className="pqe-display text-lg mb-2" style={{ color: dominantEl.colorDark, fontWeight: 600 }}>L'interazione con gli altri</h4>
              <p className="leading-relaxed">{report.panoramica.interazione}</p>
            </div>
            <div>
              <h4 className="pqe-display text-lg mb-2" style={{ color: dominantEl.colorDark, fontWeight: 600 }}>Il processo decisionale</h4>
              <p className="leading-relaxed">{report.panoramica.decisione}</p>
            </div>
          </div>
        </ReportSection>

        {/* MODULAZIONE SECONDARIA */}
        {(() => {
          const modKey = `${dominant}_${secondary}`;
          const modText = MODULAZIONE_SECONDARIA[modKey];
          if (!modText) return null;
          return (
            <ReportSection
              icon={Compass}
              title={`${dominantEl.archetype} con sfumatura ${secondaryEl.archetype.toLowerCase().replace("l'", "")}`}
              subtitle={`Modulazione secondaria · ${dominantEl.name} + ${secondaryEl.name}`}
              color={dominantEl.color}
            >
              <div className="pqe-card p-4 mb-5 flex items-center gap-4" style={{ background: '#FBF7EE', borderLeft: `3px solid ${dominantEl.color}` }}>
                <div className="flex items-center gap-2">
                  {(() => { const I = dominantEl.icon; return <I size={18} style={{ color: dominantEl.color }} />; })()}
                  <span className="pqe-display text-sm" style={{ color: dominantEl.colorDark, fontWeight: 600 }}>{dominantEl.name}</span>
                </div>
                <span className="pqe-body text-xs" style={{ color: '#9A8F7C' }}>+</span>
                <div className="flex items-center gap-2">
                  {(() => { const I = secondaryEl.icon; return <I size={16} style={{ color: secondaryEl.color }} />; })()}
                  <span className="pqe-display text-sm" style={{ color: secondaryEl.colorDark, fontWeight: 600 }}>{secondaryEl.name}</span>
                </div>
              </div>
              <p className="leading-relaxed">{modText}</p>
            </ReportSection>
          );
        })()}

        {/* FORZA / DEBOLEZZE */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <ReportSection icon={Award} title="Punti di forza" color={dominantEl.color}>
            <BulletList items={report.forza} color={dominantEl.color} />
          </ReportSection>
          <ReportSection icon={AlertTriangle} title="Aree di sviluppo" color={dominantEl.color}>
            <BulletList items={report.debolezza} color={dominantEl.color} />
          </ReportSection>
        </div>

        {/* TEAM */}
        <ReportSection icon={Users} title="Valore per il team" color={dominantEl.color}>
          <BulletList items={report.team} color={dominantEl.color} />
        </ReportSection>

        {/* COMUNICAZIONE */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <ReportSection icon={MessageCircle} title="Comunicazione efficace" subtitle="Cosa fare" color={dominantEl.color}>
            <BulletList items={report.comunicazione_si} color={dominantEl.color} />
          </ReportSection>
          <ReportSection icon={MessageSquareWarning} title="Ostacoli alla comunicazione" subtitle="Cosa evitare" color={dominantEl.color}>
            <BulletList items={report.comunicazione_no} color={dominantEl.color} />
          </ReportSection>
        </div>

        {/* IGNORATI */}
        <div className="print-page-break"></div>
        <ReportSection icon={Eye} title="Aspetti potenzialmente ignorati" subtitle="Il punto cieco" color={dominantEl.color}>
          <p className="leading-relaxed text-base">{report.ignorati}</p>
        </ReportSection>

        {/* TIPO OPPOSTO */}
        <ReportSection icon={Compass} title="Il tipo opposto" subtitle={`${oppositeEl.archetype} · ${oppositeEl.name}`} color={oppositeEl.color}>
          <div className="pqe-card p-5 mb-4" style={{ background: oppositeEl.colorLight, borderLeft: `3px solid ${oppositeEl.color}` }}>
            <div className="flex items-center gap-3 mb-2">
              {(() => { const I = oppositeEl.icon; return <I size={18} style={{ color: oppositeEl.colorDark }} />; })()}
              <span className="pqe-display tracking-wider text-sm" style={{ color: oppositeEl.colorDark, fontWeight: 600 }}>
                {oppositeEl.tagline}
              </span>
            </div>
            <p className="pqe-body text-sm" style={{ color: oppositeEl.colorDark }}>{oppositeEl.essence}</p>
          </div>
          <p className="leading-relaxed">{report.opposto}</p>
        </ReportSection>

        {/* SVILUPPO */}
        <ReportSection icon={Lightbulb} title="Suggerimenti per lo sviluppo" color={dominantEl.color}>
          <BulletList items={report.sviluppo} color={dominantEl.color} />
        </ReportSection>

        {/* AMBIENTE / MOTIVAZIONE */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <ReportSection icon={Compass} title="Ambiente ideale" color={dominantEl.color}>
            <BulletList items={report.ambiente} color={dominantEl.color} />
          </ReportSection>
          <ReportSection icon={Zap} title="Cosa motiva" color={dominantEl.color}>
            <BulletList items={report.motivazione} color={dominantEl.color} />
          </ReportSection>
        </div>

        {/* MANAGEMENT */}
        <ReportSection icon={Briefcase} title="Stile di management" subtitle="Come tende a gestire gli altri" color={dominantEl.color}>
          <BulletList items={report.management} color={dominantEl.color} />
        </ReportSection>

        {/* DETTAGLIO PUNTEGGI */}
        <ReportSection icon={Target} title="Distribuzione dettagliata" subtitle="Le tue quattro energie">
          <p className="leading-relaxed mb-5">
            Ogni persona porta in sé tutte e quattro le energie, in proporzioni diverse. Quella dominante è
            la <em>lente principale</em> con cui leggi il mondo; quella secondaria modula il tuo profilo;
            quelle meno espresse rappresentano un potenziale di crescita e fonte di apprendimento dai colleghi
            che le hanno dominanti.
          </p>
          <div className="space-y-3">
            {ranked.map((k, i) => {
              const el = ELEMENTS[k];
              const Icon = el.icon;
              return (
                <div key={k} className="flex items-center gap-4">
                  <div className="pqe-display text-sm w-8" style={{ color: '#9A8F7C' }}>{i + 1}°</div>
                  <Icon size={16} style={{ color: el.color }} />
                  <div className="pqe-display text-sm w-24" style={{ color: el.colorDark, fontWeight: 600 }}>{el.name}</div>
                  <div className="flex-1 h-2 bg-stone-200 relative">
                    <div className="absolute inset-y-0 left-0" style={{ width: `${scores[k]}%`, background: el.color }} />
                  </div>
                  <div className="pqe-display w-12 text-right" style={{ color: el.colorDark, fontWeight: 600 }}>{scores[k]}</div>
                </div>
              );
            })}
          </div>
          <p className="pqe-body text-sm mt-5 italic" style={{ color: '#6B6B6B' }}>
            La tua energia meno espressa è {ELEMENTS[least].name.toLowerCase()} ({scores[least]}/100).
            Le persone con questa energia dominante possono insegnarti molto: cercare la loro prospettiva è uno dei modi più
            efficaci per crescere.
          </p>
        </ReportSection>

        {/* COSCIENTE vs SOTTO PRESSIONE */}
        {stressScores && (() => {
          const interp = interpretStressGap(scores, stressScores, dominant);
          return (
            <ReportSection icon={Activity} title="Persona cosciente vs sotto pressione" subtitle={interp.summary}>
              <p className="leading-relaxed mb-6">
                Il primo profilo descrive come ti vedi normalmente. Il secondo emerge quando sei stanco, sopraffatto o sotto pressione —
                quando il filtro razionale si abbassa e prendono il sopravvento risposte più automatiche. Lo scarto tra i due
                racconta dove fatichi di più sotto stress, e quali energie tendi ad abbandonare per prime.
              </p>
              <DualEnergyChart consciousScores={scores} stressScores={stressScores} />
              <div className="mt-8 pqe-card p-5" style={{ background: '#FBF7EE', borderLeft: `3px solid ${dominantEl.color}` }}>
                <div className="pqe-body text-xs tracking-wider uppercase mb-3" style={{ color: dominantEl.colorDark, fontWeight: 600 }}>
                  Interpretazione del gap
                </div>
                <p className="leading-relaxed" dangerouslySetInnerHTML={{
                  __html: interp.narrative.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                }} />
              </div>
            </ReportSection>
          );
        })()}

        {/* FOOTER */}
        <div className="pt-8 mt-12 border-t print-avoid-break" style={{ borderColor: '#D5CFC1' }}>
          <div className="pqe-card p-5 mb-6" style={{ background: '#FBF7EE', borderLeft: '3px solid #5F7340' }}>
            <div className="pqe-body text-xs tracking-[0.25em] uppercase mb-3" style={{ color: '#3F4D2A', fontWeight: 600 }}>
              Come usare questo report
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <div className="pqe-display text-sm mb-2 flex items-center gap-2" style={{ color: '#3F4D2A', fontWeight: 600 }}>
                  <CheckCircle2 size={14} /> Va bene per
                </div>
                <ul className="pqe-body text-sm space-y-1" style={{ color: '#3A3A3A' }}>
                  <li>— Autoesplorazione personale</li>
                  <li>— Dialogo e retrospettive di team</li>
                  <li>— Kickoff di workshop</li>
                  <li>— Generare conversazione tra colleghi</li>
                </ul>
              </div>
              <div>
                <div className="pqe-display text-sm mb-2 flex items-center gap-2" style={{ color: '#7A2A1C', fontWeight: 600 }}>
                  <AlertTriangle size={14} /> NON va bene per
                </div>
                <ul className="pqe-body text-sm space-y-1" style={{ color: '#3A3A3A' }}>
                  <li>— Selezione del personale</li>
                  <li>— Decisioni di carriera o promozione</li>
                  <li>— Valutazioni di performance</li>
                  <li>— Qualsiasi uso "diagnostico"</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="pqe-body text-xs leading-relaxed" style={{ color: '#6B6B6B' }}>
            <p className="mb-2">
              <strong style={{ color: '#1A1A1A' }}>Profilo delle Quattro Energie</strong> · Strumento di autoesplorazione fondato sulla tipologia di C.G. Jung (<em>Tipi Psicologici</em>, 1921 — pubblico dominio).
            </p>
            <p>
              Questo report fornisce una rappresentazione dei tuoi orientamenti preferenziali sulla base del questionario.
              Non è uno strumento psicometrico validato e non sostituisce una valutazione psicologica professionale.
              I punteggi possono variare nel tempo e a seconda del contesto (lavoro, famiglia, situazioni di stress).
              Usalo come stimolo per il dialogo con colleghi e per identificare aree di crescita personale.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- WELCOME / NAME ---
function NamePrompt({ onNext, onBack }) {
  const [name, setName] = useState('');
  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12" style={{ background: '#F4EFE6' }}>
      <div className="max-w-xl w-full">
        <div className="pqe-body text-xs tracking-[0.3em] uppercase mb-4" style={{ color: '#9A8F7C' }}>
          Passo 1 di 2
        </div>
        <h2 className="pqe-display text-4xl md:text-5xl mb-6 leading-tight" style={{ color: '#1A1A1A', fontWeight: 500 }}>
          Come vuoi che chiami il tuo report?
        </h2>
        <p className="pqe-body text-base mb-8" style={{ color: '#3A3A3A' }}>
          Inserisci nome e cognome (o un identificativo). Il dato resta solo nel tuo browser e comparirà nella copertina del report PDF.
        </p>
        <input
          autoFocus
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && name.trim()) onNext(name.trim()); }}
          placeholder="Es. Maria Rossi"
          className="pqe-body w-full px-5 py-4 mb-6 text-lg border bg-white focus:outline-none"
          style={{ borderColor: '#1A1A1A', color: '#1A1A1A' }}
        />
        <div className="flex justify-between gap-3">
          <button onClick={onBack} className="pqe-body px-5 py-3 hover:bg-stone-200 transition" style={{ color: '#1A1A1A' }}>
            <span className="inline-flex items-center gap-2"><ChevronLeft size={16} />Indietro</span>
          </button>
          <button
            onClick={() => onNext(name.trim() || 'Profilo personale')}
            className="pqe-body inline-flex items-center gap-2 px-7 py-3 text-white"
            style={{ background: '#1A1A1A' }}
          >
            <span>Avvia il test</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
//  APP
// ============================================================

export default function App() {
  // screen: landing | name | test-conscious | transition | test-stress | results
  const [screen, setScreen] = useState('landing');
  const [name, setName] = useState('');
  const [answers, setAnswers] = useState(Array(QUESTIONS.length).fill(null));
  const [stressAnswers, setStressAnswers] = useState(Array(STRESS_QUESTIONS.length).fill(null));
  const [scores, setScores] = useState(null);
  const [stressScores, setStressScores] = useState(null);

  const start = () => setScreen('name');
  const goLanding = () => setScreen('landing');
  const startTest = (n) => { setName(n); setScreen('test-conscious'); window.scrollTo(0, 0); };

  const finishConscious = () => {
    setScores(calculateScores(answers, QUESTIONS));
    setScreen('transition');
    window.scrollTo(0, 0);
  };

  const startStress = () => {
    setScreen('test-stress');
    window.scrollTo(0, 0);
  };

  const finishStress = () => {
    setStressScores(calculateScores(stressAnswers, STRESS_QUESTIONS));
    setScreen('results');
    window.scrollTo(0, 0);
  };

  const restart = () => {
    setAnswers(Array(QUESTIONS.length).fill(null));
    setStressAnswers(Array(STRESS_QUESTIONS.length).fill(null));
    setScores(null);
    setStressScores(null);
    setName('');
    setScreen('landing');
    window.scrollTo(0, 0);
  };

  return (
    <>
      <FontInjector />
      {screen === 'landing' && <Landing onStart={start} />}
      {screen === 'name' && <NamePrompt onNext={startTest} onBack={goLanding} />}
      {screen === 'test-conscious' && (
        <Test
          questions={QUESTIONS}
          answers={answers}
          setAnswers={setAnswers}
          onComplete={finishConscious}
          onBack={() => setScreen('name')}
          phase="conscious"
          phaseLabel="Parte 1 di 2 · Persona cosciente"
          instructionTitle="Quanto sei d'accordo con queste affermazioni?"
        />
      )}
      {screen === 'transition' && <Transition onContinue={startStress} />}
      {screen === 'test-stress' && (
        <Test
          questions={STRESS_QUESTIONS}
          answers={stressAnswers}
          setAnswers={setStressAnswers}
          onComplete={finishStress}
          onBack={() => setScreen('transition')}
          phase="stress"
          phaseLabel="Parte 2 di 2 · Sotto pressione"
          instructionTitle="Quando sei stanco, sopraffatto o stressato, quanto è vero?"
          accentColor="#9A8F7C"
        />
      )}
      {screen === 'results' && (
        <Results
          name={name}
          scores={scores}
          stressScores={stressScores}
          onRestart={restart}
        />
      )}
    </>
  );
}