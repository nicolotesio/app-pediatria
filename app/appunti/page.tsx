import { Brain, Bug, Dna, Flame, Pill, Syringe } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { SectionHeader } from "@/components/ui/SectionHeader";

const diagnosisNotes = [
  {
    title: "Criteri NF1",
    href: "/appunti/nf1-criteri-diagnostici",
    description: "Checklist interattiva dei criteri revisionati per neurofibromatosi tipo 1, con score e interpretazione diagnostica.",
    icon: Dna
  },
  {
    title: "Criteri TSC",
    href: "/appunti/sclerosi-tuberosa-criteri-diagnostici",
    description: "Checklist interattiva dei criteri TSC, con caratteristiche principali, minori e interpretazione diagnostica.",
    icon: Dna
  },
  {
    title: "Criteri MAS",
    href: "/appunti/criteri-mas",
    description: "Criteri laboratoristici per sospetta sindrome da attivazione macrofagica in AIG sistemica.",
    icon: Flame
  }
];

const therapyNotes = [
  {
    title: "Terapia antiemetica",
    href: "/appunti/terapia-antiemetica",
    description: "Farmaci antiemetici suddivisi per classe farmacologica.",
    icon: Pill
  },
  {
    title: "Farmaci antibiotici",
    href: "/appunti/terapia-antibiotica",
    description: "Schede antibiotiche pediatriche divise per classe, con posologia, vie di somministrazione, diluizione e note.",
    icon: Pill
  },
  {
    title: "Principi di antibioticoterapia",
    href: "/appunti/principi-antibioticoterapia",
    description: "Schemi visuali su antibiogramma, spettro, sedi di infezione e penetrabilita antibiotica.",
    icon: Bug
  },
  {
    title: "Premedicazione trasfusione",
    href: "/appunti/premedicazione-trasfusione",
    description: "Schema rapido di premedicazione circa un'ora prima della trasfusione, con avviso di verifica dosaggi.",
    icon: Syringe
  },
  {
    title: "Terapia dello stato di male epilettico",
    href: "/appunti/stato-male-epilettico",
    description: "Tabella farmaci per lo stato di male epilettico pediatrico.",
    icon: Brain
  }
];

type NoteItem = (typeof diagnosisNotes)[number];

export default function NotesPage() {
  return (
    <div className="grid gap-5 pb-16">
      <SectionHeader title="APPUNTI" />
      <NotesSection title="Diagnosi" notes={diagnosisNotes} />
      <NotesSection title="Terapia" notes={therapyNotes} />
    </div>
  );
}

function NotesSection({ title, notes }: { title: string; notes: NoteItem[] }) {
  return (
    <section className="grid gap-4">
      <div className="border-y border-slate-200 py-3 text-center dark:border-slate-800">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">{title}</h2>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {notes.map((note) => {
          const Icon = note.icon;
          return (
            <Card
              key={note.href}
              href={note.href}
              title={note.title}
              description={note.description}
              inlineHeader
              meta={<Icon className="size-6 text-blue-700 dark:text-blue-300" />}
            />
          );
        })}
      </div>
    </section>
  );
}
