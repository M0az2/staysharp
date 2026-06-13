
import { GoogleGenAI, Type } from "@google/genai";

// Always use a clean named parameter from process.env.API_KEY
const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export const getFocusAdvice = async (interruptionCount: number, durationMinutes: number) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `The user just finished a study session. They looked away ${interruptionCount} times during a ${durationMinutes} minute session. Provide 3 highly specific, science-backed tips for someone with ADHD to improve their focus based on this data. Use a supportive, encouraging tone.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              content: { type: Type.STRING },
              category: { type: Type.STRING, enum: ['ADHD', 'Focus', 'Habits'] }
            },
            required: ['title', 'content', 'category']
          }
        }
      }
    });

    // Access .text property directly and provide a fallback
    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};

export const getChatResponse = async (history: { role: 'user' | 'model' | 'assistant', parts: { text: string }[] }[], message: string) => {
  // Correctly passing the history to the chat creation
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    history: history.map(h => ({
      role: h.role === 'assistant' ? 'model' : h.role,
      parts: h.parts
    })),
    config: {
      systemInstruction: 'You are a compassionate ADHD and Focus coach. Your goal is to help users manage distraction using science-backed techniques like body doubling, the Pomodoro method, and sensory management. Keep responses concise and structured for easy reading.'
    }
  });

  const response = await chat.sendMessage({ message });
  return response.text;
};
