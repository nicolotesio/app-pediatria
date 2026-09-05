export type TransferrinSaturationInputs = {
  serumIronMcgDl: number;
  transferrin: number;
  transferrinUnit: "mgdl" | "gl";
};

export const TRANSFERRIN_TO_TIBC_FACTOR = 1.42;

export function convertTransferrinToMgDl(value: number, unit: TransferrinSaturationInputs["transferrinUnit"]) {
  return unit === "gl" ? value * 100 : value;
}

export function calculateTransferrinSaturation({ serumIronMcgDl, transferrin, transferrinUnit }: TransferrinSaturationInputs) {
  if (!Number.isFinite(serumIronMcgDl) || serumIronMcgDl < 0) {
    throw new Error("Inserire una sideremia valida");
  }

  if (!Number.isFinite(transferrin) || transferrin <= 0) {
    throw new Error("Inserire una transferrina valida");
  }

  const transferrinMgDl = convertTransferrinToMgDl(transferrin, transferrinUnit);
  return (serumIronMcgDl / (transferrinMgDl * TRANSFERRIN_TO_TIBC_FACTOR)) * 100;
}
