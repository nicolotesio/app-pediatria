import { ChevronDown, ChevronRight } from "lucide-react";

type AntiemeticDrug = {
  name: string;
  route?: string;
  posology?: string[];
  posologyGroups?: Array<{ title: string; values: string[] }>;
  notes?: string[];
};

const antiemeticClasses: Array<{ className: string; drugs: AntiemeticDrug[] }> = [
  {
    className: "Antagonisti del recettore 5-HT3 (5-HT3RA)",
    drugs: [
      {
        name: "Palonosetron",
        route: "EV",
        posology: ["20 μg/kg/dose, singola somministrazione", "Dose max: 250 μg (1 fiala)"],
        notes: [
          "Indicato per cicli molto emetogeni o emesi importante nei cicli precedenti.",
          "Azione prolungata (circa 72 ore).",
          "Non somministrare Ondansetron nelle 48 ore prima e dopo la somministrazione di Palonosetron.",
          "Rischio allungamento del QT."
        ]
      },
      {
        name: "Ondansetron",
        route: "EV, PO, SL",
        posology: ["0.15-0.2 mg/kg/dose, ripetibile ogni 8 ore", "Dose max: 8 mg/dose"],
        notes: ["Rischio allungamento del QT."]
      }
    ]
  },
  {
    className: "Corticosteroidi",
    drugs: [
      {
        name: "Metilprednisolone",
        route: "EV",
        posology: ["1 mg/kg, ogni 8 ore", "Dose max: 40 mg/dose"],
        notes: [
          "Sempre in associazione con altri antiemetici.",
          "Non scalare.",
          "Associare protezione gastrica (attenzione all'interazione tra Omeprazolo e alcuni chemioterapici; non somministrare Omeprazolo con Metotrexato).",
          "Usare con accortezza nei tumori del SNC (influenzano la permeabilità della BEE ai chemioterapici)."
        ]
      },
      {
        name: "Desametasone",
        route: "EV",
        posology: ["6-8 mg/m² in 1 o 2 dosi/die"],
        notes: [
          "Sempre in associazione con altri antiemetici.",
          "Non scalare.",
          "Associare protezione gastrica (attenzione all'interazione tra Omeprazolo e alcuni chemioterapici; non somministrare Omeprazolo con Metotrexato).",
          "Usare con accortezza nei tumori del SNC (influenzano la permeabilità della BEE ai chemioterapici)."
        ]
      }
    ]
  },
  {
    className: "Antagonisti del recettore NK1 (NKI)",
    drugs: [
      {
        name: "Aprepitant",
        route: "PO",
        posology: ["G1: 125 mg", "G2: 80 mg", "G3: 80 mg"],
        notes: [
          "Autorizzato dai 12 anni di età.",
          "Efficace sul vomito ritardato (per esempio da Cisplatino).",
          "Azione sinergica con 5-HT3RA e corticosteroidi.",
          "Attenzione alle interazioni con alcuni chemioterapici (Ciclofosfamide, Etoposide, Irinotecano, Ifosfamide)."
        ]
      },
      {
        name: "Fosaprepitant",
        route: "EV",
        posologyGroups: [
          {
            title: "Pazienti ≥12 anni",
            values: [
              "G1: 115 mg EV",
              "G2: 80 mg EV oppure Aprepitant 80 mg PO",
              "G3: 80 mg EV oppure Aprepitant 80 mg PO"
            ]
          },
          {
            title: "Pazienti da 6 mesi a <12 anni, peso ≥6 kg",
            values: [
              "G1: 3 mg/kg EV (dose max: 115 mg)",
              "G2: 2 mg/kg EV oppure Aprepitant 2 mg/kg PO (dose max: 80 mg)",
              "G3: 2 mg/kg EV oppure Aprepitant 2 mg/kg PO (dose max: 80 mg)"
            ]
          }
        ],
        notes: [
          "Profarmaco endovenoso dell'Aprepitant.",
          "Se associato a Desametasone, somministrare il 50% della dose raccomandata di corticosteroide dal G1 al G4.",
          "Associare un antagonista 5-HT3 secondo la relativa posologia.",
          "Efficace sul vomito ritardato (per esempio da Cisplatino).",
          "Azione sinergica con 5-HT3RA e corticosteroidi.",
          "Attenzione alle interazioni con alcuni chemioterapici (Ciclofosfamide, Etoposide, Irinotecano, Ifosfamide)."
        ]
      }
    ]
  },
  {
    className: "Antagonisti dopaminergici",
    drugs: [
      {
        name: "Alizapride",
        route: "PO, EV, IM",
        posology: ["1 mg/kg/dose, ogni 8 ore", "Dose max: 50 mg/dose"],
        notes: [
          "Attenzione nell'associazione con derivati della Morfina: aumentato rischio di eventi avversi neurologici e respiratori.",
          "Azione antiemetica generalmente più limitata."
        ]
      }
    ]
  },
  {
    className: "Antipsicotici",
    drugs: [
      {
        name: "Clorpromazina",
        route: "PO, IM, EV",
        posology: ["0.5-1 mg/kg/dose, ogni 8 ore", "Dose max: 25 mg/dose"],
        notes: [
          "Gli antipsicotici sono poco usati come antiemetici per il rischio di effetto paradosso, ma possono essere utili quando è presente una prevalente componente psicologica che causa vomito anticipatorio. In questo caso può essere utile anche l'utilizzo di Lorazepam PO."
        ]
      }
    ]
  },
  {
    className: "Antistaminici",
    drugs: [
      {
        name: "Clorfenamina",
        route: "EV, IM, SC",
        posology: ["0.2 mg/kg/dose, ogni 8-12 ore", "Dose max: 10 mg/dose"],
        notes: ["Antistaminico di prima generazione."]
      }
    ]
  }
];

