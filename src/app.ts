import express from "express";
import { healthRouter } from "./routes/health";
import { analyzeRisk } from "./services/riskAnalyzer";

export const app = express();

app.use(express.json());

app.use(healthRouter);

app.post("/analyze", (req, res) => {
  const { adText } = req.body as { adText: string };
  const result = analyzeRisk({ adText });
  res.json({ riskLevel: result.label, notes: result.reasons });
});
