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
    category: "Crescita"
  },
  {
    id: "peditools",
    title: "PediTools",
    description: "Calcolatori pediatrici rapidi per consultazione clinica.",
    url: "https://peditools.org/",
    category: "Strumenti"
  },
  {
    id: "intergrowth-calculators",
    title: "INTERGROWTH-21st Applications & Calculators",
    description: "Applicazioni e calcolatori INTERGROWTH-21st per crescita fetale e neonatale.",
    url: "https://intergrowth21.com/intergrowth-21st-applications-calculators",
    category: "Strumenti"
  },
  {
    id: "who-child-growth-standards",
    title: "WHO Child Growth Standards",
    description: "Standard WHO per crescita pediatrica, con tabelle e materiali ufficiali.",
    url: "https://www.who.int/tools/child-growth-standards/standards",
    category: "Strumenti"
  },
  {
    id: "ines-charts",
    title: "INES Charts",
    description: "Strumento online per chart e riferimenti auxologici.",
    url: "http://www.inescharts.com/index.aspx",
    category: "Strumenti"
  },
  {
    id: "bilitool",
    title: "BiliTool",
    description: "Supporto alla valutazione del rischio di iperbilirubinemia neonatale.",
    url: "https://bilitool.org/",
    category: "Strumenti"
  },
  {
    id: "aha-cpr-ecc-algorithms",
    title: "AHA CPR & ECC Algorithms",
    description: "Algoritmi American Heart Association per rianimazione e urgenze.",
    url: "https://cpr.heart.org/en/resuscitation-science/cpr-and-ecc-guidelines/algorithms#",
    category: "Strumenti"
  },
  {
    id: "rch-clinical-guidelines",
    title: "RCH Clinical Practice Guidelines",
    description: "Linee guida cliniche pediatriche del Royal Children's Hospital Melbourne.",
    url: "https://www.rch.org.au/clinicalguide/",
    category: "Strumenti"
  },
  {
    id: "meyer-simyoung-newsletter",
    title: "Newsletter SimYoung Meyer",
    description: "Archivio newsletter del centro di simulazione Meyer.",
    url: "https://campus.meyer.it/meyer-health-campus/centro-di-simulazione-meyer/archivio-newsletter-simyoung/",
    category: "Siti e newsletter"
  },
  {
    id: "jama-pediatrics",
    title: "JAMA Pediatrics",
    description: "Rivista internazionale per aggiornamenti e letteratura pediatrica.",
    url: "https://jamanetwork.com/journals/jamapediatrics",
    category: "Siti e newsletter"
  },
  {
    id: "dont-forget-the-bubbles",
    title: "Don't Forget the Bubbles",
    description: "Risorse, articoli e aggiornamenti per pediatria acuta e pratica clinica.",
    url: "https://dontforgetthebubbles.com/",
    category: "Siti e newsletter"
  },
  {
    id: "learn-picu",
    title: "LearnPICU",
    description: "Materiali e aggiornamenti per terapia intensiva pediatrica.",
    url: "https://www.learnpicu.com/home",
    category: "Siti e newsletter"
  },
  {
    id: "spotify-podcast-6alg13n",
    title: "Pediatrics On Call",
    description: "Podcast dell'American Academy of Pediatrics con aggiornamenti clinici e discussioni pediatriche.",
    url: "https://open.spotify.com/show/6alg13nFB89i6x2gQLdr8b?si=f93ffb122c2c437c",
    category: "Podcast"
  },
  {
    id: "spotify-podcast-6pcwg2",
    title: "The Cribsiders",
    description: "Podcast di aggiornamento pediatrico con taglio clinico pratico.",
    url: "https://open.spotify.com/show/6pcWg2l8FEKh44wIV3RMVz?si=dca54b3da01041b9",
    category: "Podcast"
  },
  {
    id: "spotify-podcast-0ivsle",
    title: "Pediagogy",
    description: "Podcast pediatrico per ripasso e apprendimento clinico.",
    url: "https://open.spotify.com/show/0IvSleRkY7kabfbqr9RuCL?si=cf766895248b4201",
    category: "Podcast"
  },
  {
    id: "spotify-podcast-1knyupr",
    title: "Pedscases.com",
    description: "Podcast con casi e contenuti didattici pediatrici.",
    url: "https://open.spotify.com/show/1KnYuprLi8HXWFE7t75TRK?si=cf986998f3e345a9",
    category: "Podcast"
  }
];
