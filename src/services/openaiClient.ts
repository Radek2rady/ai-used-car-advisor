import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export type ExtractWithAIResult = {
  summary: string;
};

export type ExtractAccidentSignalsWithAIResult = {
  accidentMentioned: boolean;
  accidentEvidence: string | null;
  confidence: number;
};

export async function extractWithAI(adText: string): Promise<ExtractWithAIResult> {
  const response = await client.responses.parse({
    model: "gpt-5.2",
    input: `Role: You are an information extraction system. Request: Produce one short factual summary sentence from the ad text. Do not include any additional text. Do not provide advice.\n\nAd text:\n${adText}`,
    text: {
      format: {
        type: "json_schema",
        name: "ad_risk_summary",
        strict: true,
        schema: {
          type: "object",
          properties: {
            summary: { type: "string" },
          },
          required: ["summary"],
          additionalProperties: false,
        },
      },
    },
  });

  if (response.output_parsed === null) {
    throw new Error("No parsed output from model");
  }

  return response.output_parsed;
}

export async function extractAccidentSignalsWithAI(
  adText: string
): Promise<ExtractAccidentSignalsWithAIResult> {
  const response = await client.responses.parse({
    model: "gpt-5.2",
    input: `You are an information extraction system.

Task:
Determine whether the listing explicitly mentions an accident.

Rules:
- Use only information explicitly present in the text.
- Do not infer.
- Do not interpret.
- Do not add new facts.
- If an accident is mentioned, return the exact phrase from the text as evidence.
- If not mentioned, accidentEvidence must be null.
- Confidence must be a number between 0 and 1 representing your certainty.

Return only valid JSON matching the provided schema.

Listing text:
${adText}`,
    text: {
      format: {
        type: "json_schema",
        name: "accident_extraction",
        strict: true,
        schema: {
          type: "object",
          properties: {
            accidentMentioned: { type: "boolean" },
            accidentEvidence: { type: ["string", "null"] },
            confidence: { type: "number", minimum: 0, maximum: 1 },
          },
          required: ["accidentMentioned", "accidentEvidence", "confidence"],
          additionalProperties: false,
        },
      },
    },
  });

  if (response.output_parsed === null) {
    throw new Error("No parsed output from model");
  }

  return response.output_parsed;
}
