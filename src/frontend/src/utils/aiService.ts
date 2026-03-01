export type AIProvider = "grok" | "gemini" | "perplexity" | "deepseek";

export interface AIProviderConfig {
  name: string;
  label: string;
  placeholder: string;
  docsUrl: string;
}

export const AI_PROVIDERS: Record<AIProvider, AIProviderConfig> = {
  grok: {
    name: "grok",
    label: "Grok (xAI)",
    placeholder: "xai-...",
    docsUrl: "https://console.x.ai/",
  },
  gemini: {
    name: "gemini",
    label: "Gemini (Google)",
    placeholder: "AIza...",
    docsUrl: "https://aistudio.google.com/",
  },
  perplexity: {
    name: "perplexity",
    label: "Perplexity",
    placeholder: "pplx-...",
    docsUrl: "https://www.perplexity.ai/settings/api",
  },
  deepseek: {
    name: "deepseek",
    label: "DeepSeek",
    placeholder: "sk-...",
    docsUrl: "https://platform.deepseek.com/",
  },
};

export const CCPC_ANALYSIS_PROMPT = `CCPC (Chattogram Cantonment Public College, Bangladesh) achieved the following results:
- HSC 2025: 36 medical admissions (44% growth from 25 in HSC 2024). Top national rank: #143 (Tanrum Nur Seeam, Dhaka Medical College).
- HSC 2024: 10 BUET admissions across multiple engineering departments.

Compare CCPC against these Bangladeshi colleges: Notre Dame College (Dhaka), Rajshahi College, BAF Shaheen College (Dhaka), Birshreshtha Munshi Abdur Rouf Public College, Holy Cross College (Dhaka).

Provide a structured analysis in this exact JSON format (respond ONLY with valid JSON, no markdown):
{
  "summary": "3-sentence paragraph about CCPC regional standing and strengths",
  "achievements": [
    {"icon": "🏆", "title": "Short title", "description": "One sentence fact about CCPC achievement"},
    {"icon": "📈", "title": "Short title", "description": "One sentence growth metric"},
    {"icon": "🎯", "title": "Short title", "description": "One sentence standout metric"},
    {"icon": "🏫", "title": "Short title", "description": "One sentence comparison point"}
  ],
  "collegeComparisons": [
    {"college": "CCPC", "city": "Chattogram", "buet2025Est": 10, "medical2025Est": 36},
    {"college": "Notre Dame", "city": "Dhaka", "buet2025Est": 45, "medical2025Est": 80},
    {"college": "Rajshahi College", "city": "Rajshahi", "buet2025Est": 20, "medical2025Est": 50},
    {"college": "BAF Shaheen", "city": "Dhaka", "buet2025Est": 12, "medical2025Est": 30},
    {"college": "BMARPC", "city": "Dhaka", "buet2025Est": 8, "medical2025Est": 20},
    {"college": "Holy Cross", "city": "Dhaka", "buet2025Est": 5, "medical2025Est": 25}
  ]
}`;

// Call Grok (xAI) API
export async function callGrok(
  apiKey: string,
  prompt: string,
): Promise<string> {
  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-3-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an educational data analyst. Always respond with valid JSON only.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 600,
    }),
  });
  if (!res.ok) throw new Error(`Grok error: ${res.status}`);
  const data = await res.json();
  return (data.choices?.[0]?.message?.content as string) ?? "";
}

// Call Gemini (Google) API
export async function callGemini(
  apiKey: string,
  prompt: string,
): Promise<string> {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 600 },
      }),
    },
  );
  if (!res.ok) throw new Error(`Gemini error: ${res.status}`);
  const data = await res.json();
  return (data.candidates?.[0]?.content?.parts?.[0]?.text as string) ?? "";
}

// Call Perplexity API
export async function callPerplexity(
  apiKey: string,
  prompt: string,
): Promise<string> {
  const res = await fetch("https://api.perplexity.ai/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "sonar",
      messages: [
        {
          role: "system",
          content:
            "You are an educational data analyst. Always respond with valid JSON only.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 600,
    }),
  });
  if (!res.ok) throw new Error(`Perplexity error: ${res.status}`);
  const data = await res.json();
  return (data.choices?.[0]?.message?.content as string) ?? "";
}

// Call DeepSeek API
export async function callDeepSeek(
  apiKey: string,
  prompt: string,
): Promise<string> {
  const res = await fetch("https://api.deepseek.com/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "deepseek-chat",
      messages: [
        {
          role: "system",
          content:
            "You are an educational data analyst. Always respond with valid JSON only.",
        },
        { role: "user", content: prompt },
      ],
      max_tokens: 600,
    }),
  });
  if (!res.ok) throw new Error(`DeepSeek error: ${res.status}`);
  const data = await res.json();
  return (data.choices?.[0]?.message?.content as string) ?? "";
}

export async function callAIProvider(
  provider: AIProvider,
  apiKey: string,
  prompt: string,
): Promise<string> {
  switch (provider) {
    case "grok":
      return callGrok(apiKey, prompt);
    case "gemini":
      return callGemini(apiKey, prompt);
    case "perplexity":
      return callPerplexity(apiKey, prompt);
    case "deepseek":
      return callDeepSeek(apiKey, prompt);
  }
}

// Parse AI JSON response into structured data
export interface AIAnalysisResult {
  summary: string;
  achievements: Array<{ icon: string; title: string; description: string }>;
  collegeComparisons: Array<{
    college: string;
    city: string;
    buet2025Est: number;
    medical2025Est: number;
  }>;
}

export function parseAIResponse(text: string): AIAnalysisResult | null {
  try {
    // Strip markdown code blocks if present
    const cleaned = text
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    const parsed = JSON.parse(cleaned) as unknown;
    if (
      parsed !== null &&
      typeof parsed === "object" &&
      "summary" in parsed &&
      "achievements" in parsed &&
      "collegeComparisons" in parsed
    ) {
      return parsed as AIAnalysisResult;
    }
    return null;
  } catch {
    return null;
  }
}
