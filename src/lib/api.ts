const getApiBaseUrl = () => {
  return '';
};

export interface Prompt {
    id: string;
    title: string;
    content: string;
    category: string;
    created_at: string;
  }

  // Fetch all prompts
  export async function fetchPrompts(): Promise<Prompt[]> {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/prompts`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error('Failed to fetch prompts');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching prompts:', error);
      throw error;
    }
  }

  // Fetch categories
  export async function fetchCategories(): Promise<string[]> {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/categories`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error('Failed to fetch categories');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  // Add a new prompt
  export async function addPrompt(promptData: { title: string; content: string; category: string }): Promise<void> {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/prompts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(promptData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error('Failed to add prompt');
      }
    } catch (error) {
      console.error('Error adding prompt:', error);
      throw error;
    }
  }
  
  // Update an existing prompt
  export async function updatePrompt(id: string, promptData: { title: string; content: string; category: string }): Promise<void> {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/prompts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(promptData),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error('Failed to update prompt');
      }
    } catch (error) {
      console.error('Error updating prompt:', error);
      throw error;
    }
  }

  // Delete a prompt
  export async function deletePrompt(id: string): Promise<void> {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/prompts/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error('Failed to delete prompt');
      }
    } catch (error) {
      console.error('Error deleting prompt:', error);
      throw error;
    }
  }

  // Enhance a prompt
  export async function enhancePrompt(prompt: string): Promise<string> {
    try {
      const response = await fetch(`${getApiBaseUrl()}/api/enhance-prompt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error('Failed to enhance prompt');
      }
  
      const data = await response.json();
      return data.enhancedPrompt;
    } catch (error) {
      console.error("Error enhancing prompt:", error);
      throw new Error("Failed to enhance prompt");
    }
  }