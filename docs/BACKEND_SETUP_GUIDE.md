# Backend Server Setup Guide (Node.js & Express)

## 1. Introduction

**Purpose:** This guide provides a step-by-step approach to setting up a simple backend server using Node.js and the Express framework. It covers basic setup, handling requests, managing configuration, and considerations for both local development and production deployment.

**Technology Stack:**
*   **Node.js:** JavaScript runtime environment.
*   **Express.js:** Minimalist web framework for Node.js.
*   **Environment Variables (`.env`):** For managing configuration and secrets.

**Approach:** This guide follows a single-file server structure (`server.js`), which is suitable for small to medium-sized projects or as a starting point for larger applications.

## 2. Prerequisites

*   **Node.js and npm (or yarn):** Ensure you have Node.js (version 16 or higher recommended, as per the example project) and its package manager (npm, usually included with Node.js, or yarn) installed. You can download them from [nodejs.org](https://nodejs.org/).
*   **Terminal/Command Line:** Basic familiarity with using your system's terminal or command prompt.
*   **JavaScript:** Basic understanding of JavaScript syntax and concepts.

## 3. Project Setup

1.  **Create Project Directory:**
    ```bash
    mkdir my-backend-project
    cd my-backend-project
    ```

2.  **Initialize npm:** Create a `package.json` file to manage project dependencies and scripts.
    ```bash
    npm init -y
    ```

3.  **Install Core Dependencies:**
    *   `express`: The web framework.
    *   `dotenv`: Loads environment variables from a `.env` file.
    *   `cors`: Enables Cross-Origin Resource Sharing (important for development).
    ```bash
    npm install express dotenv cors
    ```

4.  **Install Development Dependencies (Optional but Recommended):**
    *   `nodemon`: Automatically restarts the server when file changes are detected during development.
    *   `concurrently`: Runs multiple commands concurrently (useful for running frontend and backend dev servers together).
    *   `cross-env`: Sets environment variables across different platforms consistently.
    ```bash
    npm install --save-dev nodemon concurrently cross-env
    ```

5.  **Create Server File:** Create the main file for your server code.
    ```bash
    touch server.js
    ```

6.  **Set up `package.json` Scripts:** Add scripts to your `package.json` for easily running the server:
    ```json
    {
      "name": "my-backend-project",
      "version": "1.0.0",
      "main": "server.js",
      "type": "module", // Add this line to use ES Module syntax (import/export)
      "scripts": {
        "start": "cross-env NODE_ENV=production node server.js",
        "dev": "cross-env NODE_ENV=development nodemon server.js"
        // Example for running frontend and backend together:
        // "dev": "concurrently \"npm run server:dev\" \"npm run client:dev\"",
        // "server:dev": "cross-env NODE_ENV=development nodemon server.js",
        // "client:dev": "cd ../client && npm run dev" // Adjust client path/command
      },
      "dependencies": {
        "cors": "^2.8.5",
        "dotenv": "^16.3.1",
        "express": "^4.18.2"
      },
      "devDependencies": {
        "concurrently": "^8.2.0", // If installed
        "cross-env": "^7.0.3",    // If installed
        "nodemon": "^3.0.0"       // If installed
      },
      "engines": { // Optional: Specify Node.js version compatibility
        "node": ">=16.0.0"
      }
    }
    ```
    *Note: Ensure `"type": "module"` is added if you plan to use `import`/`export` syntax as shown in the examples.*

## 4. Basic Server Structure (`server.js`)

Populate `server.js` with the basic Express setup:

```javascript
// Use import syntax if "type": "module" is in package.json
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Initialize the Express application
const app = express();

// Define the port the server will listen on
// Use the PORT environment variable if available, otherwise default to 3001
const PORT = process.env.PORT || 3001;

// --- Middleware ---
// Enable Cross-Origin Resource Sharing (allows requests from different origins, e.g., your frontend dev server)
app.use(cors());
// Parse incoming JSON requests (makes req.body available)
app.use(express.json());

// --- Basic Route ---
// Example: A simple GET route for the root path
app.get('/', (req, res) => {
  res.send('Hello from the Backend!');
});

// --- Start the Server ---
app.listen(PORT, () => {
  // Log a message when the server starts successfully
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
```

## 5. Environment Variables

Environment variables are used to manage configuration settings (like ports, database URLs, API keys) separately from your code. This is crucial for security (keeping secrets out of version control) and flexibility (different settings for development vs. production).

1.  **Create `.env` file:** In the root of your project, create a file named `.env`.
    ```bash
    touch .env
    ```

2.  **Add to `.gitignore`:** **Crucially, add `.env` to your `.gitignore` file** to prevent accidentally committing secrets to version control.
    ```
    # .gitignore
    node_modules
    .env
    dist # If you have a build output directory
    ```

3.  **Define Variables:** Add key-value pairs to your `.env` file.
    ```dotenv
    # .env example
    PORT=3001
    NODE_ENV=development # Set automatically by scripts usually

    # Example variables for external services
    DATABASE_URL=your_database_connection_string_here
    API_KEY=your_secret_api_key_here
    SUPABASE_URL=your_supabase_project_url
    SUPABASE_ANON_KEY=your_supabase_anon_key
    GEMINI_API_KEY=your_google_ai_api_key
    ```

4.  **Load Variables:** The `dotenv.config()` line in `server.js` loads these variables into `process.env`.

5.  **Access Variables:** Access them in your code using `process.env.VARIABLE_NAME`. For example, `process.env.PORT` or `process.env.DATABASE_URL`.

6.  **Development vs. Production:** The `NODE_ENV` variable (often set to `development` or `production` via `cross-env` in your npm scripts) is commonly used to enable different behaviors (e.g., more detailed logging in development, serving static files in production).

## 6. Defining API Routes

API (Application Programming Interface) routes define the endpoints your frontend or other services can interact with. REST (Representational State Transfer) is a common architectural style for APIs.

```javascript
// server.js (continued)

// --- API Routes ---

// GET /api/items - Fetch a list of items
app.get('/api/items', async (req, res) => {
  try {
    // Replace with your actual data fetching logic (e.g., from a database)
    const items = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];
    res.json(items); // Send data as JSON
  } catch (error) {
    console.error('Error fetching items:', error);
    res.status(500).json({ error: 'Failed to fetch items' }); // Send error response
  }
});

// GET /api/items/:id - Fetch a single item by ID
app.get('/api/items/:id', async (req, res) => {
  try {
    const itemId = req.params.id; // Get the ID from the URL path
    // Replace with logic to find the item by ID
    const item = { id: itemId, name: `Item ${itemId}` };
    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ error: 'Item not found' }); // Not found error
    }
  } catch (error) {
    console.error(`Error fetching item ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

// POST /api/items - Create a new item
app.post('/api/items', async (req, res) => {
  try {
    const newItemData = req.body; // Get data from the request body (requires express.json() middleware)

    // Basic Input Validation Example
    if (!newItemData.name) {
      return res.status(400).json({ error: 'Item name is required' }); // Bad request error
    }

    // Replace with logic to save the new item (e.g., to a database)
    console.log('Creating new item:', newItemData);
    const createdItem = { id: Date.now(), ...newItemData }; // Example: assign a temporary ID

    res.status(201).json(createdItem); // Send success response (201 Created)
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// PUT /api/items/:id - Update an existing item
app.put('/api/items/:id', async (req, res) => {
  try {
    const itemId = req.params.id;
    const updatedData = req.body;

    if (!updatedData.name) {
      return res.status(400).json({ error: 'Item name is required' });
    }

    // Replace with logic to update the item in the database
    console.log(`Updating item ${itemId}:`, updatedData);
    const updatedItem = { id: itemId, ...updatedData };

    res.json(updatedItem); // Send updated item back
  } catch (error) {
    console.error(`Error updating item ${itemId}:`, error);
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// DELETE /api/items/:id - Delete an item
app.delete('/api/items/:id', async (req, res) => {
  try {
    const itemId = req.params.id;
    // Replace with logic to delete the item from the database
    console.log(`Deleting item ${itemId}`);

    res.json({ message: 'Item deleted successfully' }); // Send success message
    // Alternatively, send a 204 No Content status: res.status(204).send();
  } catch (error) {
    console.error(`Error deleting item ${itemId}:`, error);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

// ... (rest of server.js, including app.listen)
```

## 7. Connecting to External Services (Example: Database/BaaS)

Most backends interact with databases or other services (like Supabase, Google AI, etc.).

1.  **Install SDK/Client:** Install the necessary library for the service.
    ```bash
    # Example for Supabase
    npm install @supabase/supabase-js

    # Example for Google Generative AI
    npm install @google/generative-ai
    ```

2.  **Initialize Client:** Import and initialize the client, typically using credentials from environment variables.

    ```javascript
    // server.js (near the top)
    import { createClient } from '@supabase/supabase-js';
    import { GoogleGenerativeAI } from '@google/generative-ai';

    // ... dotenv.config(), app initialization ...

    // Initialize Supabase client
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY; // Use the ANON key for client-side access if needed, or SERVICE_ROLE key for backend admin access

    if (!supabaseUrl || !supabaseKey) {
      console.error('Supabase URL or key is missing. Check your .env file.');
      // process.exit(1); // Optional: Exit if essential config is missing
    }

    // Only initialize if keys are present
    const supabase = (supabaseUrl && supabaseKey) ? createClient(supabaseUrl, supabaseKey) : null;

    // Initialize Google Generative AI
    const geminiApiKey = process.env.GEMINI_API_KEY;
    const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;

    if (!supabase) {
        console.warn('Supabase client not initialized due to missing environment variables.');
    }
    if (!genAI) {
        console.warn('Google Generative AI client not initialized due to missing environment variables.');
    }

    // ... middleware, routes ...
    ```

3.  **Use Client in Routes:** Use the initialized client within your route handlers to interact with the service.

    ```javascript
    // Example using Supabase in a route
    app.get('/api/prompts', async (req, res) => {
      if (!supabase) return res.status(503).json({ error: 'Database service unavailable' }); // Service unavailable

      try {
        const { data, error } = await supabase
          .from('prompts') // Your table name
          .select('*');

        if (error) throw error; // Let the catch block handle it

        res.json(data);
      } catch (error) {
        console.error('Supabase error fetching prompts:', error);
        res.status(500).json({ error: 'Failed to fetch prompts from database' });
      }
    });

    // Example using Google AI in a route
    app.post('/api/enhance-prompt', async (req, res) => {
        if (!genAI) return res.status(503).json({ error: 'AI service unavailable' });

        try {
            const { prompt } = req.body;
            if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

            const model = genAI.getGenerativeModel({ model: "gemini-pro" }); // Choose appropriate model
            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            res.json({ enhancedPrompt: text });

        } catch (error) {
            console.error('Error enhancing prompt:', error);
            res.status(500).json({ error: 'Failed to enhance prompt' });
        }
    });
    ```

## 8. Basic Error Handling

Robust error handling is essential. The examples above use basic `try...catch` blocks.

*   Wrap potentially failing code (like database calls, API interactions) in `try...catch`.
*   In the `catch` block:
    *   Log the error for debugging (`console.error`).
    *   Send an appropriate HTTP status code (e.g., `500` for Internal Server Error, `400` for Bad Request, `404` for Not Found).
    *   Send a JSON error message to the client.

For more complex applications, consider dedicated error handling middleware in Express.

## 9. Running the Server

*   **Development:** Use `nodemon` for automatic restarts on file changes.
    ```bash
    npm run dev
    ```
    *   **Handling CORS:** During development, your frontend (e.g., Vite on `http://localhost:5173`) runs on a different port than your backend (e.g., `http://localhost:3001`). Browsers block requests between different origins by default (CORS policy). Solutions:
        1.  **`cors` Middleware (Backend):** The `app.use(cors());` line in `server.js` tells the browser it's okay for requests to come from any origin. For more security, you can configure it to only allow specific origins: `app.use(cors({ origin: 'http://localhost:5173' }));`
        2.  **Proxy (Frontend Dev Server):** Configure your frontend development server (like Vite) to proxy API requests to your backend. This makes the browser think requests are coming from the same origin.
            ```typescript
            // Example: vite.config.ts
            import { defineConfig } from 'vite';
            import react from '@vitejs/plugin-react';

            export default defineConfig({
              plugins: [react()],
              server: {
                port: 5173, // Your frontend port
                proxy: {
                  // Requests to /api/* will be forwarded to target
                  '/api': {
                    target: 'http://localhost:3001', // Your backend server address
                    changeOrigin: true, // Recommended for virtual hosted sites
                    secure: false,      // Set to true if backend uses HTTPS with valid cert
                  }
                }
              }
            });
            ```

*   **Production:** Run the server directly using Node.
    ```bash
    npm start
    ```
    This script should set `NODE_ENV=production`.

## 10. Production Deployment Considerations

Deploying your backend involves running it on a hosting platform (like Vercel, Heroku, AWS, DigitalOcean).

*   **Serving Frontend:** In production, you often want your backend server to also serve your built frontend application (the static HTML, CSS, JS files generated by `npm run build` in your frontend project, typically found in a `dist` or `build` folder).
    ```javascript
    // server.js (add this section, usually before app.listen)
    import { fileURLToPath } from 'url';
    import { dirname, join } from 'path';

    // Get current directory path (needed for ES Modules)
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    // Serve static files in production environment
    if (process.env.NODE_ENV === 'production') {
      // Path to the frontend build directory (adjust if necessary)
      const frontendBuildPath = join(__dirname, 'dist'); // Assumes 'dist' is in the same dir as server.js
      // Or if frontend is in a separate folder: const frontendBuildPath = join(__dirname, '..', 'client', 'dist');

      // Serve static files (HTML, CSS, JS) from the build directory
      app.use(express.static(frontendBuildPath));

      // Handle all other GET requests by sending the main index.html file
      // This is crucial for Single Page Applications (SPAs) with client-side routing
      app.get('*', (req, res) => {
        // Exclude API routes from this catch-all
        if (!req.path.startsWith('/api/')) {
          res.sendFile(join(frontendBuildPath, 'index.html'));
        } else {
          // If it's an API route not handled above, let Express handle it (usually results in 404)
          // Or explicitly send 404: res.status(404).send('API route not found');
        }
      });
    }
    ```

*   **Hosting Model (Example: Vercel):** Platforms like Vercel often use a serverless model for Node.js backends.
    *   Your `server.js` is deployed as a serverless function.
    *   Your frontend build (`dist` folder) is deployed as static assets.
    *   A configuration file (like `vercel.json`) tells the platform how to build and route requests.

    ```json
    // Example: vercel.json
    {
        "version": 2,
        "builds": [
          {
            "src": "server.js", // Your main backend file
            "use": "@vercel/node" // Use the Node.js builder
          },
          {
            "src": "package.json", // Trigger static build based on frontend build script
            "use": "@vercel/static-build",
            "config": {
              // Assumes your frontend build command is in package.json
              // and outputs to 'dist' relative to project root
              "distDir": "dist"
            }
          }
        ],
        "routes": [
          {
            // Route all requests starting with /api/ to the serverless function
            "src": "/api/(.*)",
            "dest": "server.js"
          },
          {
            // Route all other requests to the static frontend assets
            "src": "/(.*)",
            "dest": "/$1" // Serve the file matching the path from the 'distDir'
            // Vercel automatically handles serving index.html for directories
            // and for client-side routing fallbacks if configured correctly.
          }
        ]
      }
    ```

*   **Environment Variables:** **DO NOT** deploy your `.env` file. Set environment variables directly in your hosting provider's dashboard or configuration settings. This is crucial for security.

*   **CORS:** Configure CORS on your backend to allow requests *only* from your production frontend domain.
    ```javascript
    // Example: Production CORS configuration
    const allowedOrigins = ['https://your-production-domain.com']; // Replace with your frontend URL
    app.use(cors({
      origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
          const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
          return callback(new Error(msg), false);
        }
        return callback(null, true);
      }
    }));
    ```

## 11. Adding New Functionality

To add a new feature (e.g., handling user profiles):

1.  **Define Routes:** Decide on the URL paths (e.g., `/api/users`, `/api/users/:id`) and HTTP methods (GET, POST, PUT, DELETE).
2.  **Add Route Handlers:** Add new `app.get(...)`, `app.post(...)`, etc., blocks in `server.js`.
3.  **Implement Logic:** Write the code inside the handlers to interact with databases or other services.
4.  **Add Environment Variables:** If the new feature requires new API keys or configuration, add them to `.env` (for local development) and your production environment settings.
5.  **Test:** Use tools like `curl`, Postman, or your frontend application to test the new endpoints thoroughly.

## 12. Further Improvements (Optional)

As your application grows, consider these improvements:

*   **Route Modularization:** Use `express.Router` to organize routes into separate files for better maintainability (e.g., `routes/prompts.js`, `routes/users.js`).
*   **Error Handling Middleware:** Implement centralized error handling middleware to avoid repeating `try...catch` blocks in every route.
*   **Data Validation:** Use libraries like `zod`, `joi`, or `express-validator` for robust validation of incoming request data.
*   **Database Migrations:** Use tools (like the one built into Supabase, or standalone tools like `knex`) to manage database schema changes systematically.
*   **Logging:** Implement more structured logging (e.g., using libraries like `winston` or `pino`) for better monitoring in production.
*   **Testing:** Write automated tests (unit, integration, end-to-end) to ensure your backend works correctly and prevent regressions.

This guide provides a foundation. Adapt and expand upon these principles as your backend needs evolve.
