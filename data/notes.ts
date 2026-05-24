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

export const noteCategories: NoteCategory[] = [];

export const notes: ClinicalNote[] = [];
