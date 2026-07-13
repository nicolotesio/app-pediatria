export type NoteCategory =
  | "Neonatologia"
  | "Infettivologia"
  | "Pneumologia"
  | "Gastroenterologia"
  | "Cardiologia"
  | "Neurologia"
  | "Genetica"
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
  searchText?: string;
};

export const noteCategories: NoteCategory[] = ["Genetica", "Farmacologia"];

export const notes: ClinicalNote[] = [
  {
    id: "nf1-criteri-diagnostici",
    title: "Criteri diagnostici per NF1",
    category: "Genetica",
    tags: ["NF1", "neurofibromatosi", "Legius", "criteri diagnostici"],
    updatedAt: "2026-06-27",
    sources: ["Legius et al., 2021"],
    content: "Checklist interattiva dei criteri diagnostici revisionati per neurofibromatosi tipo 1."
  },
  {
    id: "sclerosi-tuberosa-criteri-diagnostici",
    title: "Criteri diagnostici per sclerosi tuberosa",
    category: "Genetica",
    tags: ["TSC", "sclerosi tuberosa", "Bourneville", "criteri diagnostici"],
    updatedAt: "2026-06-29",
    sources: ["Northrup et al., 2021"],
    content: "Checklist interattiva dei criteri diagnostici per sclerosi tuberosa complessa."
  },
  {
    id: "criteri-mas",
    title: "Criteri MAS",
    category: "Urgenze",
    tags: ["MAS", "sindrome da attivazione macrofagica", "AIG sistemica", "criteri diagnostici"],
    updatedAt: "2026-07-09",
    sources: ["Ravelli et al., 2016"],
    content: "Criteri classificativi 2016 per sospetta sindrome da attivazione macrofagica in AIG sistemica."
  },
  {
    id: "terapia-antibiotica",
    title: "Terapia antibiotica",
    category: "Farmacologia",
    tags: ["antibiotici", "terapia antibiotica", "posologia", "diluizione", "pediatria"],
    updatedAt: "2026-07-06",
    sources: ["Wellington ICU Drug Manual, 2020"],
    content: "Schede rapide di terapia antibiotica pediatrica con classi, vie di somministrazione, posologia, diluizioni EV e note.",
    searchText:
      "amikacina gentamicina tobramicina netilmicina ertapenem meropenem imipenem cilastatina cefazolina cefuroxime cefixima cefotaxime cefpodoxima ceftazidime ceftriaxone cefepime ceftarolina teicoplanina vancomicina clindamicina daptomicina azitromicina claritromicina linezolid amoxicillina clavulanato ampicillina sulbactam oxacillina piperacillina tazobactam ticarcillina colistina ciprofloxacina levofloxacina cotrimossazolo trimetoprim sulfametossazolo tmp smx fosfomicina metronidazolo rifampicina tigeciclina aminoglicosidi carbapenemici cefalosporine glicopeptidi lincosamidi lipopeptidi macrolidi oxazolidinoni penicilline polimixine chinolonici fluorochinolonici sulfonamidici nitroimidazoli rifamicine glicilcicline"
  },
  {
    id: "premedicazione-trasfusione",
    title: "Premedicazione trasfusione",
    category: "Farmacologia",
    tags: ["trasfusione", "premedicazione", "idrocortisone", "clorfenamina", "farmacologia"],
    updatedAt: "2026-07-06",
    sources: [],
    content: "Schema rapido di premedicazione circa un'ora prima della trasfusione, con avviso di verifica dosaggi e somministrazione."
  },
  {
    id: "stato-male-epilettico",
    title: "Terapia dello stato di male epilettico",
    category: "Farmacologia",
    tags: ["stato di male epilettico", "epilessia", "convulsioni", "benzodiazepine", "farmacologia"],
    updatedAt: "2026-07-13",
    sources: ["Emergenze pediatriche"],
    content: "Tabella farmaci per terapia dello stato di male epilettico pediatrico.",
    searchText: "midazolam diazepam lorazepam levetiracetam fenitoina fenobarbitale acido valproico valproato piridossina buccolam micropam convulsioni crisi epilettica stato epilettico"
  }
];
