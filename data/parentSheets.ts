export type ParentSheet = {
  id: string;
  title: string;
  category: "Febbre" | "Gastroenterite" | "Bronchiolite" | "Tosse e raffreddore" | "Alimentazione" | "Sonno" | "Vaccini" | "Trauma cranico";
  updatedAt: string;
  content: string;
  whenToCall: string[];
  pdf?: { url: string; pages: number; attribution: string; sourceDate: string };
};

export const parentSheetCategories: ParentSheet["category"][] = ["Trauma cranico"];

export const parentSheets: ParentSheet[] = [{
  id: "trauma-cranico",
  title: "Monitoraggio a casa",
  category: "Trauma cranico",
  updatedAt: "2026-10-07",
  content: "Controlli nelle prime 24 ore e segnali d’allarme.",
  whenToCall: [],
  pdf: {
    url: "/schede/trauma-cranico-monitoraggio.pdf",
    pages: 1,
    attribution: "SIP / SIMEUP · Ospedale Infantile Regina Margherita di Torino",
    sourceDate: "11/04/2017"
  }
}, {
  id: "sintomi-commotivi",
  title: "Sintomi commotivi",
  category: "Trauma cranico",
  updatedAt: "2026-10-07",
  content: "Disturbi dopo il trauma e ripresa di scuola e sport.",
  whenToCall: [],
  pdf: {
    url: "/schede/trauma-cranico-sintomi-commotivi.pdf",
    pages: 1,
    attribution: "SIP / SIMEUP · Ospedale Infantile Regina Margherita di Torino",
    sourceDate: "11/04/2017"
  }
}];
