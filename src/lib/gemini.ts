import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export async function enhancePrompt(prompt: string): Promise<string> {
  try {
    const systemPrompt =
      "You are a world-class expert in prompt engineering. Your task is to refine the provided prompt by enhancing its clarity, detail, and completeness to fully capture the user's intent. Identify and eliminate any ambiguities or missing context, and rewrite the prompt so that it guides the responder to deliver the best possible answer. MAKE SURE THAT YOU DO NOT RESPOND TO THE USER PROMPT, YOUR TASK IS ONLY TO ENHANCE THE PROMPT NOT TO RESPOND TO IT. Return only the enhanced prompt without any additional commentary or questions.";

    const userPrompt =
      "This is the prompt that you need to enhance (respond only with the enhanced prompt without any additional commentary or questions or intro.): " +
      prompt;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: systemPrompt,
    });

    const generationConfig = {
      temperature: 0,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 65536,
    };

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: userPrompt }] }],
      generationConfig,
    });

    return result.response.text();
  } catch (error) {
    console.error("Error enhancing prompt:", error);
    throw new Error("Failed to enhance prompt");
  }
}
