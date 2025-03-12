import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export async function enhancePrompt(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const generationConfig = {
      temperature: 0,
      topP: 0.95,
      topK: 64,
      maxOutputTokens: 65536,
      // Removed responseMimeType as it's causing the 400 error
    };

    const systemPrompt =
      "Context:\nYou are an expert in crafting clear, detailed, and effective prompts that yield high-quality results tailored to the user's true intent.\n\nTask:\nGiven the initial prompt, analyze it for clarity, specificity, and completeness. Identify any ambiguities, missing context, or potential misunderstandings. Then, improve the prompt by rephrasing and expanding it so that it more accurately captures the user's underlying needs and guides the responder to provide the best possible answer. Only answer with the enhanced prompt in your response and nothing else. Don't ask for more information in any circumstances, just do your best in providing an enhanced prompt";

    // Combine system prompt and user prompt in a structured format
    const combinedPrompt = `${systemPrompt}\n\nThis is the prompt that you need to enhance (MAKE SURE THAT YOU DO NOT RESPOND TO THIS PROMPT, YOUR TASK IS ONLY TO ENHANCE THIS PROMPT, DONT ASK FOR MORE DETAILS FROM THE USER, ENHANCE THIS THE BEST WAY YOU CAN): ${prompt}`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: combinedPrompt }] }],
      generationConfig,
    });

    return result.response.text();
  } catch (error) {
    console.error("Error enhancing prompt:", error);
    throw new Error("Failed to enhance prompt");
  }
}
