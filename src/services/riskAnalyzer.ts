export type RiskInput = {
  adText?: string;
  make?: string;
  model?: string;
  modelYear?: number;
  mileage?: number;
  accidentCount?: number;
  ownerCount?: number;
};

export type RiskOutput = {
  score: number;
  label: "low" | "medium" | "high";
  reasons: string[];
};

export function analyzeRisk(input: RiskInput): RiskOutput {
  let score = 0;
  const reasons: string[] = [];

  if (typeof input.mileage === "number" && input.mileage > 120_000) {
    score += 40;
    reasons.push("High mileage");
  }

  if (typeof input.accidentCount === "number" && input.accidentCount > 0) {
    score += 30;
    reasons.push("Reported accidents");
  }

  if (typeof input.ownerCount === "number" && input.ownerCount > 2) {
    score += 20;
    reasons.push("Multiple prior owners");
  }

  if (typeof input.modelYear === "number" && input.modelYear < 2012) {
    score += 15;
    reasons.push("Older model year");
  }

  if (reasons.length === 0) {
    reasons.push("No risk signals identified");
  }

  const normalized = Math.min(100, score);
  let label: RiskOutput["label"] = "low";
  if (normalized >= 60) {
    label = "high";
  } else if (normalized >= 30) {
    label = "medium";
  }

  return { score: normalized, label, reasons };
}
