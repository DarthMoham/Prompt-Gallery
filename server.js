import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use(cors());

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Helper function for initial caps
function toInitialCaps(str) {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Enhance prompt endpoint
app.post('/api/enhance-prompt', async (req, res) => {
  try {
    const { prompt } = req.body;
    
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

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

    res.json({ enhancedPrompt: result.response.text() });
  } catch (error) {
    console.error('Error enhancing prompt:', error);
    res.status(500).json({ error: 'Failed to enhance prompt' });
  }
});

// Supabase Endpoints
// GET all prompts
app.get('/api/prompts', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Transform categories to initial caps
    const transformedData = data?.map(prompt => ({
      ...prompt,
      category: toInitialCaps(prompt.category)
    })) || [];

    res.json(transformedData);
  } catch (error) {
    console.error('Error fetching prompts:', error);
    res.status(500).json({ error: 'Failed to fetch prompts' });
  }
});

// GET categories
app.get('/api/categories', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('prompts')
      .select('category');

    if (error) throw error;

    const uniqueCategories = [...new Set(data.map(item => toInitialCaps(item.category)))].sort();
    res.json(uniqueCategories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// POST a new prompt
app.post('/api/prompts', async (req, res) => {
  try {
    const promptData = req.body;
    
    if (!promptData.title || !promptData.content || !promptData.category) {
      return res.status(400).json({ error: 'Title, content, and category are required' });
    }

    const { error } = await supabase
      .from('prompts')
      .insert([{
        ...promptData,
        category: toInitialCaps(promptData.category)
      }]);

    if (error) throw error;

    res.status(201).json({ message: 'Prompt added successfully' });
  } catch (error) {
    console.error('Error adding prompt:', error);
    res.status(500).json({ error: 'Failed to add prompt' });
  }
});

// UPDATE a prompt
app.put('/api/prompts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const promptData = req.body;
    
    if (!promptData.title || !promptData.content || !promptData.category) {
      return res.status(400).json({ error: 'Title, content, and category are required' });
    }

    const { error } = await supabase
      .from('prompts')
      .update({
        ...promptData,
        category: toInitialCaps(promptData.category)
      })
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Prompt updated successfully' });
  } catch (error) {
    console.error('Error updating prompt:', error);
    res.status(500).json({ error: 'Failed to update prompt' });
  }
});

// DELETE a prompt
app.delete('/api/prompts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('prompts')
      .delete()
      .eq('id', id);

    if (error) throw error;

    res.json({ message: 'Prompt deleted successfully' });
  } catch (error) {
    console.error('Error deleting prompt:', error);
    res.status(500).json({ error: 'Failed to delete prompt' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});