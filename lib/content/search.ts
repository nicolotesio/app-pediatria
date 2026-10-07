import { calculators } from "@/lib/content/calculatorCatalog";
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
