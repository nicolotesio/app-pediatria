export type CalculatorEntry = {
  id: string;
  type: "Calcolatore";
  title: string;
  description: string;
  href: string;
  category: string;
  keywords?: string;
};
export const calculators: CalculatorEntry[] = [
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
    description: "Alla nascita · Standard internazionali",
    href: "/calcolatori/intergrowth-21",
    category: "Auxologia",
    keywords: "neonato nascita peso lunghezza circonferenza cranica percentile z-score"
  },
  {
    id: "ines",
    type: "Calcolatore",
    title: "INeS",
    description: "Alla nascita · Riferimenti italiani",
    href: "/calcolatori/ines",
    category: "Auxologia",
    keywords: "neonato nascita peso lunghezza circonferenza cranica percentile italiano"
  },
  {
    id: "crescita-who-0-5",
    type: "Calcolatore",
    title: "WHO Child Growth Standards",
    description: "0–5 anni · Standard WHO",
    href: "/calcolatori/crescita-who-0-5",
    category: "Auxologia",
    keywords: "crescita peso altezza lunghezza bmi circonferenza cranica percentile z-score"
  },
  {
    id: "crescita-siedp-2006",
    type: "Calcolatore",
    title: "Curve SIEDP 2006",
    description: "2–20 anni · Riferimenti italiani",
    href: "/calcolatori/crescita-siedp-2006",
    category: "Auxologia",
    keywords: "crescita peso statura bmi percentile z-score italiano"
  },
  {
    id: "crescita-cdc-2000",
    type: "Calcolatore",
    title: "Curve CDC 2000",
    description: "2–20 anni · Riferimenti statunitensi",
    href: "/calcolatori/crescita-cdc-2000",
    category: "Auxologia",
    keywords: "crescita peso statura bmi percentile z-score"
  },
  {
    id: "altezza-bersaglio",
    type: "Calcolatore",
    title: "Altezza bersaglio",
    description: "Statura attesa dalle altezze dei genitori",
    href: "/calcolatori/altezza-bersaglio",
    category: "Auxologia",
    keywords: "statura target genetico madre padre"
  },
  {
    id: "velocita-crescita",
    type: "Calcolatore",
    title: "Velocità di crescita",
    description: "Confronto fra due misurazioni",
    href: "/calcolatori/velocita-crescita",
    category: "Auxologia",
    keywords: "altezza statura centimetri anno delta"
  },
  {
    id: "terapia-infusionale-supporto",
    type: "Calcolatore",
    title: "Terapia infusionale di mantenimento",
    description: "Mantenimento idrico · Holliday–Segar",
    href: "/calcolatori/terapia-infusionale-supporto",
    category: "Calcolatori",
    keywords: "fluidi liquidi mantenimento ev endovena holliday segar 4-2-1"
  },
  {
    id: "superficie-corporea",
    type: "Calcolatore",
    title: "Superficie corporea",
    description: "Mosteller, Du Bois e Haycock",
    href: "/calcolatori/superficie-corporea",
    category: "Calcolatori",
    keywords: "bsa peso altezza metri quadrati"
  },
  {
    id: "egfr-pediatrico",
    type: "Calcolatore",
    title: "eGFR pediatrico",
    description: "Filtrato glomerulare · Schwartz",
    href: "/calcolatori/egfr-pediatrico",
    category: "Calcolatori",
    keywords: "rene funzione renale creatinina filtrato glomerulare schwartz"
  },
  {
    id: "saturazione-transferrina",
    type: "Calcolatore",
    title: "Saturazione della transferrina",
    description: "Da sideremia e transferrina",
    href: "/calcolatori/saturazione-transferrina",
    category: "Calcolatori",
    keywords: "ferro sideremia transferrina saturazione percentuale"
  }
];


