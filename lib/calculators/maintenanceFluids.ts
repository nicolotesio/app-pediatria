export type HydrationStatus = "euvolemic" | "mildDehydration" | "moderateDehydration" | "severeDehydration";
export type SodiumAgeGroup = "smallChild" | "olderChild";
export type AlertLevel = "info" | "warning" | "critical";

export type FluidInputs = {
  weightKg: number;
  usualWeightKg?: number | null;
  hydrationStatus: HydrationStatus;
  siadhRisk: boolean;
  overloadRisk: boolean;
  sodium?: number | null;
  potassium?: number | null;
  sodiumTarget?: number | null;
  sodiumAgeGroup: SodiumAgeGroup;
  fever: boolean;
  diarrheaStools: number;
  measuredLossesMlDay: number;
  otherFluidsMlDay: number;
};

export type SafetyAlert = {
  level: AlertLevel;
  message: string;
};

export type SodiumCorrectionResult = {
  status: "notCalculated" | "normal" | "deficit" | "excess";
  target: number | null;
  sodiumDeltaMEq: number | null;
  sodiumDeficitMEq: number | null;
  sodiumExcessMEq: number | null;
  distributionVolumeL: number | null;
  distributionFactor: number | null;
  note: string;
};

export type FluidCalculationResult = {
  standardMlDay: number;
  standardMlHour: number;
  restrictionFactor: number;
  restrictionLabel: string;
  correctedMaintenanceMlDay: number;
  correctedMaintenanceMlHour: number;
  previousLossesMl: number;
  previousLossesSource: string;
  predictableLossesMlDay: number;
  predictableLossesDetails: string[];
  otherFluidsMlDay: number;
  infusionMlDay: number;
  infusionMlHour: number;
  noAdditionalIv: boolean;
  sodiumCorrection: SodiumCorrectionResult;
  alerts: SafetyAlert[];
  recommendation: {
    solution: string;
    conclusion: string;
    sodium: string;
  };
  monitoring: string[];
  hasCriticalAlert: boolean;
};

const MAX_MAINTENANCE_ML_DAY = 2000;
const DEFAULT_SODIUM_TARGET = 140;

export const hydrationStatusLabels: Record<HydrationStatus, string> = {
  euvolemic: "Euvolemia",
  mildDehydration: "Disidratazione lieve",
  moderateDehydration: "Disidratazione moderata",
  severeDehydration: "Disidratazione severa"
};

export const sodiumAgeGroupLabels: Record<SodiumAgeGroup, string> = {
  smallChild: "< 2 anni",
  olderChild: "≥ 2 anni"
};

const clinicalDehydrationFractions: Record<HydrationStatus, number> = {
  euvolemic: 0,
  mildDehydration: 0.03,
  moderateDehydration: 0.07,
  severeDehydration: 0.1
};

export function calculateHollidaySegar(weightKg: number) {
  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    throw new Error("Inserire un peso valido in kg");
  }

  let mlDay: number;
  if (weightKg <= 10) mlDay = weightKg * 100;
  else if (weightKg <= 20) mlDay = 1000 + (weightKg - 10) * 50;
  else mlDay = 1500 + (weightKg - 20) * 20;

  const cappedMlDay = Math.min(mlDay, MAX_MAINTENANCE_ML_DAY);
  return {
    mlDay: round(cappedMlDay),
    mlHour: round(cappedMlDay / 24, 1),
    capped: cappedMlDay !== mlDay
  };
}

export function getRestrictionFactor({ siadhRisk, overloadRisk }: { siadhRisk: boolean; overloadRisk: boolean }) {
  if (overloadRisk) {
    return {
      factor: 0.5,
      label: siadhRisk ? "50% del mantenimento (prevale rischio overload/edemi)" : "50% del mantenimento"
    };
  }
  if (siadhRisk) return { factor: 0.7, label: "70% del mantenimento (range orientativo 65-80%)" };
  return { factor: 1, label: "100% del mantenimento" };
}

