import { GoogleGenAI, Type } from "@google/genai";

// Always initialize GoogleGenAI using the process.env.API_KEY directly as a named parameter.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const suggestItinerary = async (destination: string, days: number) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Crie um roteiro de viagem de ${days} dias para ${destination}. Retorne os dados em formato JSON estruturado.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            day: { type: Type.INTEGER },
            activities: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.STRING },
                  activity: { type: Type.STRING },
                  location: { type: Type.STRING },
                  notes: { type: Type.STRING }
                }
              }
            }
          }
        }
      }
    }
  });

  // Access the .text property directly and trim whitespace before parsing JSON.
  const jsonStr = response.text?.trim() || '[]';
  return JSON.parse(jsonStr);
};