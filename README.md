# Prompt-Gallery

[![SVG Cover](public/github-cover.png)](https://prompt-gallery.jl.co)

## 🚀 Overview

Prompt-Gallery is a modern web application designed to help developers manage, organize, and optimize prompts for Large Language Models (LLMs). This platform provides intuitive tools for prompt storage, categorization, and AI‑enhanced refinement using the Gemini API.

---

## 🔍 Key Features

- **Prompt Management**  
  Add, edit, and delete prompts with metadata support including:
  - Title and description
  - Category tags
  - Creation/last‑modified dates

- **Advanced Organization**  
  Smart categorization system with:
  - Tag‑based filtering
  - Search suggestions
  - Version history tracking

- **AI‑Powered Enhancement**  
  Get intelligent prompt suggestions using Gemini API:
  - Context‑aware optimization
  - Tone/style suggestions
  - Clarity improvements

- **Collaboration Ready**  
  Shareable prompts with:
  - Public/private visibility settings
  - Version comparison
  - Comment threads

---

## 🧰 Technology Stack

- **Frontend**: Vue.js 3 with Vite 4
- **Backend**: Node.js with Express
- **Database**: Supabase (vector search enabled)
- **AI Integration**: Gemini Pro API
- **UI Components**: Tailwind CSS 3.x

---

## 🛠️ Setup & Installation

### 1. Prerequisites
- Node.js v18.x+
- Python 3.10+ (for Gemini API)
- Supabase account

### 2. Local Development
```bash
# Clone the repository
git clone https://github.com/Mo-Ara/Prompt-Gallery.git
cd Prompt-Gallery

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

### 3. Environment Configuration
```env
# Production
VITE_GEMINI_API_KEY=***
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
NODE_ENV=production

# Development
PORT=5173
NODE_ENV=development
```

---

## 🧪 Running the Application
```bash
# Start the app
npm run dev

# Open in browser
http://localhost:5173
```

---

## 📦 Deployment (Vercel)
Create production `.env` entries in `vercel.json`:
```json
{
  "version": 2,
  "env": {
    "VITE_GEMINI_API_KEY": "prod-key",
    "SUPABASE_URL": "prod-url",
    "SUPABASE_ANON_KEY": "prod-anon-key"
  }
}
```

---

## 📚 Documentation
- [Full Documentation](docs/FULL_DOCUMENTATION.md)
- [API Reference Guide](docs/API_REFERENCE.md)
- [Architecture Diagram](docs/ARCHITECTURE.md)

---

## 🖥️ Demo
- [Live Demo](https://prompt-gallery.jl.co)
- [Feature Walkthrough](https://prompt-gallery.jl.co/features)

---

## 📄 License
MIT License – feel free to use and modify, with attribution preferred.

## 🤝 Contributing
We welcome contributions! Feel free to:
- Suggest new features
- Submit bug fixes
- Add integrations

Create an issue in our [GitHub repository](https://github.com/Mo-Ara/Prompt-Gallery/issues).

---

## 🤖 AI Integration Notes
- Gemini API authentication happens via the API key in `.env`
- Usage is tracked automatically
- Enterprise rate limits are available through Supabase
