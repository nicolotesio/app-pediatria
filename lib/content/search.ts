import { notes } from "@/data/notes";
import { parentSheets } from "@/data/parentSheets";
import { resources } from "@/data/resources";

export type SearchItem = {
  id: string;
  type: "Appunto" | "Risorsa" | "Genitori" | "Calcolatore";
  title: string;
  description: string;
  href: string;
  category: string;
  keywords?: string;
};

const calculators: SearchItem[] = [
  {
    id: "wetflag",
    type: "Calcolatore",
    title: "WETFLAG",
    description: "Calcolatore rapido per emergenza pediatrica: peso, energia, tubo ET, fluidi, lorazepam, adrenalina e glucosio.",
    href: "/emergenze/wetflag",
    category: "Emergenze"
  },
  {
    id: "farmaci-emergenza",
    type: "Calcolatore",
    title: "Farmaci in emergenza",
    description: "Calcolatore per posologia dei farmaci usati in emergenza pediatrica.",
    href: "/emergenze/farmaci",
    category: "Emergenze"
  },
  {
    id: "gcs-pediatrico",
    type: "Calcolatore",
    title: "GCS pediatrico",
    description: "Calcolo della Pediatric Glasgow Coma Scale per fascia d'età.",
    href: "/emergenze/gcs-pediatrico",
    category: "Emergenze",
    keywords: "glasgow coma scale stato di coscienza occhi risposta motoria verbale"
  },
  {
    id: "intergrowth-21",
    type: "Calcolatore",
    title: "INTERGROWTH-21st",
    description: "Valutazione antropometrica neonatale secondo gli standard internazionali INTERGROWTH-21st.",
    href: "/calcolatori/intergrowth-21",
    category: "Auxologia",
    keywords: "neonato nascita peso lunghezza circonferenza cranica percentile z-score"
  },
  {
    id: "ines",
    type: "Calcolatore",
    title: "INeS",
    description: "Valutazione auxologica neonatale secondo le carte italiane INeS.",
    href: "/calcolatori/ines",
    category: "Auxologia",
    keywords: "neonato nascita peso lunghezza circonferenza cranica percentile italiano"
  },
  {
    id: "crescita-who-0-5",
    type: "Calcolatore",
    title: "WHO Child Growth Standards",
    description: "Valutazione antropometrica WHO dalla nascita a 5 anni.",
    href: "/calcolatori/crescita-who-0-5",
    category: "Auxologia",
    keywords: "crescita peso altezza lunghezza bmi circonferenza cranica percentile z-score"
  },
  {
    id: "crescita-siedp-2006",
    type: "Calcolatore",
    title: "Curve SIEDP 2006",
    description: "Valutazione antropometrica secondo i riferimenti italiani SIEDP per l'età 2-20 anni.",
    href: "/calcolatori/crescita-siedp-2006",
    category: "Auxologia",
    keywords: "crescita peso statura bmi percentile z-score italiano"
  },
  {
    id: "crescita-cdc-2000",
    type: "Calcolatore",
    title: "Curve CDC 2000",
    description: "Valutazione antropometrica secondo i riferimenti CDC per l'età 2-20 anni.",
    href: "/calcolatori/crescita-cdc-2000",
    category: "Auxologia",
    keywords: "crescita peso statura bmi percentile z-score"
  },
  {
    id: "altezza-bersaglio",
    type: "Calcolatore",
    title: "Altezza bersaglio",
    description: "Stima dell'altezza geneticamente attesa in base all'altezza dei genitori.",
    href: "/calcolatori/altezza-bersaglio",
    category: "Auxologia",
    keywords: "statura target genetico madre padre"
  },
  {
    id: "velocita-crescita",
    type: "Calcolatore",
    title: "Velocità di crescita",
    description: "Calcolo della velocità staturale tra due misurazioni.",
    href: "/calcolatori/velocita-crescita",
    category: "Auxologia",
    keywords: "altezza statura centimetri anno delta"
  },
  {
    id: "terapia-infusionale-supporto",
    type: "Calcolatore",
    title: "Terapia infusionale di supporto",
    description: "Stima del mantenimento idrico endovenoso pediatrico.",
    href: "/calcolatori/terapia-infusionale-supporto",
    category: "Calcolatori",
    keywords: "fluidi liquidi mantenimento ev endovena holliday segar 4-2-1"
  },
  {
    id: "superficie-corporea",
    type: "Calcolatore",
    title: "Superficie corporea",
    description: "Calcolo della superficie corporea con le formule Mosteller, Du Bois e Haycock.",
    href: "/calcolatori/superficie-corporea",
    category: "Calcolatori",
    keywords: "bsa peso altezza metri quadrati"
  },
  {
    id: "egfr-pediatrico",
    type: "Calcolatore",
    title: "eGFR pediatrico",
    description: "Stima del filtrato glomerulare pediatrico con la formula di Schwartz.",
    href: "/calcolatori/egfr-pediatrico",
    category: "Calcolatori",
    keywords: "rene funzione renale creatinina filtrato glomerulare schwartz"
  }
];

export const searchIndex: SearchItem[] = [
  ...calculators,
  {
    id: "informazioni",
    type: "Risorsa",
    title: "Informazioni",
    description: "Dettagli sul progetto, contatti e note di utilizzo dell'app.",
    href: "/informazioni",
    category: "Risorse"
  },
  ...notes.map((note) => ({
    id: note.id,
    type: "Appunto" as const,
    title: note.title,
    description: `${note.category} - ${note.tags.join(", ")}`,
    href: `/appunti/${note.id}`,
    category: note.category,
    keywords: [note.content, note.tags.join(" "), note.sources.join(" "), note.searchText ?? ""].join(" ")
  })),
  ...resources.map((resource) => ({
    id: resource.id,
    type: "Risorsa" as const,
    title: resource.title,
    description: resource.description,
    href: "/risorse",
    category: resource.category
  })),
  ...parentSheets.map((sheet) => ({
    id: sheet.id,
    type: "Genitori" as const,
    title: sheet.title,
    description: sheet.content,
    href: "/genitori",
    category: sheet.category
  }))
];

export function filterSearchItems(query: string) {
  const normalized = normalizeSearchText(query);
  if (!normalized) return searchIndex;

  return searchIndex.filter((item) => {
    return [item.title, item.description, item.category, item.type, item.keywords ?? ""].some((field) =>
      normalizeSearchText(field).includes(normalized)
    );
  });
}

function normalizeSearchText(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
