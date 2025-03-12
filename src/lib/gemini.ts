import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = import.meta.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI('apiKey');

export async function enhancePrompt(prompt: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-thinking-exp-01-21",
      systemInstruction: "Context:\nYou are an expert in crafting clear, detailed, and effective prompts that yield high-quality results tailored to the user's true intent.\n\nTask:\nGiven the initial prompt, analyze it for clarity, specificity, and completeness. Identify any ambiguities, missing context, or potential misunderstandings. Then, improve the prompt by rephrasing and expanding it so that it more accurately captures the user's underlying needs and guides the responder to provide the best possible answer. If necessary, suggest clarifying questions to further refine the user's intent.",
    });
    
    const result = await model.generateContent(`${prompt}`);
    
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error enhancing prompt:', error);
    throw new Error('Failed to enhance prompt');
  }
}