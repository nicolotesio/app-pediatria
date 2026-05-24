export type NoteCategory =
  | "Neonatologia"
  | "Infettivologia"
  | "Pneumologia"
  | "Gastroenterologia"
  | "Cardiologia"
  | "Neurologia"
  | "Urgenze"
  | "Farmacologia";

export type ClinicalNote = {
  id: string;
  title: string;
  category: NoteCategory;
  tags: string[];
  updatedAt: string;
  sources: string[];
  content: string;
};

export const noteCategories: NoteCategory[] = [
  "Neonatologia",
  "Infettivologia",
  "Pneumologia",
  "Gastroenterologia",
  "Cardiologia",
  "Neurologia",
  "Urgenze",
  "Farmacologia"
];

export const notes: ClinicalNote[] = [
  {
    id: "febbre-lattante",
    title: "Febbre nel lattante: appunto demo",
    category: "Infettivologia",
    tags: ["febbre", "lattante", "triage"],
    updatedAt: "2026-05-08",
    sources: ["Inserire linee guida locali validate prima dell'uso clinico"],
    content:
      "### Punti pratici\n\n- Valutare eta, condizioni generali, idratazione e segni di allarme.\n- Documentare temperatura, metodo di misurazione e farmaci gia assunti.\n- Questo appunto e dimostrativo: completare con fonti locali validate."
  },
  {
    id: "bronchiolite-primo-inquadramento",
    title: "Bronchiolite: primo inquadramento",
    category: "Pneumologia",
    tags: ["bronchiolite", "respiro", "stagionale"],
    updatedAt: "2026-05-08",
    sources: ["Dataset/protocollo locale non ancora configurato"],
    content:
      "### Valutazione iniziale\n\n- Osservare lavoro respiratorio, alimentazione e idratazione.\n- Saturazione e necessita di supporto vanno interpretate secondo protocollo locale.\n- Non usare questo testo come raccomandazione terapeutica completa."
  },
  {
    id: "farmaci-alto-rischio",
    title: "Farmaci ad alto rischio in emergenza",
    category: "Farmacologia",
    tags: ["sicurezza", "farmaci", "emergenza"],
    updatedAt: "2026-05-08",
    sources: ["Lista farmaci locale non ancora configurata"],
    content:
      "### Checklist demo\n\n- Confermare peso, concentrazione, via e diluizione.\n- Separare prescrizione, preparazione e somministrazione quando possibile.\n- Richiedere doppio controllo per farmaci critici."
  },
  {
    id: "stato-male-epilettico",
    title: "Stato di male epilettico",
    category: "Neurologia",
    tags: ["stato di male epilettico", "convulsioni", "emergenza", "benzodiazepine"],
    updatedAt: "2026-05-24",
    sources: ["Emergenze pediatriche.pdf"],
    content: `### Definizione

Episodio critico che persiste per una durata > 5 minuti o due o piu episodi critici senza recupero completo della coscienza tra l'uno e l'altro.

### 0 minuti

- Mantenere pervieta vie aeree + O2 100% a 15 L/min con reservoir.
- Monitoraggio cardiorespiratorio e PV in continuo.
- Reperire accesso EV o IO.
- Esami: emocromo, PCR, glicemia, elettroliti, funzionalita epatorenale, coagulazione, EGA, screening tossicologico, ammonio, dosaggio farmaci antiepilettici (AED).

### 5 minuti: 1a BDZ

Con accesso venoso:

- Lorazepam: 0,1 mg/kg, max 4 mg.
- Midazolam: 0,15 mg/kg, max 5 mg.
- Diazepam: 0,3-0,5 mg/kg, max 10 mg.

Senza accesso venoso:

- Midazolam EN: 0,2 mg/kg, max 5 mg.
- Midazolam oromucosale (Buccolam): 0,5 mg/kg, max 10 mg.
- Diazepam ER (Micropam): 0,5 mg/kg, max 20 mg.

### 10 minuti: 2a BDZ EV

- Lorazepam.
- Midazolam.

### 15 minuti: farmaci di II livello

- Levetiracetam.
- Fenitoina.
- Fenobarbitale.
- Acido valproico.
- Piridossina se eta < 6-12 mesi.
- Impostare monitoraggio ECG ed eseguire esami ematici, se non gia eseguiti in precedenza.
- Allertare TIP se mancata risoluzione.

### 30 minuti: farmaci di III livello

- Chetamina.
- Midazolam in IC.
- Propofol.
- Tiopentone.
- Ricovero e trattamento in TIP.
- Approfondimenti: neuroimaging (TC/RM) e rachicentesi.

### Farmaci di primo livello

Midazolam:

- Meccanismo d'azione: recettori GABA-A.
- Dose EV/IO: 0,15 mg/kg; anche IM/EN.
- Dose oromucosale: 0,3-0,5 mg/kg.
- Dose oromucosale 6 mesi-1 anno: 2,5 mg.
- Dose oromucosale 1-5 anni: 5 mg.
- Dose oromucosale 5-10 anni: 7,5 mg.
- Dose oromucosale > 10 anni: 10 mg.
- Velocita infusione: bolo a velocita < 2 mg/min.
- Dose massima EV/IO: 5 mg.
- Dose massima oromucosale: 10 mg.
- Inizio effetto: 1,5-5 min.
- Durata effetto: 1-5 ore.
- Note: non registrato per SE. Scelta d'elezione se manca accesso venoso.
- Effetti collaterali: depressione respiratoria.

Diazepam:

- Meccanismo d'azione: recettori GABA-A.
- Dose EV/IO: 0,3 mg/kg.
- Dose ER: 0,3-0,5 mg/kg.
- Dose ER < 10 kg: 5 mg.
- Dose ER 10-20 kg: 7,5 mg.
- Dose ER > 20 kg: 10 mg.
- Velocita infusione: bolo a velocita < 2 mg/min.
- Dose massima EV/IO: 10 mg.
- Dose massima ER: 10 mg.
- Inizio effetto: 1-3 min.
- Durata effetto: 5-15 ore.
- Note: rapido ma con breve durata d'azione per ridistribuzione nel tessuto adiposo.
- Effetti collaterali: depressione respiratoria.

Lorazepam:

- Meccanismo d'azione: recettori GABA-A.
- Dose EV/IO: 0,1 mg/kg; anche IO.
- Velocita infusione: bolo a velocita < 2 mg/min.
- Dose massima: 4 mg.
- Inizio effetto: 2-5 min.
- Durata effetto: 6-12 ore.
- Note: gold standard ospedaliero. Maggiore durata d'azione cerebrale rispetto al Diazepam.
- Effetti collaterali: depressione respiratoria.

### Farmaci di secondo livello

Levetiracetam:

- Meccanismo d'azione: proteina sinaptica SV2A e modulazione del rilascio dei neurotrasmettitori.
- Dose EV/IO: 40 mg/kg, range 15-75 mg/kg.
- Velocita infusione: infondere in 15 min, < 5 mg/kg/min.
- Dose massima: 3 g.
- Inizio effetto: 25-30 min.
- Durata effetto: 12-15 ore.
- Note: non registrato per SE. Dimezzare la dose se insufficienza renale. Vantaggioso per buona tollerabilita e assenza di effetti emodinamici/sedativi.

Fenitoina:

- Meccanismo d'azione: canali del sodio voltaggio-dipendenti.
- Dose EV/IO: 20 mg/kg, range 15-20 mg/kg.
- Velocita infusione: infondere in 20-30 min, < 50 mg/min (0,5 mg/kg/min).
- Dose massima: 1 g.
- Inizio effetto: 10-30 min.
- Durata effetto: 12-24 ore.
- Note: non diluire in glucosata. Monitorare FC e PAO. Da evitare nei cardiopatici. Da preferire se instabilita respiratoria.
- Controindicazioni: QT lungo, BAV II grado, ipotensione grave.
- Effetti collaterali: ipotensione, aritmie, reazioni cutanee.

Fenobarbitale:

- Meccanismo d'azione: recettori GABA-A, recettori AMPA (glutammato), canali del calcio.
- Dose EV/IO: 20 mg/kg, range 10-20 mg/kg.
- Velocita infusione: infondere in 20-30 min, < 100 mg/min (1 mg/kg/min).
- Dose massima: 1 g.
- Inizio effetto: 10-20 min.
- Durata effetto: 1-3 giorni.
- Note: dimezzare la dose in insufficienza epatica e porfiria. Da preferire nei lattanti e pazienti febbrili.
- Effetti collaterali: depressione respiratoria, ipotensione.

Acido valproico:

- Meccanismo d'azione: aumento GABA, canali del sodio voltaggio-dipendenti, canali del calcio.
- Dose EV/IO: 20 mg/kg, range 15-40 mg/kg.
- Velocita infusione: infondere in 15 min, < 200 mg/min (1-3 mg/kg/min).
- Dose massima: 1,5 g.
- Inizio effetto: 10-20 min.
- Durata effetto: 12-24 ore.
- Note: non registrato per SE. Da preferire se instabilita respiratoria.
- Controindicazioni: patologie epatiche e metaboliche, coagulopatie, eta < 3 anni in SE ad eziologia ignota per rischio encefalopatia.
- Effetti collaterali: trombocitopenia, vertigini, epatotossicita.

Piridossina:

- Meccanismo d'azione: coenzima (complesso vitaminico B6).
- Dose EV/IO: 100 mg.
- Velocita infusione: bolo lento.
- Dose massima: 500 mg.
- Inizio effetto: minuti.
- Durata effetto: non indicata.
- Note: da somministrare EV nei bambini con eta < 6-12 mesi in caso di non risposta agli altri farmaci.

### Nota dal file

- Aggiungere possibilita di mettere midazolam in continuo come seconda linea.`
  }
];
