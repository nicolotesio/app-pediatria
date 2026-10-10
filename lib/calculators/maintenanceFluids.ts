/**
 * Mantenimento idrico secondo Holliday-Segar:
 * 100 mL/kg/24 h per i primi 10 kg, 50 mL/kg/24 h per i successivi 10 kg, 20 mL/kg/24 h oltre i 20 kg.
 */
export function calculateHollidaySegarMaintenance(weightKg: number) {
  if (!Number.isFinite(weightKg) || weightKg <= 0) {
    throw new Error("Inserire un peso valido in kg");
  }

  let mlDay: number;
  if (weightKg <= 10) mlDay = weightKg * 100;
  else if (weightKg <= 20) mlDay = 1000 + (weightKg - 10) * 50;
  else mlDay = 1500 + (weightKg - 20) * 20;

  return { mlDay: round(mlDay), mlHour: round(mlDay / 24, 1) };
}

function round(value: number, digits = 0) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}
