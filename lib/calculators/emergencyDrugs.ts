import { getClinicalSource } from "@/lib/sources/clinicalSources";

export type DrugRow = {
  label: string;
  value: string;
  note?: string;
};

export type DrugSection = {
  id: string;
  title: string;
  tone: "blue" | "amber" | "cyan" | "yellow" | "indigo" | "green";
  rows: DrugRow[];
  notes?: string[];
  calculations: string[];
};

export type EmergencyDrugsResult = {
  ageYears: number;
  weightKg: number;
  sections: DrugSection[];
};

const emergencyDrugsSource = getClinicalSource("emergency-drugs");

export const emergencyDrugsMetadata = {
  source: emergencyDrugsSource.reference,
  updatedAt: emergencyDrugsSource.updatedAt,
  note: emergencyDrugsSource.validationNote
};

export const EMERGENCY_DRUG_LIMITS = {
  lorazepamMg: 4,
  adrenalineArrestMicrograms: 1000,
  amiodaroneFirstDoseMg: 300,
  amiodaroneSecondDoseMg: 150,
  fluidBolusMl: 500,
  atropineMicrograms: 500,
  adenosineFirstDoseMg: 6,
  adenosineRepeatDoseMg: 18,
  calciumGluconateMl: 30,
  glucoseBolusMl: 50,
  defibrillationInitialJ: 200,
  defibrillationRefractoryJ: 360
} as const;

