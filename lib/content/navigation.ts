import { Ambulance, Baby, BookOpenText, Calculator, ExternalLink, Home, Info } from "lucide-react";
export const sections = [
  { title: "Home", href: "/", icon: Home, description: "Il tuo spazio clinico" },
  { title: "Emergenze", href: "/emergenze", icon: Ambulance, description: "WETFLAG, GCS e farmaci in emergenza" },
  { title: "Calcolatori", href: "/calcolatori", icon: Calculator, description: "Crescita, liquidi e altri strumenti" },
  { title: "Terapia", href: "/appunti", icon: BookOpenText, description: "Farmaci e schede di consultazione" },
  { title: "Genitori", href: "/genitori", icon: Baby, description: "Schede da condividere con le famiglie" },
  { title: "Risorse", href: "/risorse", icon: ExternalLink, description: "Riferimenti e approfondimenti" },
  { title: "Informazioni", href: "/informazioni", icon: Info, description: "Il progetto e le note di utilizzo" }
];
