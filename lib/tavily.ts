import { GoogleGenAI } from "@google/genai";

export async function scoreIdea(title: string, domain: string, problem: string, solution: string): Promise<{ score: number; scoreDetails: string }> {
  const tavilyApiKey = process.env.TAVILY_API_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (!tavilyApiKey || !geminiApiKey) {
    console.warn("API keys missing, returning dummy score.");
    return { score: Math.floor(Math.random() * 100), scoreDetails: "Dummy detail because API keys are missing." };
  }

  // 1. Search Tavily for existing implementations
  const query = `${title} OR "${solution.substring(0, 50)}" startup ${domain} company`;
  let searchResults = "";

  try {
    const response = await fetch("https://api.tavily.com/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: tavilyApiKey,
        query: query,
        search_depth: "basic",
        max_results: 5,
        include_answers: true
      })
    });

    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      searchResults = data.results.map((r: any) => `- ${r.title}: ${r.content.substring(0, 200)}`).join("\n");
    } else {
      searchResults = "No clear company matches found in search.";
    }
  } catch (error) {
    console.error("Tavily API error", error);
    searchResults = "Error fetching search results.";
  }

  // 2. Use Gemini to intelligently score it based on the organic search results
  const ai = new GoogleGenAI({ apiKey: geminiApiKey });
  const prompt = `You are a startup market analyst. Your job is to calculate an "Implementation Score" (0 to 100) based on how saturated or thoroughly executed this idea already is according to web search results.

Idea Title: ${title}
Domain: ${domain}
Problem: ${problem}
Solution: ${solution}

Web Search Results for existing/similar companies:
${searchResults}

Scoring Scale:
0-20: Completely novel, deeply uncharted, virtually no real companies doing exact match.
21-40: Some academic/blog discussion, maybe 1 early-stage startup trying it.
41-60: 1-2 established early stage companies, validated market but room to grow.
61-80: Multiple funded companies doing almost exactly this.
81-100: Highly saturated, major players exist doing exactly this (e.g. Uber for X when Uber exists).

Respond ONLY with valid JSON in this exact format, without markdown wrapping:
{"score": <number 0-100>, "details": "<1 sentence summarizing the existing competition landscape over these web results>"}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [prompt]
    });

    const text = response.text || "{}";
    const jsonStr = text.replace(/```json\s?/g, '').replace(/```\s?/g, '').trim();
    const result = JSON.parse(jsonStr);

    return {
      score: typeof result.score === "number" ? result.score : 50,
      scoreDetails: result.details || "Analyzed search results but failed to summarize formally."
    };
  } catch (error) {
    console.error("Gemini scoring error:", error);
    return { score: 50, scoreDetails: "Error scoring idea via AI, but search was completed." };
  }
}