export function calculateEmergencyDrugs(ageYears: number, weightKg: number): EmergencyDrugsResult {
  if (!Number.isFinite(ageYears) || ageYears < 0) {
    throw new Error("Età non valida");
  }

  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    throw new Error("Peso non valido");
  }

  const weight = round1(weightKg);
  const limits = EMERGENCY_DRUG_LIMITS;
  const lorazepamMg = round2(cap(0.1 * weight, limits.lorazepamMg));
  const glucoseBolusMl = round1(cap(2 * weight, limits.glucoseBolusMl));
  const insulinUnits = round1(0.1 * weight);
  const glucoseInfusionMl = round1(5 * weight);
  const calciumGluconateMl = round1(cap(0.5 * weight, limits.calciumGluconateMl));
  const salbutamolIvMicrograms = round1(5 * weight);
  const atropineMicrograms = round1(cap(20 * weight, limits.atropineMicrograms));
  const adenosineFirstLowMg = round2(cap(0.1 * weight, limits.adenosineFirstDoseMg));
  const adenosineFirstHighMg = round2(cap(0.2 * weight, limits.adenosineFirstDoseMg));
  const adenosineRepeatMg = round2(cap(0.3 * weight, limits.adenosineRepeatDoseMg));
  const arrestAdrenalineMicrograms = round1(cap(10 * weight, limits.adrenalineArrestMicrograms));
  const arrestAdrenalineMl = round2(arrestAdrenalineMicrograms / 100);
  const amiodaroneMg = round1(cap(5 * weight, limits.amiodaroneFirstDoseMg));
  const arrestFluidMl = round1(cap(10 * weight, limits.fluidBolusMl));
  const defibrillationInitialJ = round1(cap(4 * weight, limits.defibrillationInitialJ));
  const defibrillationRefractoryJ = round1(cap(8 * weight, limits.defibrillationRefractoryJ));
  const hyperkalemiaArrestGlucoseMl = round1(5 * weight);
  const potassiumChlorideMmol = round1(weight);
  const anaphylaxis = calculateAnaphylaxisDose(ageYears, weight);

  return {
    ageYears,
    weightKg: weight,
    sections: [
      {
        id: "cardiac-arrest",
        title: "Rianimazione - Arresto cardiaco",
        tone: "green",
        rows: [
          { label: "Adrenalina 1:10.000", value: `${formatNumber(arrestAdrenalineMl)} ml (${formatNumber(arrestAdrenalineMicrograms)} µg)`, note: "10 µg/kg, max 1 mg (10 ml). Ripetere ogni 3-5 minuti." },
          { label: "Amiodarone (prima dose)", value: `${formatNumber(amiodaroneMg)} mg`, note: "Prima dose dopo il terzo shock: 5 mg/kg, max 300 mg. Dopo il quinto shock: 5 mg/kg, max 150 mg." },
          { label: "Fluidi", value: `${formatNumber(arrestFluidMl)} ml`, note: "10 ml/kg, max 500 ml per bolo. Cristalloide bilanciato o NaCl 0,9%; considerare fluidi riscaldati." },
          { label: "Defibrillazione iniziale", value: `${formatNumber(defibrillationInitialJ)} J`, note: "4 J/kg per shock iniziali, max 120-200 J sulla base del tipo di defibrillatore." },
          { label: "Defibrillazione refrattaria VF/pVT", value: `${formatNumber(defibrillationRefractoryJ)} J`, note: "Incrementare fino a 8 J/kg, max 360 J, se VF/pVT refrattaria." },
          { label: "Iperkaliemia in arresto: insulina", value: `${formatNumber(insulinUnits)} UI` },
          { label: "Iperkaliemia in arresto: glucosio 10% bolo", value: `${formatNumber(hyperkalemiaArrestGlucoseMl)} ml`, note: "Non somministrare calcio." },
          { label: "Ipokaliemia in arresto: potassio cloruro EV", value: `${formatNumber(potassiumChlorideMmol)} mmol`, note: "Infondere a 2 mmol/min per 10 minuti, poi dose restante in 5-10 minuti. Ripetere se necessario fino a K+ > 2,5 mmol/l. Considerare Mg2+ se ipomagnesemia." }
        ],
        calculations: [
          `Adrenalina = 10 µg/kg x ${formatNumber(weight)} kg = ${formatNumber(10 * weight)} µg, max 1000 µg -> ${formatNumber(arrestAdrenalineMicrograms)} µg`,
          `Adrenalina 1:10.000 (100 µg/ml) = ${formatNumber(arrestAdrenalineMicrograms)} µg / 100 = ${formatNumber(arrestAdrenalineMl)} ml`,
          `Amiodarone = 5 mg/kg x ${formatNumber(weight)} kg = ${formatNumber(5 * weight)} mg, max 300 mg -> ${formatNumber(amiodaroneMg)} mg`,
          `Fluidi = 10 ml/kg x ${formatNumber(weight)} kg = ${formatNumber(10 * weight)} ml, max 500 ml -> ${formatNumber(arrestFluidMl)} ml`,
          `Defibrillazione iniziale = 4 J/kg x ${formatNumber(weight)} kg = ${formatNumber(4 * weight)} J, max 200 J -> ${formatNumber(defibrillationInitialJ)} J`,
          `Defibrillazione refrattaria = 8 J/kg x ${formatNumber(weight)} kg = ${formatNumber(8 * weight)} J, max 360 J -> ${formatNumber(defibrillationRefractoryJ)} J`,
          `Iperkaliemia in arresto: insulina = 0,1 UI/kg x ${formatNumber(weight)} kg = ${formatNumber(insulinUnits)} UI`,
          `Iperkaliemia in arresto: glucosio 10% bolo = 5 ml/kg x ${formatNumber(weight)} kg = ${formatNumber(hyperkalemiaArrestGlucoseMl)} ml`,
          `Ipokaliemia in arresto: potassio cloruro = 1 mmol/kg x ${formatNumber(weight)} kg = ${formatNumber(potassiumChlorideMmol)} mmol`
        ]
      },
      {
        id: "arrhythmias",
        title: "Aritmie - Bradicardia / SVT",
        tone: "indigo",
        rows: [
          { label: "Atropina (bradicardia)", value: `${formatNumber(atropineMicrograms)} µg`, note: "20 µg/kg, max 0,5 mg. Ripetere ogni 3-5 minuti se necessario, max totale 3 mg." },
          { label: "Adenosina (SVT - prima dose)", value: `${formatNumber(adenosineFirstLowMg)} - ${formatNumber(adenosineFirstHighMg)} mg`, note: `0,1-0,2 mg/kg, max 6 mg. Se SVT persiste dopo almeno 1 minuto: 0,3 mg/kg -> ${formatNumber(adenosineRepeatMg)} mg (max 12-18 mg). Usare flush rapido e ECG a 12 derivazioni in corso.` }
        ],
        calculations: [
          `Atropina = 20 µg/kg x ${formatNumber(weight)} kg = ${formatNumber(20 * weight)} µg, max 500 µg -> ${formatNumber(atropineMicrograms)} µg`,
          `Adenosina (range prima dose) = 0,1-0,2 mg/kg x ${formatNumber(weight)} kg = ${formatNumber(0.1 * weight)} - ${formatNumber(0.2 * weight)} mg, max 6 mg -> ${formatNumber(adenosineFirstLowMg)} - ${formatNumber(adenosineFirstHighMg)} mg`,
          `Dose successiva se SVT persiste = 0,3 mg/kg x ${formatNumber(weight)} kg = ${formatNumber(0.3 * weight)} mg, max 18 mg -> ${formatNumber(adenosineRepeatMg)} mg`
        ]
      },
      {
        id: "anaphylaxis",
        title: "Allergia - Anafilassi (IM)",
        tone: "yellow",
        rows: [
          {
            label: "Adrenalina 1:1000 IM",
            value: `${formatNumber(anaphylaxis.ml)} ml (${formatNumber(anaphylaxis.micrograms)} µg)`,
            note: anaphylaxis.note
          }
        ],
        calculations: anaphylaxis.calculations
      },
      {
        id: "hyperkalaemia-non-arrest",
        title: "Metabolico - Iperkaliemia (non arresto)",
        tone: "cyan",
        rows: [
          { label: "Insulina rapida EV", value: `${formatNumber(insulinUnits)} UI` },
          { label: "Glucosio 10% (infusione EV)", value: `${formatNumber(glucoseInfusionMl)} ml in 30 min` },
          { label: "Calcio gluconato 10% se alterazioni ECG", value: `${formatNumber(calciumGluconateMl)} ml`, note: "0,5 ml/kg EV in 5-10 minuti, max 30 ml. Ripetibile dopo 5-10 minuti se le alterazioni ECG persistono." }
        ],
        notes: [
          "Salbutamolo inalatorio: 2,5-5 mg, ripetibile fino a 5 volte.",
          `Salbutamolo EV: 5 µg/kg in 5 minuti -> ${formatNumber(salbutamolIvMicrograms)} µg; ripetibile fino a 15 µg/kg se necessario.`,
          "Proseguire con infusione contenente glucosio. Controllare K+ e glicemia ogni 15 minuti per 4 ore."
        ],
        calculations: [
          `Insulina = 0,1 UI/kg x ${formatNumber(weight)} kg = ${formatNumber(insulinUnits)} UI`,
          `Glucosio 10% (infusione) = 5 ml/kg x ${formatNumber(weight)} kg = ${formatNumber(glucoseInfusionMl)} ml`,
          `Calcio gluconato 10% = 0,5 ml/kg x ${formatNumber(weight)} kg = ${formatNumber(0.5 * weight)} ml, max 30 ml -> ${formatNumber(calciumGluconateMl)} ml`,
          `Salbutamolo EV (prima dose) = 5 µg/kg x ${formatNumber(weight)} kg = ${formatNumber(salbutamolIvMicrograms)} µg; totale fino a 15 µg/kg se necessario`
        ]
      },
      {
        id: "hypoglycaemia",
        title: "Metabolico - Ipoglicemia",
        tone: "amber",
        rows: [
          {
            label: "Glucosio 10% (bolo IV/IO)",
            value: `${formatNumber(glucoseBolusMl)} ml`,
            note: "2 ml/kg, max 50 ml. Per ipoglicemia nota o sospetta. Ricontrollare glicemia dopo 5-10 minuti e ripetere se necessario."
          }
        ],
        calculations: [`Glucosio 10% = 2 ml/kg x ${formatNumber(weight)} kg = ${formatNumber(2 * weight)} ml, max 50 ml -> ${formatNumber(glucoseBolusMl)} ml`]
      },
      {
        id: "seizures",
        title: "Neurologia - Convulsioni",
        tone: "blue",
        rows: [
          {
            label: "Lorazepam",
            value: `${formatNumber(lorazepamMg)} mg`,
            note: "0,1 mg/kg IV/IO, max 4 mg per dose. Ripetibile una volta dopo 10 minuti se le convulsioni persistono."
          }
        ],
        notes: ["Considerare ipoglicemia: glucosio 10% 2 ml/kg e ricontrollare la glicemia dopo 5-10 minuti; ripetere se necessario."],
        calculations: [`Lorazepam = 0,1 mg/kg x ${formatNumber(weight)} kg = ${formatNumber(0.1 * weight)} mg, max 4 mg -> ${formatNumber(lorazepamMg)} mg`]
      }
    ]
  };
}

