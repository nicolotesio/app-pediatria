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
};

export const noteCategories: NoteCategory[] = ["Genetica"];

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
  }
];
