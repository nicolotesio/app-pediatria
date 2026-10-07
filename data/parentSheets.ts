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
  title: "Trauma cranico: monitoraggio a casa",
  category: "Trauma cranico",
  updatedAt: "2026-10-07",
  content: "Scheda da consegnare ai genitori dopo la valutazione medica: osservazione nelle prime 24 ore e segnali per tornare subito in ospedale.",
  whenToCall: [],
  pdf: {
    url: "/schede/trauma-cranico-monitoraggio.pdf",
    pages: 1,
    attribution: "SIP / SIMEUP · Ospedale Infantile Regina Margherita di Torino",
    sourceDate: "11/04/2017"
  }
}, {
  id: "sintomi-commotivi",
  title: "Trauma cranico: sintomi commotivi",
  category: "Trauma cranico",
  updatedAt: "2026-10-07",
  content: "Come riconoscere i sintomi commotivi e accompagnare il bambino nella ripresa delle attività scolastiche e sportive.",
  whenToCall: [],
  pdf: {
    url: "/schede/trauma-cranico-sintomi-commotivi.pdf",
    pages: 1,
    attribution: "SIP / SIMEUP · Ospedale Infantile Regina Margherita di Torino",
    sourceDate: "11/04/2017"
  }
}];
