import OpenAI from "openai";
import { ExcuseRequest, GeneratedExcuse } from "@shared/schema";
import { randomUUID } from "crypto";

// Default OpenAI model, can be overridden by request
const DEFAULT_MODEL = "gpt-4o-mini-2024-07-18";

export class ExcuseGeneratorService {
  private openai: OpenAI;

  constructor(apiKey: string) {
    this.openai = new OpenAI({ apiKey });
  }

  async generateExcuses(request: ExcuseRequest): Promise<GeneratedExcuse[]> {
    const prompt = this.buildPrompt(request);

    try {
      const response = await this.openai.chat.completions.create({
        model: request.model || DEFAULT_MODEL,
        messages: [
          {
            role: "system",
            content: "You are an expert at creating believable and creative excuses for various situations. You understand different audiences and how to tailor excuses accordingly. Always respond with valid JSON in the exact format requested."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        response_format: { type: "json_object" },
        temperature: request.creativity / 10, // Scale creativity to temperature
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      return result.excuses.map((excuse: any) => ({
        id: randomUUID(),
        text: excuse.text,
        credibilityScore: excuse.credibilityScore,
        originalityScore: excuse.originalityScore,
        riskLevel: excuse.riskLevel,
        deliveryTip: excuse.deliveryTip,
        totalScore: excuse.credibilityScore + excuse.originalityScore,
      }));
    } catch (error) {
      throw new Error(`Failed to generate excuses: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private buildPrompt(request: ExcuseRequest): string {
    const audienceContext = {
      professor: "academic context, should sound professional and student-appropriate",
      boss: "workplace context, should maintain professionalism",
      parents: "family context, can be more personal but respectful",
      partner: "romantic relationship context, should be understanding",
      friends: "casual context, can be more relaxed and creative"
    };

    const urgencyContext = {
      "last-minute": "emergency situation requiring immediate excuse",
      "planned": "excuse that can be given with advance notice"
    };

    return `Generate 3-5 creative and believable excuses for the following situation:

SITUATION: "${request.situation}"
AUDIENCE: ${request.audience} (${audienceContext[request.audience]})
CREATIVITY LEVEL: ${request.creativity}/10 (1=very simple and believable, 10=highly creative and unique)
URGENCY: ${request.urgency} (${urgencyContext[request.urgency]})

For each excuse, provide:
1. The excuse text (1-3 sentences)
2. Credibility score (1-10, how believable it sounds)
3. Originality score (1-10, how creative/unique it is)
4. Risk level (low/medium/high based on potential consequences if questioned)
5. Delivery tip (how to present this excuse effectively)

Respond with valid JSON in this exact format:
{
  "excuses": [
    {
      "text": "excuse text here",
      "credibilityScore": 8,
      "originalityScore": 6,
      "riskLevel": "low",
      "deliveryTip": "how to deliver this excuse"
    }
  ]
}

Consider the audience when crafting excuses. Make them appropriate for the relationship and context.`;
  }
}
