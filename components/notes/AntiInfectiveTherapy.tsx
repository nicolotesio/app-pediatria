import { ChevronDown, ChevronRight, ExternalLink } from "lucide-react";

type RouteDetails = {
  route: string;
  posology: string[];
  specialSituations?: string[];
  dilution?: string[];
  notes?: string[];
  links?: { label: string; href: string }[];
};

type Drug = { id: string; name: string; routes: RouteDetails[] };
type DrugClass = { className: string; drugs: Drug[] };

const antiviralClasses: DrugClass[] = [
  { className: "Antivirali", drugs: [
    { id: "aciclovir", name: "Aciclovir", routes: [
      { route: "OS", posology: ["Profilassi: 600 mg/m²/dose (post-trapianto) 2 volte/die.", "Terapia: 20 mg/kg/dose 4 volte/die."], notes: ["Dose massima adulti: profilassi 800 mg 2 volte/die; terapia 800 mg 4 volte/die."] },
      { route: "EV (1 h)", posology: ["HSV: 250 mg/m²/dose 3 volte/die.", "HZV: 500 mg/m²/dose 3 volte/die; se peso <10 kg: 10 mg/kg/dose 3 volte/die."], dilution: ["Max 7 mg/mL in SF."], notes: ["Dose massima pediatrica riportata: 700 mg 3 volte/die.", "Dose massima adulti riportata: 700–800 mg 3 volte/die."] }
    ] },
    { id: "cidofovir", name: "Cidofovir", routes: [
      { route: "EV", posology: ["5 mg/kg/die, 1 volta/settimana per 2 dosi; poi ogni 15 giorni per 2 dosi."], dilution: ["1 flacone in 100–150 mL SF in 60 minuti."], notes: ["Tabella: nel paziente adulto associato a probenecid 2 g OS 3 h prima, poi 1 g OS a 2 h e 8 h dopo cidofovir.", "Criticità: la dicitura mg/kg/die è ambigua per un regime settimanale; verificare protocollo locale.", "Dose massima adulti riportata: 375 mg/dose."] }
    ] },
    { id: "valganciclovir", name: "Valganciclovir", routes: [
      { route: "EV", posology: ["Terapia: 15–18 mg/kg/dose 2 volte/die per 14 giorni.", "Mantenimento: 15–18 mg/kg/dose 1 volta/die per 14 giorni."], notes: ["Dose massima adulti: terapia 900 mg 2 volte/die; mantenimento 900 mg/die.", "Criticità: la tabella riporta EV; verificare via/formulazione nel protocollo locale."] }
    ] },
    { id: "ganciclovir", name: "Ganciclovir", routes: [
      { route: "EV", posology: ["Terapia: 5 mg/kg/dose 2 volte/die per 14 giorni.", "Mantenimento: 5 mg/kg/dose 1 volta/die per 14 giorni."] }
    ] },
    { id: "foscavir", name: "Foscavir", routes: [
      { route: "EV (2 h)", posology: ["Terapia: 60 mg/kg/dose, 3 dosi per 14 giorni.", "Mantenimento: 90 mg/kg/dose (oppure 45 mg/kg/dose 2 volte/die), 1 dose per 14 giorni."], specialSituations: ["Pre/post-idratazione con SF 50 mL in 1 h (soluzione già costituita 24 mg/mL)."], notes: ["Criticità: posologia, durata e idratazione dipendono dall’indicazione e dalla funzione renale; verificare protocollo locale."] }
    ] }
  ] }
];
const antifungalClasses: DrugClass[] = [
  { className: "Azoli", drugs: [
    { id: "fluconazolo", name: "Fluconazolo", routes: [
      { route: "EV / OS", posology: ["Profilassi: 6 mg/kg/die in 1 dose.", "Terapia: 10 mg/kg/die in 1 dose."], dilution: ["<200 mg in 50 mL SF in 60 minuti.", ">200 mg in 100 mL SF in 60 minuti."], notes: ["Dose massima pediatrica: 400 mg/die.", "Dose massima adulti: infezioni gravi fino a 800 mg/dose, con controllo dei livelli ematici."] }
    ] },
    { id: "itraconazolo", name: "Itraconazolo (sciroppo a stomaco pieno)", routes: [
      { route: "OS", posology: ["5 mg/kg/die in 2 dosi."], notes: ["Dose adulti riportata: 200 mg/die ogni 12 h.", "Criticità: formulazione e indicazione non specificate; verificare protocollo locale."] },
      { route: "EV", posology: [], notes: ["Dose adulti riportata: 200 mg ogni 12 h per 2 giorni, poi 200 mg ogni 24 h."] }
    ] },
    { id: "voriconazolo", name: "Voriconazolo", routes: [
      { route: "OS", posology: ["7 mg/kg/dose in 2 dosi."], dilution: ["SF 100 mL."], notes: ["Dose adulti riportata: 400 mg ogni 12 h il giorno 1, poi 200 mg ogni 12 h.", "Criticità: verificare via, formulazione ed età nel protocollo locale."] },
      { route: "EV", posology: [], notes: ["Dose adulti riportata: 6 mg/kg ogni 12 h il giorno 1, seguiti da 4 mg/kg ogni 12 ore."] }
    ] },
    { id: "posaconazolo", name: "Posaconazolo", routes: [
      { route: "OS", posology: ["Profilassi: 200 mg 3 volte/die.", "Terapia: 400 mg 2 volte/die oppure 200 mg 4 volte/die."], notes: ["Dosi riportate nella tabella senza distinzione pediatrica.", "Dosi adulti: profilassi 200 mg ogni 8 h; terapia 400 mg ogni 12 h (se non si alimenta 200 mg 4 volte/die).", "Criticità: formulazioni non intercambiabili; verificare protocollo locale."] }
    ] }
  ] },
  { className: "Polieni", drugs: [
    { id: "amfotericina-liposomiale", name: "Amfotericina B liposomiale", routes: [{ route: "EV", posology: ["3 mg/kg/die in 1 dose."], dilution: ["1 mg/mL oppure 1 mg/0,5 mL."], notes: ["Dose massima pediatrica: 5 mg/kg/die."] }] },
    { id: "amfotericina-deossicolato", name: "Amfotericina B deossicolato", routes: [{ route: "EV", posology: ["0,5–1,5 mg/kg/die."], notes: ["Criticità: verificare diluizione e velocità nel protocollo locale."] }] }
  ] },
  { className: "Echinocandine", drugs: [
    { id: "caspofungina", name: "Caspofungina", routes: [{ route: "EV", posology: ["70 mg/m² il giorno 1, poi 50 mg/m²."], dilution: ["SF 100 mL."], notes: ["Dose massima pediatrica: 70 mg/m².", "Dose adulti: 70 mg il giorno 1, poi 50 mg/die; se peso >80 kg: 70 mg/die."] }] }
  ] }
];
function FieldRow({ title, values }: { title: string; values?: string[] }) {
  if (!values?.length) return null;
  return <div className="grid grid-cols-[7.5rem_minmax(0,1fr)] gap-3 border-t border-slate-200 py-2 first:border-t-0 dark:border-slate-800 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-4"><p className="text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">{title}</p><ul className="grid gap-1 text-sm leading-6 text-slate-700 dark:text-slate-200">{values.map((value) => <li key={value}>{value}</li>)}</ul></div>;
}