export function calculatePreviousLosses(inputs: Pick<FluidInputs, "weightKg" | "usualWeightKg" | "hydrationStatus">) {
  const clinicalLossMl = inputs.weightKg * clinicalDehydrationFractions[inputs.hydrationStatus] * 1000;
  const weightLossMl =
    inputs.usualWeightKg !== null &&
    inputs.usualWeightKg !== undefined &&
    Number.isFinite(inputs.usualWeightKg) &&
    inputs.usualWeightKg > inputs.weightKg
      ? (inputs.usualWeightKg - inputs.weightKg) * 1000
      : null;

  if (weightLossMl !== null) return { ml: round(weightLossMl), source: "Da peso perso" };
  return {
    ml: round(clinicalLossMl),
    source: inputs.hydrationStatus === "euvolemic" ? "Nessuna perdita stimata" : "Da stima clinica"
  };
}

export function calculatePredictableLosses(inputs: Pick<FluidInputs, "weightKg" | "fever" | "diarrheaStools" | "measuredLossesMlDay">) {
  const details: string[] = [];
  const feverLoss = inputs.fever ? inputs.weightKg * 0.015 * 1000 : 0;
  if (feverLoss > 0) details.push(`Iperpiressia persistente/grave: ${round(feverLoss)} mL/24h`);

  const diarrheaLoss = Math.max(0, inputs.diarrheaStools) * 50;
  if (diarrheaLoss > 0) details.push(`Diarrea: ${round(diarrheaLoss)} mL/24h`);

  const measuredLoss = Math.max(0, Number.isFinite(inputs.measuredLossesMlDay) ? inputs.measuredLossesMlDay : 0);
  if (measuredLoss > 0) details.push(`Perdite misurate/SNG: ${round(measuredLoss)} mL/24h`);

  const total = feverLoss + diarrheaLoss + measuredLoss;
  return {
    ml: round(total),
    details: details.length > 0 ? details : ["Nessuna perdita prevedibile inserita"]
  };
}

export function getSodiumDistributionFactor({ hydrationStatus, sodiumAgeGroup }: Pick<FluidInputs, "hydrationStatus" | "sodiumAgeGroup">) {
  const dehydrated = hydrationStatus !== "euvolemic";
  if (sodiumAgeGroup === "smallChild") return dehydrated ? 0.7 : 0.8;
  return dehydrated ? 0.6 : 0.7;
}

export function calculateSodiumCorrection(inputs: Pick<FluidInputs, "weightKg" | "hydrationStatus" | "sodiumAgeGroup" | "sodium" | "sodiumTarget">): SodiumCorrectionResult {
  if (inputs.sodium === null || inputs.sodium === undefined || !Number.isFinite(inputs.sodium)) {
    return {
      status: "notCalculated",
      target: null,
      sodiumDeltaMEq: null,
      sodiumDeficitMEq: null,
      sodiumExcessMEq: null,
      distributionVolumeL: null,
      distributionFactor: null,
      note: "Natremia non inserita: correzione del sodio non calcolata."
    };
  }

  const target = inputs.sodiumTarget && Number.isFinite(inputs.sodiumTarget) ? inputs.sodiumTarget : DEFAULT_SODIUM_TARGET;
  const distributionFactor = getSodiumDistributionFactor(inputs);
  const distributionVolumeL = inputs.weightKg * distributionFactor;
  const sodiumDeltaMEq = (inputs.sodium - target) * distributionVolumeL;

  if (sodiumDeltaMEq < 0) {
    return {
      status: "deficit",
      target,
      sodiumDeltaMEq: round(sodiumDeltaMEq, 1),
      sodiumDeficitMEq: round(Math.abs(sodiumDeltaMEq), 1),
      sodiumExcessMEq: null,
      distributionVolumeL: round(distributionVolumeL, 2),
      distributionFactor,
      note: `Deficit stimato con VdNa ${distributionFactor} L/kg. Non sostituisce protocollo specifico, valutazione dei sintomi e velocità massima di correzione.`
    };
  }

  if (sodiumDeltaMEq > 0) {
    return {
      status: "excess",
      target,
      sodiumDeltaMEq: round(sodiumDeltaMEq, 1),
      sodiumDeficitMEq: null,
      sodiumExcessMEq: round(sodiumDeltaMEq, 1),
      distributionVolumeL: round(distributionVolumeL, 2),
      distributionFactor,
      note: `Eccesso stimato con VdNa ${distributionFactor} L/kg. Correggere lentamente secondo protocollo specifico e monitoraggio ravvicinato.`
    };
  }

  return {
    status: "normal",
    target,
    sodiumDeltaMEq: 0,
    sodiumDeficitMEq: null,
    sodiumExcessMEq: null,
    distributionVolumeL: round(distributionVolumeL, 2),
    distributionFactor,
    note: "Natremia uguale al target impostato: nessuna correzione specifica stimata."
  };
}