function FieldRow({ title, values }: { title: string; values?: string[] }) {
  if (!values?.length) return null;

  return (
    <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-3 border-t border-slate-200 py-2 first:border-t-0 dark:border-slate-800 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-4">
      <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{title}</p>
      <ul className="grid gap-1 text-sm leading-6 text-slate-700 dark:text-slate-200">
        {values.map((value) => (
          <li key={value}>{value}</li>
        ))}
      </ul>
    </div>
  );
}

function GroupedFieldRow({
  title,
  groups
}: {
  title: string;
  groups?: Array<{ title: string; values: string[] }>;
}) {
  if (!groups?.length) return null;

  return (
    <div className="grid gap-3 border-t border-slate-200 py-3 first:border-t-0 dark:border-slate-800 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-4">
      <p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{title}</p>
      <div className="grid gap-4">
        {groups.map((group) => (
          <section key={group.title} className="grid gap-1.5">
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{group.title}</h4>
            <ul className="grid list-disc gap-1 pl-5 text-sm leading-6 text-slate-700 marker:text-blue-500 dark:text-slate-200">
              {group.values.map((value) => (
                <li key={value}>{value}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}

function DrugDetails({ drug }: { drug: AntiemeticDrug }) {
  if (!drug.route && !drug.posology?.length && !drug.notes?.length) {
    return (
      <div className="bg-blue-50 p-4 text-sm leading-6 text-blue-950 dark:bg-blue-950/70 dark:text-blue-100">
        Scheda terapeutica da completare.
      </div>
    );
  }

  return (
    <div className="grid gap-4 bg-blue-50 p-4 dark:bg-blue-950/70">
      <section className="grid gap-2">
        {drug.route ? <h3 className="text-base font-semibold text-blue-950 dark:text-blue-100">Somministrazione {drug.route}</h3> : null}
        <div className="border-y border-blue-200 dark:border-blue-900">
          <FieldRow title="Posologia" values={drug.posology} />
          <GroupedFieldRow title="Posologia" groups={drug.posologyGroups} />
          <FieldRow title="Note" values={drug.notes} />
        </div>
      </section>
    </div>
  );
}

export function AntiemeticTherapy() {
  return (
    <section className="grid gap-5">
      {antiemeticClasses.map((group) => (
        <section key={group.className} className="grid gap-3">
          <h2 className="text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">{group.className}</h2>
          <div className="grid gap-2">
            {group.drugs.map((drug) => (
              <details
                key={drug.name}
                className="group overflow-hidden rounded-md border border-slate-200 bg-white transition group-open:border-blue-300 dark:border-slate-800 dark:bg-slate-950 dark:group-open:border-blue-800"
              >
                <summary className="antibiotic-summary flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50 group-open:bg-blue-50 group-open:text-blue-950 dark:text-slate-200 dark:hover:bg-slate-900 dark:group-open:bg-blue-950 dark:group-open:text-blue-100 [&::-webkit-details-marker]:hidden">
                  <span className="min-w-0">{drug.name}</span>
                  <span className="shrink-0 text-slate-500 dark:text-slate-400">
                    <ChevronRight className="size-4 group-open:hidden" />
                    <ChevronDown className="hidden size-4 group-open:block" />
                  </span>
                </summary>
                <DrugDetails drug={drug} />
              </details>
            ))}
          </div>
        </section>
      ))}
    </section>
  );
}
