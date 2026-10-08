import { Brain, Bug, Pill, Syringe } from "lucide-react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SectionHeader } from "@/components/ui/SectionHeader";

const therapyNotes = [
  {
    title: "Farmaci antiemetici",
    href: "/appunti/terapia-antiemetica",
    description: "Classi e vie di somministrazione",
    icon: Pill
  },
  {
    title: "Farmaci antibiotici",
    href: "/appunti/terapia-antibiotica",
    description: "Posologia, diluizione e somministrazione",
    icon: Pill
  },
  {
    title: "Farmaci antivirali",
    href: "/appunti/farmaci-antivirali",
    description: "Regimi, vie di somministrazione e monitoraggio",
    icon: Pill
  },
  {
    title: "Farmaci antifungini",
    href: "/appunti/farmaci-antifungini",
    description: "Regimi, vie di somministrazione e monitoraggio",
    icon: Pill
  },  {
    title: "Principi di antibioticoterapia",
    href: "/appunti/principi-antibioticoterapia",
    description: "Antibiogramma, spettro e sedi di infezione",
    icon: Bug
  },
  {
    title: "Premedicazione trasfusione",
    href: "/appunti/premedicazione-trasfusione",
    description: "Schema di premedicazione e verifica dei dosaggi",
    icon: Syringe
  },
  {
    title: "Terapia dello stato di male epilettico",
    href: "/appunti/stato-male-epilettico",
    description: "Tabella dei farmaci",
    icon: Brain
  }
];

type NoteItem = (typeof therapyNotes)[number];

export default function NotesPage() {
  return (
    <div className="mx-auto grid max-w-4xl gap-7">
      <SectionHeader title="Terapia"  />
      <NotesSection notes={therapyNotes} />
    </div>
  );
}

function NotesSection({ notes }: { notes: NoteItem[] }) {
  return (
    <section>
      <div className="grid gap-x-8 sm:grid-cols-2">
        {notes.map((note) => {
          const Icon = note.icon;
          return (
            <Link key={note.href} href={note.href} className="group flex items-center gap-3 border-b border-slate-200 py-4 dark:border-slate-800">
              <Icon className="size-5 shrink-0 text-blue-700 dark:text-blue-300" aria-hidden="true" />
              <span className="min-w-0 flex-1"><span className="block text-base font-semibold group-hover:text-blue-700 dark:group-hover:text-blue-300">{note.title}</span><span className="mt-1 block text-sm leading-6 text-slate-500 dark:text-slate-400">{note.description}</span></span>
              <ChevronRight className="size-4 shrink-0 text-slate-400" aria-hidden="true" />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
