export type Resource = {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  personalNote?: string;
};

export const resources: Resource[] = [
  {
    id: "who-child-growth",
    title: "WHO Child Growth Standards",
    description: "Standard internazionali di crescita WHO. Dataset da integrare separatamente se validato per uso locale.",
    url: "https://www.who.int/tools/child-growth-standards",
    category: "Crescita",
    personalNote: "Utile come fonte primaria per future curve 0-2 anni."
  },
  {
    id: "cdc-growth-charts",
    title: "CDC Growth Charts",
    description: "Curve di crescita CDC per eta pediatrica. Non configurate nel calcolatore.",
    url: "https://www.cdc.gov/growthcharts/",
    category: "Crescita"
  },
  {
    id: "intergrowth",
    title: "INTERGROWTH-21st",
    description: "Risorse su crescita fetale e neonatale. Dataset non ancora configurato.",
    url: "https://intergrowth21.tghn.org/",
    category: "Neonatologia"
  }
];