function calculateAnaphylaxisDose(ageYears: number, weightKg: number) {
  const ageMonths = Math.round(ageYears * 12);

  if (ageMonths < 6) {
    const ml = round2(0.01 * weightKg);
    return {
      ml,
      micrograms: round1(ml * 1000),
      note: "Età inferiore a 6 mesi: usare 0,01 ml/kg secondo valutazione clinica.",
      calculations: [`Mappatura per età < 6 mesi: 0,01 ml/kg x ${formatNumber(weightKg)} kg = ${formatNumber(ml)} ml (${formatNumber(ml * 1000)} µg)`]
    };
  }

  if (ageYears < 6) {
    return {
      ml: 0.15,
      micrograms: 150,
      note: "Età 6 mesi-6 anni -> 0,15 ml (150 µg).",
      calculations: ["Mappatura per fascia di età: 6 mesi-6 anni -> 0,15 ml (150 µg)"]
    };
  }

  return {
    ml: 0.3,
    micrograms: 300,
    note: "Età 6-12 anni -> 0,3 ml (300 µg).",
    calculations: ["Mappatura per fascia di età: 6-12 anni -> 0,3 ml (300 µg)"]
  };
}

function cap(value: number, max: number) {
  return Math.min(value, max);
}

function round1(value: number) {
  return Math.round(value * 10) / 10;
}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : String(round2(value)).replace(".", ",");
}
