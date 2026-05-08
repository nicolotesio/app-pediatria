export type ClinicalSource = {
  id: string;
  title: string;
  reference: string;
  updatedAt: string;
  validationNote: string;
};

export const clinicalSources: ClinicalSource[] = [
  {
    id: "wetflag-local-review-needed",
    title: "WETFLAG",
    reference: "Formula mnemonica WETFLAG configurata per stime iniziali; richiede confronto con protocollo locale PALS/ALS prima dell'uso clinico.",
    updatedAt: "2026-05-08",
    validationNote: "Validare formule, concentrazioni e range con fonti locali prima di uso operativo."
  }
];
