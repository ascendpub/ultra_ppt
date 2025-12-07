
import { GoogleGenAI, Type } from "@google/genai";
import { PresentationData, SlideType } from "../types";

// --- PHASE 1: RESEARCH AGENT ---
const RESEARCH_SYSTEM_INSTRUCTION = `
You are a Deep Research Agent. Your goal is to gather comprehensive, factual, and data-driven information about a user's topic to prepare for a professional presentation.
1. Search for key trends, latest statistics, and definitions related to the topic.
2. Find specific data points that can be visualized in charts (e.g., market growth, comparisons).
3. Identify a logical "step-by-step" process or a historical timeline relevant to the topic.
4. Find a relevant, impactful quote from an industry expert or historical figure.
5. Summarize the findings into a structured report.
`;

export const performDeepResearch = async (topic: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  console.log(`[Deep Research] Starting research on: ${topic}`);

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Research the topic: "${topic}". 
      Focus on gathering:
      1. 3-5 Key points/trends.
      2. Data for a bar or pie chart (labels and numeric values).
      3. A timeline of 3-5 events (years and descriptions).
      4. A process with 3-4 steps.
      5. A relevant quote.
      Provide a comprehensive summary.`,
      config: {
        systemInstruction: RESEARCH_SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }] // Enable Google Search Grounding
      }
    });

    // Extract text and potentially grounding metadata
    const researchText = response.text;
    
    // Log grounding sources for debugging
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (sources) {
      console.log("[Deep Research] Sources found:", sources.length);
    }

    return researchText || `No specific research data found for ${topic}.`;
  } catch (error) {
    console.warn("[Deep Research] Search failed, falling back to internal knowledge.", error);
    return `Analysis based on internal knowledge for topic: ${topic}`;
  }
};

// --- PHASE 2: GENERATION AGENT ---
const GENERATION_SYSTEM_INSTRUCTION = `
You are an expert presentation designer.
Your goal is to generate a structured JSON object for a PowerPoint presentation based on the User's Topic and the provided Research Context.
The content MUST be in Chinese (Simplified).

RULES:
1. USE THE RESEARCH CONTEXT: Use the provided research summary to fill in the slides with REAL facts, REAL data, and REAL quotes. Do not hallucinate data if the research provides it.
2. Logical Flow: Title -> Introduction -> Key Points -> Data Visualization (Charts/Tables) -> Engagement (Quotes) -> Process/Timeline -> Conclusion.
3. Slide Count: If user specified a count, adhere to it. Otherwise, default to 8-12 slides.
4. Slide Types: You MUST include at least one CHART, one TABLE, one PROCESS, and one TIMELINE using the data from the research context.
5. Visuals: Ensure 'imageKeyword' is a specific English keyword for finding stock photos.
6. Closing: In the sourceUrl field of the CLOSING slide, try to reference a domain mentioned in the research or a general relevant resource.
`;

const generateWithRetry = async <T>(fn: () => Promise<T>, retries = 3, baseDelay = 1000): Promise<T> => {
  let lastError: any;
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      console.warn(`Attempt ${i + 1} failed:`, error);
      if (i < retries - 1) {
        const delay = baseDelay * Math.pow(2, i);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
};

export const generatePresentationContent = async (topic: string, researchContext?: string): Promise<PresentationData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const finalPrompt = `
  TOPIC: ${topic}
  
  RESEARCH CONTEXT (Use this data):
  ${researchContext || "No specific research provided, use general knowledge."}
  
  Generate the presentation structure JSON now.
  `;

  const response = await generateWithRetry(async () => {
    const res = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: finalPrompt,
      config: {
        systemInstruction: GENERATION_SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topic: { type: Type.STRING },
            themeColor: { type: Type.STRING, description: "A hex color code suitable for the theme" },
            slides: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  type: { 
                    type: Type.STRING, 
                    enum: [
                      SlideType.TITLE, 
                      SlideType.CONTENT_TEXT, 
                      SlideType.CONTENT_TEXT_IMAGE, 
                      SlideType.CONTENT_VIDEO,
                      SlideType.TABLE, 
                      SlideType.BIG_NUMBER,
                      SlideType.QUOTE,
                      SlideType.CHART,
                      SlideType.TIMELINE,
                      SlideType.PROCESS,
                      SlideType.CLOSING
                    ] 
                  },
                  title: { type: Type.STRING },
                  subtitle: { type: Type.STRING },
                  bullets: { 
                    type: Type.ARRAY, 
                    items: { type: Type.STRING } 
                  },
                  imageKeyword: { type: Type.STRING },
                  videoUrl: { type: Type.STRING },
                  tableHeaders: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING }
                  },
                  tableRows: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING }
                    }
                  },
                  bigNumber: { type: Type.STRING },
                  bigNumberLabel: { type: Type.STRING },
                  quoteText: { type: Type.STRING },
                  quoteAuthor: { type: Type.STRING },
                  chart: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING, enum: ['BAR', 'PIE', 'LINE'] },
                      title: { type: Type.STRING },
                      labels: { type: Type.ARRAY, items: { type: Type.STRING } },
                      values: { type: Type.ARRAY, items: { type: Type.NUMBER } },
                      dataLabel: { type: Type.STRING }
                    },
                    required: ["type", "labels", "values", "dataLabel"]
                  },
                  timeline: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        year: { type: Type.STRING },
                        title: { type: Type.STRING },
                        description: { type: Type.STRING }
                      },
                      required: ["year", "title"]
                    }
                  },
                  processSteps: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        title: { type: Type.STRING },
                        description: { type: Type.STRING }
                      },
                      required: ["title", "description"]
                    }
                  },
                  speakerNotes: { type: Type.STRING },
                  sourceUrl: { type: Type.STRING }
                },
                required: ["type", "title", "speakerNotes"]
              }
            }
          },
          required: ["topic", "slides", "themeColor"]
        }
      }
    });
    return res;
  });

  if (!response.text) {
    throw new Error("No content generated from Gemini");
  }

  return JSON.parse(response.text) as PresentationData;
};
