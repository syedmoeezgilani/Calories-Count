import { GoogleGenAI, Type } from "@google/genai";
import { NutritionData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchNutritionInfo = async (foodQuery: string): Promise<NutritionData> => {
  const modelId = "gemini-2.5-flash"; // Efficient for structured data extraction

  const prompt = `
    Analyze the nutritional content of the following food item: "${foodQuery}".
    Provide a realistic serving size and nutritional values based on that serving size.
    If the input is vague (e.g., "apple"), assume a standard medium-sized whole version.
    If the input is a meal (e.g., "burger and fries"), estimate the total combined values.
    
    Provide values for:
    - Calories (kcal)
    - Protein (g)
    - Total Carbohydrates (g)
    - Total Fat (g)
    - Fiber (g)
    - Sugar (g)
    - Cholesterol (mg)
    - Sodium (mg)
    
    Also provide a short, 1-sentence health tip or fun fact about this food.
  `;

  const response = await ai.models.generateContent({
    model: modelId,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          foodName: { type: Type.STRING, description: "The formalized name of the food (e.g., 'Medium Red Apple')" },
          servingSize: { type: Type.STRING, description: "The serving size used for calculation (e.g., '1 medium (182g)')" },
          calories: { type: Type.NUMBER, description: "Total calories in kcal" },
          protein: { type: Type.NUMBER, description: "Protein content in grams" },
          carbs: { type: Type.NUMBER, description: "Total carbohydrate content in grams" },
          fat: { type: Type.NUMBER, description: "Total fat content in grams" },
          fiber: { type: Type.NUMBER, description: "Dietary fiber in grams" },
          sugar: { type: Type.NUMBER, description: "Total sugar in grams" },
          cholesterol: { type: Type.NUMBER, description: "Cholesterol in milligrams" },
          sodium: { type: Type.NUMBER, description: "Sodium in milligrams" },
          healthTip: { type: Type.STRING, description: "A brief health insight or fact" },
        },
        required: ["foodName", "servingSize", "calories", "protein", "carbs", "fat", "fiber", "sugar", "healthTip"],
      },
    },
  });

  const jsonText = response.text;
  if (!jsonText) {
    throw new Error("No data returned from AI");
  }

  try {
    return JSON.parse(jsonText) as NutritionData;
  } catch (error) {
    console.error("Failed to parse nutrition JSON", error);
    throw new Error("Failed to process nutrition data.");
  }
};