export function subtractOtherFluids(targetMlDay: number, otherFluidsMlDay: number) {
  const safeOtherFluids = Math.max(0, Number.isFinite(otherFluidsMlDay) ? otherFluidsMlDay : 0);
  const residualMlDay = Math.max(0, targetMlDay - safeOtherFluids);
  return {
    otherFluidsMlDay: round(safeOtherFluids),
    residualMlDay: round(residualMlDay),
    residualMlHour: round(residualMlDay / 24, 1),
    noAdditionalIv: safeOtherFluids >= targetMlDay
  };
}

export function getSafetyAlerts(inputs: FluidInputs): SafetyAlert[] {
  const alerts: SafetyAlert[] = [];
  if (inputs.hydrationStatus === "severeDehydration") {
    alerts.push({
      level: "critical",
      message: "Disidratazione severa: il calcolo di mantenimento può non essere appropriato. Utilizzare protocollo specifico e valutazione specialistica."
    });
  }

  if (inputs.sodium !== null && inputs.sodium !== undefined && Number.isFinite(inputs.sodium)) {
    if (inputs.sodium < 125) {
      alerts.push({
        level: "critical",
        message: "Iponatriemia severa: non usare calcolo standard come unica guida; valutazione urgente/specialistica."
      });
    } else if (inputs.sodium < 130) {
      alerts.push({
        level: "warning",
        message: "Iponatriemia significativa: evitare fluidi ipotonici, monitoraggio ravvicinato, valutare gestione specifica."
      });
    }

    if (inputs.sodium > 160) {
      alerts.push({
        level: "critical",
        message: "Ipernatriemia severa: non usare mantenimento standard come guida unica."
      });
    } else if (inputs.sodium > 150) {
      alerts.push({
        level: "warning",
        message: "Ipernatriemia: rischio di correzione troppo rapida; usare protocollo specifico."
      });
    }
  }

  if (inputs.potassium !== null && inputs.potassium !== undefined && Number.isFinite(inputs.potassium)) {
    if (inputs.potassium >= 6) {
      alerts.push({
        level: "critical",
        message: "Iperkaliemia significativa: rivalutare soluzione, supplementazione di potassio e monitoraggio ECG/laboratoristico."
      });
    } else if (inputs.potassium < 3) {
      alerts.push({
        level: "warning",
        message: "Ipokaliemia: valutare correzione secondo protocollo locale, diuresi e funzione renale."
      });
    }
  }

  if ((inputs.siadhRisk || inputs.overloadRisk) && inputs.hydrationStatus !== "euvolemic") {
    alerts.push({
      level: "warning",
      message: "Coesistono rischio di ritenzione/sovraccarico e perdite: il bilancio va individualizzato e rivalutato spesso."
    });
  }
  return alerts;
}

