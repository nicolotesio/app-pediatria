export type ClinicalSource = {
  id: string;
  title: string;
  reference: string;
  updatedAt: string;
  validationNote: string;
};

export const RCUK_PAEDIATRIC_CHART_2026 =
  "Resuscitation Council UK. Paediatric emergency algorithms and resources, versione 5 (gennaio 2026), basati sulle Guidelines 2025: Paediatric emergency drug chart.";
export const ERC_PLS_2021 =
  "Van de Voorde P et al. European Resuscitation Council Guidelines 2021: Paediatric Life Support. Resuscitation. 2021;161:327-387.";

export const ERC_PLS_2025 =
  "Djakow J et al. European Resuscitation Council Guidelines 2025: Paediatric Life Support. Resuscitation. 2025;215(Suppl 1):110767.";

export const clinicalSources: ClinicalSource[] = [
  {
    id: "wetflag",
    title: "WETFLAG",
    reference: RCUK_PAEDIATRIC_CHART_2026,
    updatedAt: "2026-10-10",
    validationNote: "Stime iniziali: confermare peso reale, concentrazioni disponibili e protocollo locale prima della somministrazione."
  },
  {
    id: "emergency-drugs",
    title: "Farmaci in emergenza",
    reference: `${RCUK_PAEDIATRIC_CHART_2026} ${ERC_PLS_2025} ${ERC_PLS_2021}`,
    updatedAt: "2026-11-09",
    validationNote:
      "Massimali dalla tabella RCUK: adrenalina 1 mg, bolo di fluidi 500 ml, glucosio 10% 50 ml (valori della riga adulto), amiodarone 300 mg, atropina 600 µg, calcio gluconato 10% 30 ml, lorazepam 4 mg; adrenalina IM nell'anafilassi per fasce di età. Da ERC 2025: insulina max 10 UI con glucosio 10% max 250 ml nell'iperkaliemia, potassio cloruro max 30 mmol nell'ipokaliemia in arresto, nessun calcio in arresto. Adenosina prima dose max 6 mg secondo ERC 2021 (la tabella RCUK non riporta un massimale per la prima dose). Per il salbutamolo EV le fonti citate non riportano un massimale: confermare con il protocollo locale."
  }
];

export function getClinicalSource(id: string) {
  const source = clinicalSources.find((item) => item.id === id);
  if (!source) throw new Error(`Fonte clinica non trovata: ${id}`);
  return source;
}
