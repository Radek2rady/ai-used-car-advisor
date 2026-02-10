import { analyzeRisk } from "../src/services/riskAnalyzer";

describe("analyzeRisk", () => {
  it("returns high risk for accident keywords", () => {
    const result = analyzeRisk({ adText: "Minor accident reported" });
    expect(result.label).toBe("high");
    expect(result.score).toBe(100);
  });

  it("returns medium risk when no keywords are present", () => {
    const result = analyzeRisk({ adText: "Clean title, well maintained" });
    expect(result.label).toBe("medium");
    expect(result.score).toBe(50);
  });
});
