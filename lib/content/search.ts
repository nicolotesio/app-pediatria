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
};

export const searchIndex: SearchItem[] = [
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
  ...notes.map((note) => ({
    id: note.id,
    type: "Appunto" as const,
    title: note.title,
    description: `${note.category} - ${note.tags.join(", ")}`,
    href: "/appunti",
    category: note.category
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
  const normalized = query.trim().toLowerCase();
  if (!normalized) return searchIndex;

  return searchIndex.filter((item) => {
    return [item.title, item.description, item.category, item.type].some((field) => field.toLowerCase().includes(normalized));
  });
}
