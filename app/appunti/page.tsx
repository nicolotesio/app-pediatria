import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { MarkdownContent } from "@/components/ui/MarkdownContent";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { noteCategories, notes } from "@/data/notes";

export default function NotesPage() {
  return (
    <div className="grid gap-6 pb-16">
      <SectionHeader
        eyebrow="Appunti"
        title="Appunti clinici"
        description="Categorie modificabili, tag, fonti e contenuti Markdown/MDX pronti per essere estesi."
      />
      <div className="flex flex-wrap gap-2">
        {noteCategories.map((category) => (
          <Badge key={category} tone="blue">{category}</Badge>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {notes.map((note) => (
          <Card
            key={note.id}
            title={note.title}
            meta={
              <div className="flex flex-wrap gap-2">
                <Badge tone="blue">{note.category}</Badge>
                <Badge>Agg. {note.updatedAt}</Badge>
              </div>
            }
          >
            <div className="mb-4 flex flex-wrap gap-2">
              {note.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
            <MarkdownContent content={note.content} />
            <div className="mt-4 rounded-md bg-slate-50 p-3 text-xs leading-5 text-slate-600 dark:bg-slate-950 dark:text-slate-300">
              Fonti: {note.sources.join("; ")}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
