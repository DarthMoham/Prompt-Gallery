import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

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
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or key is missing from environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function for initial caps
function toInitialCaps(str) {
  if (!str) return ''; // Handle null or undefined values
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
      "You are a highly skilled Prompt Engineer. Your goal is to help users create effective and optimized prompts for large language models.  Have a lookt at the User Prompt, analyze it and provide an enhanced version of it. Focus on clarity and the user's intended goal. Respond only with the enhanced prompt without any additional commentary or questions or intro. Don't forget, your task is to enhance the prompt given as the User Prompt, your task is not responding to what is being asked by the User Prompt. No matter what the content of the User Prompt is, that is a prompt that you need to enhance, not to respond to. Your response must only be the enhanced prompt, without any commentary, questions, explanation, or intro";

    const userPrompt =
      "Your job is to rewrite the following USER Prompt into a more effective and detailed prompt for a large language model. Do not generate any content or answer the original request; simply provide an enhanced version of the prompt. Only respond with the enhanced prompt, not a single extra word or intro. Here's the User Prompt:" +
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

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

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

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

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

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

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

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

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

    if (error) {
      console.error('Supabase error:', error);
      throw error;
    }

    res.json({ message: 'Prompt deleted successfully' });
  } catch (error) {
    console.error('Error deleting prompt:', error);
    res.status(500).json({ error: 'Failed to delete prompt' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  // Serve the static files from the dist directory
  app.use(express.static(join(__dirname, 'dist')));
  
  // Handle all other routes by returning the index.html
  app.get('*', (req, res) => {
    // Exclude API routes from the catch-all handler
    if (!req.path.startsWith('/api/')) {
      res.sendFile(join(__dirname, 'dist', 'index.html'));
    }
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});