export function calculateMaintenanceFluids(inputs: FluidInputs): FluidCalculationResult {
  const standard = calculateHollidaySegar(inputs.weightKg);
  const restriction = getRestrictionFactor({ siadhRisk: inputs.siadhRisk, overloadRisk: inputs.overloadRisk });
  const correctedMaintenanceMlDay = round(standard.mlDay * restriction.factor);
  const previousLosses = calculatePreviousLosses(inputs);
  const predictableLosses = calculatePredictableLosses(inputs);
  const grossTotal = correctedMaintenanceMlDay + previousLosses.ml + predictableLosses.ml;
  const residual = subtractOtherFluids(grossTotal, inputs.otherFluidsMlDay);
  const sodiumCorrection = calculateSodiumCorrection(inputs);
  const alerts = getSafetyAlerts(inputs);

  if (residual.noAdditionalIv) {
    alerts.push({
      level: "warning",
      message: "Altri apporti ≥ fabbisogno stimato: nessuna quota EV aggiuntiva stimata."
    });
  }

  return {
    standardMlDay: standard.mlDay,
    standardMlHour: standard.mlHour,
    restrictionFactor: restriction.factor,
    restrictionLabel: restriction.label,
    correctedMaintenanceMlDay,
    correctedMaintenanceMlHour: round(correctedMaintenanceMlDay / 24, 1),
    previousLossesMl: previousLosses.ml,
    previousLossesSource: previousLosses.source,
    predictableLossesMlDay: predictableLosses.ml,
    predictableLossesDetails: predictableLosses.details,
    otherFluidsMlDay: residual.otherFluidsMlDay,
    infusionMlDay: residual.residualMlDay,
    infusionMlHour: residual.residualMlHour,
    noAdditionalIv: residual.noAdditionalIv,
    sodiumCorrection,
    alerts,
    recommendation: getFluidRecommendation(residual.residualMlDay, sodiumCorrection),
    monitoring: getMonitoringRecommendations(),
    hasCriticalAlert: alerts.some((alert) => alert.level === "critical")
  };
}

export function getFluidRecommendation(infusionMlDay: number, sodiumCorrection: SodiumCorrectionResult) {
  const sodiumText =
    sodiumCorrection.status === "deficit"
      ? `Correzione sodio: deficit NaCl stimato ${sodiumCorrection.sodiumDeficitMEq} mEq verso Na target ${sodiumCorrection.target} mEq/L; non automatizzare senza protocollo.`
      : sodiumCorrection.status === "excess"
        ? `Correzione sodio: eccesso NaCl stimato ${sodiumCorrection.sodiumExcessMEq} mEq verso Na target ${sodiumCorrection.target} mEq/L; correggere lentamente secondo protocollo.`
        : sodiumCorrection.note;

  return {
    solution: "Soluzione isotonica bilanciata glucosata, se disponibile; alternativa locale secondo protocolli aziendali. Evitare SG 5% pura, soluzioni ipotoniche routinarie e NaCl 0,2-0,45% salvo indicazione specialistica.",
    conclusion: infusionMlDay > 0
      ? `Infusione orientativa da impostare: ${round(infusionMlDay)} mL/24h, pari a ${round(infusionMlDay / 24, 1)} mL/h, da rivalutare con bilancio e clinica.`
      : "Nessuna quota EV aggiuntiva stimata dopo sottrazione degli altri apporti.",
    sodium: sodiumText
  };
}

export function formatResults(results: FluidCalculationResult) {
  return {
    standard: `${results.standardMlDay} mL/24h (${results.standardMlHour} mL/h)`,
    correctedMaintenance: `${results.correctedMaintenanceMlDay} mL/24h (${results.correctedMaintenanceMlHour} mL/h)`,
    restriction: results.restrictionLabel,
    previousLosses: `${results.previousLossesMl} mL (${results.previousLossesSource})`,
    predictableLosses: `${results.predictableLossesMlDay} mL/24h`,
    otherFluids: `${results.otherFluidsMlDay} mL/24h`,
    infusion: results.noAdditionalIv ? "Nessuna quota EV aggiuntiva stimata" : `${results.infusionMlDay} mL/24h (${results.infusionMlHour} mL/h)`
  };
}

export function getMonitoringRecommendations() {
  return [
    "bilancio idrico",
    "peso quotidiano",
    "diuresi",
    "Na/K/Cl",
    "glicemia",
    "rivalutazione almeno quotidiana della necessità di EV",
    "riduzione/sospensione appena possibile se via enterale/orale sufficiente"
  ];
}

function round(value: number, digits = 0) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}