function Details({ drug }: { drug: Drug }) {
  return <div className="grid gap-4 bg-blue-50 p-4 dark:bg-blue-950/70">{drug.routes.map((route) => <section key={route.route} className="grid gap-2"><h3 className="text-base font-semibold text-blue-950 dark:text-blue-100">Somministrazione {route.route}</h3><div className="border-y border-blue-200 dark:border-blue-900"><FieldRow title="Posologia" values={route.posology} /><FieldRow title="Situazioni particolari" values={route.specialSituations} /><FieldRow title="Diluizione" values={route.dilution} /><FieldRow title="Note" values={route.notes} /></div>{route.links?.length ? <div className="grid gap-2 rounded-md border border-blue-200 bg-white p-3 dark:border-blue-900 dark:bg-slate-950">{route.links.map((link) => <a key={link.href} href={link.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-800 hover:text-blue-950 dark:text-blue-200 dark:hover:text-blue-100">{link.label}<ExternalLink className="size-4" /></a>)}</div> : null}</section>)}</div>;
}

function TherapyList({ classes }: { classes: DrugClass[] }) {
  return <section className="grid gap-6">{classes.map((group) => <section key={group.className} className="grid gap-3"><h2 className="text-sm font-semibold uppercase text-slate-500 dark:text-slate-400">{group.className}</h2><div className="grid gap-2">{group.drugs.map((drug) => <details key={drug.id} className="group overflow-hidden rounded-md border border-slate-200 bg-white transition group-open:border-blue-300 dark:border-slate-800 dark:bg-slate-950 dark:group-open:border-blue-800"><summary className="antibiotic-summary flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-50 group-open:bg-blue-50 group-open:text-blue-950 dark:text-slate-200 dark:hover:bg-slate-900 dark:group-open:bg-blue-950 dark:group-open:text-blue-100 [&::-webkit-details-marker]:hidden"><span>{drug.name}</span><span className="shrink-0 text-slate-500 dark:text-slate-400"><ChevronRight className="size-4 group-open:hidden" /><ChevronDown className="hidden size-4 group-open:block" /></span></summary><Details drug={drug} /></details>)}</div></section>)}</section>;
}

export function AntiviralTherapy() { return <TherapyList classes={antiviralClasses} />; }
export function AntifungalTherapy() { return <TherapyList classes={antifungalClasses} />; }

