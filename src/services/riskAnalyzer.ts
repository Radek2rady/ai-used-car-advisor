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
  const text = (input.adText ?? "").toLowerCase();
  const hasRiskKeyword =
    text.includes("accident") ||
    text.includes("crash") ||
    text.includes("totaled");

  const label: RiskOutput["label"] = hasRiskKeyword ? "high" : "medium";
  const score = hasRiskKeyword ? 100 : 50;
  const reasons = [
    hasRiskKeyword
      ? "Ad mentions accident/crash/totaled"
      : "No accident keywords in ad",
  ];

  return { score, label, reasons };
}
