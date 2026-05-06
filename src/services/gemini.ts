import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function getRecommendations(userProfile: any, internships: any[]) {
  const prompt = `
    You are an AI career advisor for the Indian Government's Rozgar AI platform.
    Based on the user's profile and the available internships, provide a list of the top 3 recommended internships.
    
    User Profile:
    - Name: ${userProfile.name}
    - Skills: ${userProfile.skills.join(', ')}
    - Education: ${userProfile.education}
    
    Available Internships:
    ${internships.map(i => `- ${i.title} at ${i.ministry} (Category: ${i.category})`).join('\n')}
    
    Return only a JSON array of the IDs of the top 3 recommended internships.
    Example: ["1", "3", "5"]
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-exp",
      contents: [{ parts: [{ text: prompt }] }],
    });
    
    const text = response.text;
    const match = text.match(/\[.*\]/);
    if (match) {
      return JSON.parse(match[0]);
    }
    return [];
  } catch (error) {
    console.error("Error getting recommendations:", error);
    return internships.slice(0, 3).map(i => i.id);
  }
}
