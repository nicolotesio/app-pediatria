/** Formatta un numero con la virgola decimale italiana, senza zeri superflui. */
export function formatDecimal(value: number, maxDigits = 2) {
  const factor = 10 ** maxDigits;
  const rounded = Math.round(value * factor) / factor;
  return String(rounded).replace(".", ",");
}

/** Formatta un numero con cifre decimali fisse (es. diametri dei tubi: 4,0). */
export function formatFixed(value: number, digits = 1) {
  return value.toFixed(digits).replace(".", ",");
}
