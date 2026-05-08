export type ParentSheet = {
  id: string;
  title: string;
  category: "Febbre" | "Gastroenterite" | "Bronchiolite" | "Tosse e raffreddore" | "Alimentazione" | "Sonno" | "Vaccini";
  updatedAt: string;
  content: string;
  whenToCall: string[];
};

export const parentSheetCategories: ParentSheet["category"][] = [
  "Febbre",
  "Gastroenterite",
  "Bronchiolite",
  "Tosse e raffreddore",
  "Alimentazione",
  "Sonno",
  "Vaccini"
];

export const parentSheets: ParentSheet[] = [
  {
    id: "febbre",
    title: "Febbre: cosa osservare",
    category: "Febbre",
    updatedAt: "2026-05-08",
    content:
      "La febbre e un segnale frequente nei bambini. Osserva come sta il bambino nel complesso: beve, urina, respira bene, risponde e mantiene un comportamento simile al solito?",
    whenToCall: [
      "Bambino molto abbattuto, difficilmente risvegliabile o confuso.",
      "Difficolta respiratoria, colorito grigio o labbra bluastre.",
      "Febbre in un lattante piccolo: seguire sempre le indicazioni del pediatra."
    ]
  },
  {
    id: "gastroenterite",
    title: "Gastroenterite: idratazione prima di tutto",
    category: "Gastroenterite",
    updatedAt: "2026-05-08",
    content:
      "In caso di vomito o diarrea, l'obiettivo principale e mantenere una buona idratazione con piccole quantita frequenti di liquidi adatti all'eta.",
    whenToCall: [
      "Poche urine, bocca molto asciutta o pianto senza lacrime.",
      "Vomito persistente che impedisce di bere.",
      "Sangue nelle feci, dolore importante o peggioramento rapido."
    ]
  }
];
