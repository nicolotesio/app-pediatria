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
  }
];
