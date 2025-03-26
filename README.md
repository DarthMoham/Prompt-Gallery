# Prompt Gallery

[![Sparkles Icon](public/github-cover.png)](/)

**Manage and Enhance Prompts for Large Language Models**

Prompt Gallery is a web application to help you organize, search, and optimize your prompts for Large Language Models (LLMs).  It provides a user-friendly interface to store your prompts, categorize them, and even enhance them using the Gemini API.

**Key Features:**

*   **Prompt Management:** Add, edit, and delete prompts with titles, content, and categories.
*   **Categorization & Search:** Organize and easily find prompts.
*   **Prompt Enhancement:** Improve your prompts using the Gemini API.

## Installation

**Local Development:**

1.  **Clone the repository:**
    ```bash
    git clone [repository_url]
    cd Prompt-Gallery
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Set up environment variables:**
    *   For local installation, create a `.env` file and add your Gemini API key and Supabase credentials:
    ```
    VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    SUPABASE_URL=YOUR_SUPABASE_URL
    SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    PORT=3001 # Optional: You can change the backend port if needed
    NODE_ENV=development
    ```
    *   To host this online on vercel, create these einvironmental variables:
    ```
    VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    SUPABASE_URL=YOUR_SUPABASE_URL
    SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    NODE_ENV=production
    ```

4.  **Run development servers:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:5173](http://localhost:5173) in your browser.

## Usage

1.  **Enhance Prompts:** Use the "Enhance Your Prompt" section to refine your prompts with the Gemini API. Copy or save the enhanced versions.
2.  **Add Prompts:** Click "Add Prompt" to save new prompts with titles, content, and categories.
3.  **View Prompts:** Browse and search prompts in the gallery.

For detailed documentation, see [docs/FULL_DOCUMENTATION.md](docs/FULL_DOCUMENTATION.md).

---
