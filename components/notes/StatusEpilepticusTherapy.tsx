import { ChevronDown, ChevronRight } from "lucide-react";

type DrugLevel = "Primo livello" | "Secondo livello";

type StatusEpilepticusDrug = {
  id: string;
  name: string;
  mechanism: string[];
  dose: string[];
  infusion: string[];
  maxDose: string[];
  onset: string;
  duration: string;
  notes: string[];
};

const drugGroups: { level: DrugLevel; drugs: StatusEpilepticusDrug[] }[] = [
  {
    level: "Primo livello",
    drugs: [
      {
        id: "midazolam",
        name: "Midazolam",
        mechanism: ["-| recettori GABA-A"],
        dose: ["0,15-0,2 mg/kg (anche IM/EN)", "Oromucosale: 0,3-0,5 mg/kg", "6m-1a: 2,5 mg", "1-5aa: 5 mg", "5-10aa: 7,5 mg", ">10aa: 10 mg"],
        infusion: ["Bolo a velocità < 2 mg/min"],
        maxDose: ["5 mg", "10 mg"],
        onset: "1,5-5 min",
        duration: "1-5 ore",
        notes: ["Note: non registrato per SE.", "Scelta d'elezione se manca accesso venoso.", "Effetti collaterali: depressione respiratoria."]
      },
      {
        id: "diazepam",
        name: "Diazepam",
        mechanism: ["-| recettori GABA-A"],
        dose: ["0,3 mg/kg", "ER: 0,3-0,5 mg/kg", "<10 kg: 5 mg", "10-20 kg: 7,5 mg", ">20 kg: 10 mg"],
        infusion: ["Bolo a velocità < 2 mg/min"],
        maxDose: ["10 mg"],
        onset: "1-3 min",
        duration: "5-15 ore",
        notes: ["Note: Rapido ma con breve durata d'azione (ridistribuzione nel tessuto adiposo).", "Effetti collaterali: depressione respiratoria."]
      },
      {
        id: "lorazepam",
        name: "Lorazepam",
        mechanism: ["-| recettori GABA-A"],
        dose: ["0,1 mg/kg (anche IO)"],
        infusion: ["Bolo a velocità < 2 mg/min"],
        maxDose: ["4 mg"],
        onset: "2-5 min",
        duration: "6-12 ore",
        notes: ["Note: Gold standard ospedaliero.", "Maggiore durata d'azione cerebrale rispetto al Diazepam.", "Effetti collaterali: depressione respiratoria."]
      }
    ]
  },
  {
    level: "Secondo livello",
    drugs: [
      {
        id: "levetiracetam",
        name: "Levetiracetam",
        mechanism: ["-| proteina sinaptica SV2A", "modula il rilascio dei NT"],
        dose: ["40 (15-75) mg/kg"],
        infusion: ["Infondere in 15 min", "< 5 mg/kg/min"],
        maxDose: ["3 g"],
        onset: "25-30 min",
        duration: "12-15 ore",
        notes: ["Note: non registrato per SE.", "Dimezzare la dose se insufficienza renale.", "Vantaggioso per buona tollerabilità e assenza di effetti emodinamici/sedativi."]
      },
      {
        id: "fenitoina",
        name: "Fenitoina",
        mechanism: ["-| canali del sodio voltaggio-dipendenti"],
        dose: ["20 (15-20) mg/kg"],
        infusion: ["Infondere in 20-30 min", "< 50 mg/min", "0,5 mg/kg/min"],
        maxDose: ["1 g"],
        onset: "10-30 min",
        duration: "12-24 ore",
        notes: [
          "Note: NON diluire in glucosata.",
          "Monitorare FC e PAO.",
          "Da evitare nei cardiopatici.",
          "Da preferire se instabilità respiratoria.",
          "Controindicazioni: QT lungo, BAV II grado, ipotensione grave.",
          "Effetti collaterali: ipotensione, aritmie, reazioni cutanee."
        ]
      },
      {
        id: "fenobarbitale",
        name: "Fenobarbitale",
        mechanism: ["-| recettori GABA-A", "-| recettori AMPA (glutammato)", "-| canali del calcio"],
        dose: ["20 (10-20) mg/kg"],
        infusion: ["Infondere in 20-30 min", "< 100 mg/min", "1 mg/kg/min"],
        maxDose: ["1 g"],
        onset: "10-20 min",
        duration: "1-3 giorni",
        notes: ["Note: dimezzare la dose in insufficienza epatica e porfiria.", "Da preferire nei lattanti e pazienti febbrili.", "Effetti collaterali: depressione respiratoria, ipotensione."]
      },
      {
        id: "acido-valproico",
        name: "Acido valproico",
        mechanism: ["GABA ↑", "-| canali del sodio voltaggio-dipendenti", "-| canali del calcio"],
        dose: ["20 (15-40) mg/kg"],
        infusion: ["Infondere in 15 min", "< 200 mg/min", "1-3 mg/kg/min"],
        maxDose: ["1,5 g"],
        onset: "10-20 min",
        duration: "12-24 ore",
        notes: [
          "Note: non registrato per SE.",
          "Da preferire se instabilità respiratoria.",
          "Controindicazioni: patologie epatiche e metaboliche, coagulopatie, età < 3 anni in SE ad eziologia ignota (rischio encefalopatia).",
          "Effetti collaterali: trombocitopenia, vertigini, epatotossicità."
        ]
      },
      {
        id: "piridossina",
        name: "Piridossina",
        mechanism: ["Coenzima (complesso vitaminico B6)"],
        dose: ["100 mg"],
        infusion: ["Bolo lento"],
        maxDose: ["500 mg"],
        onset: "minuti",
        duration: "-",
        notes: ["Note: da somministrare EV nei bambini con età < 6-12 mesi in caso di non risposta agli altri farmaci."]
      }
    ]
  }
];

function FieldRow({ title, values }: { title: string; values?: string[] }) {
  if (!values?.length) {
    return null;
  }

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

function DrugDetails({ drug }: { drug: StatusEpilepticusDrug }) {
  return (
    <div className="grid gap-4 bg-blue-50 p-4 dark:bg-blue-950/70">
      <div className="border-y border-blue-200 dark:border-blue-900">
        <FieldRow title="Meccanismo azione" values={drug.mechanism} />
        <FieldRow title="Dose (EV/IO)" values={drug.dose} />
        <FieldRow title="Velocità infusione" values={drug.infusion} />
        <FieldRow title="Dose massima" values={drug.maxDose} />
        <FieldRow title="Inizio effetto" values={[drug.onset]} />
        <FieldRow title="Durata effetto" values={[drug.duration]} />
        <FieldRow title="Note, effetti collaterali e controindicazioni" values={drug.notes} />
      </div>
    </div>
  );
}

export function StatusEpilepticusTherapy() {
  return (
    <section className="grid gap-5">
      {drugGroups.map((group) => (
        <section key={group.level} className="grid gap-3">
          <h2 className="text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">{group.level}</h2>
          <div className="grid gap-2">
            {group.drugs.map((drug) => (
              <details
                key={drug.id}
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
