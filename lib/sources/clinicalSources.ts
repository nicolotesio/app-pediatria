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
    reference: `${RCUK_PAEDIATRIC_CHART_2026} ${ERC_PLS_2021}`,
    updatedAt: "2026-10-10",
    validationNote:
      "Massimali applicati dalla tabella RCUK: adrenalina 1 mg, bolo di fluidi 500 ml, glucosio 10% 50 ml, amiodarone 300 mg (prima dose), calcio gluconato 10% 30 ml. Adenosina prima dose max 6 mg secondo ERC 2021 (la tabella RCUK non riporta un massimale per la prima dose). Per potassio cloruro, insulina/glucosio nell'iperkaliemia e salbutamolo EV le fonti citate non riportano un massimale: confermare con il protocollo locale."
  }
];

export function getClinicalSource(id: string) {
  const source = clinicalSources.find((item) => item.id === id);
  if (!source) throw new Error(`Fonte clinica non trovata: ${id}`);
  return source;
}
