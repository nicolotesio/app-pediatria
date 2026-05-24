export type ParentSheet = {
  id: string;
  title: string;
  category: "Febbre" | "Gastroenterite" | "Bronchiolite" | "Tosse e raffreddore" | "Alimentazione" | "Sonno" | "Vaccini";
  updatedAt: string;
  content: string;
  whenToCall: string[];
};

export const parentSheetCategories: ParentSheet["category"][] = [];

export const parentSheets: ParentSheet[] = [];
