# Full Documentation - Prompt Gallery

## 1. Project Overview

**Project Name:** Prompt Gallery

**Description:**

Prompt Gallery is a web application designed to help users manage and enhance prompts for Large Language Models (LLMs). It provides a user-friendly interface to store, organize, search, and utilize effective prompts for various LLM applications. Whether you are a prompt engineer, developer, or content creator, Prompt Gallery can streamline your workflow and improve the quality of your LLM interactions.

**Key Features:**

*   **Prompt Management:** Create, read, update, and delete prompts with titles, content, and categories.
*   **Categorization:** Organize prompts into categories for easy browsing and filtering.
*   **Search and Filtering:** Quickly find prompts using keywords in titles, content, or categories, and filter prompts by category.
*   **Prompt Enhancement:** Enhance and refine prompts using the integrated Gemini API to improve their effectiveness with LLMs.
*   **User-Friendly Interface:**  A responsive and intuitive React frontend for seamless prompt management.
*   **Backend API:**  An Express.js backend providing API endpoints for frontend interactions.
*   **Database:** Utilizes Supabase for persistent storage of prompts and categories.

**Target Audience:**

This application is designed for individuals and teams who work with Large Language Models and need a system to manage, optimize, and reuse prompts. This includes:

*   Prompt Engineers
*   AI Developers
*   Content Creators
*   Researchers
*   Anyone who uses LLMs and wants to improve their prompt crafting process.

---

## 2. Installation

### Local Development

**Prerequisites:**

*   **Node.js:**  Version >= 16.0.0. It is recommended to use the latest LTS version. You can download it from [nodejs.org](https://nodejs.org/).
*   **npm:**  Usually comes bundled with Node.js. You can check your version by running `npm -v` in your terminal.
*   **Git:**  Required for cloning the repository. You can download it from [git-scm.com](https://git-scm.com/).

**Step-by-step Installation:**

1.  **Clone the repository:**
    Open your terminal and navigate to the directory where you want to store the project. Then, clone the repository using Git:

    ```bash
    git clone [repository_url] # Replace [repository_url] with the actual repository URL
    cd Prompt-Gallery
    ```

2.  **Install dependencies:**
    Navigate into the cloned project directory in your terminal and install the required npm packages for both the server and client:

    ```bash
    npm install
    ```
    This command will install all dependencies listed in `package.json`.

3.  **Set up environment variables:**
    Create a `.env` file in the project's root directory. Add the following environment variables to the `.env` file. You will need to obtain API keys and Supabase credentials as described below:

    ```
    VITE_GEMINI_API_KEY=YOUR_GEMINI_API_KEY
    SUPABASE_URL=YOUR_SUPABASE_URL
    SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
    PORT=3001 # Optional: You can change the backend port if needed
    ```

    *   **Get Gemini API Key:**
        1.  Go to [makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey) and create a project to get your API key.
        2.  Copy the API key and paste it as the value for `VITE_GEMINI_API_KEY` in your `.env` file.

    *   **Get Supabase Credentials:**
        1.  Go to [supabase.com](https://supabase.com/) and create a new project.
        2.  Once your project is set up, go to **Project Settings** > **Database settings** > **Connection info**.
        3.  Copy the **URL** and **anon public key** and paste them as the values for `SUPABASE_URL` and `SUPABASE_ANON_KEY` respectively in your `.env` file.

4.  **Run development servers:**
    Start both the frontend (Vite) and backend (Express.js) development servers using the following command:

    ```bash
    npm run dev
    ```

    This will concurrently start:
    *   Frontend: Vite development server will run on [http://localhost:5173](http://localhost:5173).
    *   Backend: Express.js server will run on [http://localhost:3001](http://localhost:3001).

    Open your browser and navigate to [http://localhost:5173](http://localhost:5173) to access the Prompt Gallery application.

### Production Deployment (Vercel)

**Prerequisites:**

*   **Vercel Account:** You need a Vercel account. If you don't have one, you can sign up at [vercel.com](https://vercel.com/).
*   **GitHub Repository:** Your project code should be hosted on a GitHub repository.

**Deployment Steps:**

1.  **Push your code to GitHub:**
    Ensure your local project code is pushed to your GitHub repository.

2.  **Import project to Vercel:**
    1.  Go to [vercel.com](https://vercel.com/) and log in to your Vercel account.
    2.  Click on **Add New Project**.
    3.  Select your GitHub repository for the Prompt Gallery project.

3.  **Configure environment variables in Vercel:**
    1.  In the Vercel project settings, navigate to the **Environment Variables** section.
    2.  Add the following environment variables, using the same API keys and Supabase credentials you obtained for local development:
        *   `GEMINI_API_KEY`:  Your Gemini API key
        *   `SUPABASE_URL`: Your Supabase URL
        *   `SUPABASE_ANON_KEY`: Your Supabase anon public key
        *   `NODE_ENV`: Set this to `production`

4.  **Deploy:**
    Vercel will automatically detect the `vercel.json` configuration file and deploy your application.  The first deployment will start automatically after you configure the environment variables. Subsequent pushes to your GitHub repository will trigger automatic redeployments.

    Once the deployment is complete, Vercel will provide you with a live URL to access your Prompt Gallery application in production.

---

## 3. Usage

The Prompt Gallery application provides an intuitive user interface to manage and enhance your prompts. Here's a guide on how to use its main features:

### Main Interface

When you open the Prompt Gallery application in your browser, you will see the main interface, which is divided into the following sections:

1.  **Header:**
    *   **Project Title:** "Prompt Gallery" with a sparkle icon.
    *   **Add Prompt Button:**  Located on the top right, this button opens the "Add Prompt" modal to create a new prompt.

2.  **Prompt Enhancement Section:**
    *   **Enhance Your Prompt:**  This section allows you to enhance existing prompts using the Gemini API.
    *   **Original Prompt Textarea:**  Enter the prompt you want to enhance here.
        *   **Clear Button:**  Clears the content of the "Original Prompt" textarea.
        *   **Enhance Prompt Button:**  Submits the original prompt to the Gemini API for enhancement and displays the result in the "Enhanced Version" textarea.
    *   **Enhanced Version Textarea:** Displays the enhanced prompt generated by the Gemini API.
        *   **Clear Button:** Clears the content of the "Enhanced Version" textarea.
        *   **Copy Button:** Copies the enhanced prompt to your clipboard.
        *   **Save to Gallery Button:** Opens the "Add Prompt" modal with the enhanced prompt pre-filled in the content field, allowing you to save it as a new prompt in the gallery.

3.  **Prompt List and Filtering:**
    *   **Search Bar:**  Located below the header, this allows you to search prompts by title, content, or category.
    *   **Category Filter Dropdown:**  Allows you to filter prompts by category. Categories are dynamically populated from your existing prompts, with an "All Categories" option.
    *   **Prompt Cards:**  Displays a grid of prompt cards. Each card represents a saved prompt and shows:
        *   **Title:** The title of the prompt.
        *   **Content Snippet:** A brief preview of the prompt content.
        *   **Category Tag:**  The category the prompt belongs to.
        *   **View Button:** Opens the "View Prompt" modal to see the full prompt content.
        *   **Edit Button:** Opens the "Edit Prompt" modal to modify the prompt.
        *   **Delete Button:** Opens the "Delete Confirmation" modal to delete the prompt.

### Adding a New Prompt

1.  **Click the "Add Prompt" button** in the header. This will open the "Add Prompt" modal.
2.  **Fill in the form:**
    *   **Title:** Enter a descriptive title for your prompt.
    *   **Category:** Choose a category from the dropdown or type in a new category. Categories help organize your prompts.
    *   **Content:**  Enter the actual prompt text in the content textarea.
3.  **Click the "Add" button** in the modal.
    *   If the prompt is added successfully, a success toast notification will appear, and the prompt list will be updated.
    *   If there are any errors, an error toast notification will appear.

### Viewing a Prompt

1.  **Click the "View" button** on any prompt card in the prompt list. This will open the "View Prompt" modal.
2.  **View Prompt Details:** The modal will display the full content of the selected prompt, along with its title and category.
3.  **Click the "Close" button** or outside the modal to close it.

### Editing a Prompt

1.  **Click the "Edit" button** on the prompt card you want to edit. This will open the "Edit Prompt" modal, pre-filled with the prompt's current data.
2.  **Modify the form fields:**
    *   **Title:** Edit the prompt title if needed.
    *   **Category:** Change the category or type in a new one.
    *   **Content:** Modify the prompt content in the textarea.
3.  **Click the "Save Changes" button** in the modal.
    *   If the prompt is updated successfully, a success toast notification will appear, and the prompt list will be updated.
    *   If there are any errors, an error toast notification will appear.

### Deleting a Prompt

1.  **Click the "Delete" button** on the prompt card you want to delete. This will open the "Delete Confirmation" modal.
2.  **Confirm Deletion:**  Review the prompt title in the modal to ensure you are deleting the correct prompt.
3.  **Click the "Confirm Delete" button** to proceed with deletion.
    *   If the prompt is deleted successfully, a success toast notification will appear, and the prompt list will be updated.
    *   If you decide not to delete, click the "Cancel" button or outside the modal to close it.

### Enhancing a Prompt

1.  **In the "Enhance Your Prompt" section**, enter the prompt you want to enhance in the "Original Prompt" textarea.
2.  **Click the "Enhance Prompt" button.**
    *   The application will send your prompt to the backend, which uses the Gemini API to enhance it.
    *   While enhancing, an "Enhancing..." animation will be displayed on the button.
    *   Once the enhanced prompt is received, it will be displayed in the "Enhanced Version" textarea.
    *   If there are errors during the enhancement process, an error toast notification will appear.
3.  **Use the Enhanced Prompt:**
    *   **Copy:** Click the "Copy" button to copy the enhanced prompt to your clipboard for immediate use.
    *   **Save to Gallery:** Click the "Save to Gallery" button to save the enhanced prompt as a new prompt in your Prompt Gallery. This will open the "Add Prompt" modal with the "Content" field pre-filled with the enhanced prompt. You can then add a title and category and save it like any other new prompt.

### Searching and Filtering Prompts

1.  **Search:** Type keywords in the "Search prompts..." input field. The prompt list will dynamically update to show prompts that match your search terms in their title, content, or category.
2.  **Filter by Category:** Use the category dropdown to select a specific category. The prompt list will update to show only prompts belonging to the selected category. Select "All Categories" to remove the category filter.
3.  **Combine Search and Filter:** You can use both search and category filters simultaneously to narrow down your prompt list to find exactly what you need.

---

## 4. API Reference

This section provides a detailed reference for both the backend API endpoints and the frontend API functions used in the Prompt Gallery application.

### Backend API Endpoints (Express.js)

The backend API is built using Express.js and provides RESTful endpoints for managing prompts and enhancing prompts.

#### 1.  `POST /api/enhance-prompt`

*   **Description:** Enhances a user-provided prompt using the Gemini API.
*   **Request Body:**
    ```json
    {
      "prompt": "string" // The prompt text to be enhanced
    }
    ```
    *   `prompt`:  The prompt text you want to enhance. (Data type: `string`, Required: Yes)
*   **Response Body (Success - HTTP 200 OK):**
    ```json
    {
      "enhancedPrompt": "string" // The enhanced prompt text
    }
    ```
    *   `enhancedPrompt`: The enhanced version of the input prompt, generated by the Gemini API. (Data type: `string`)
*   **Response Body (Error - HTTP 400 Bad Request):**
    ```json
    {
      "error": "string" // Error message
    }
    ```
    *   `error`:  Indicates a client-side error, such as a missing prompt in the request body. (Data type: `string`)
*   **Response Body (Error - HTTP 500 Internal Server Error):**
    ```json
    {
      "error": "string" // Error message
    }
    ```
    *   `error`:  Indicates a server-side error, such as failure to connect to the Gemini API or an error during prompt processing. (Data type: `string`)

#### 2.  `GET /api/prompts`

*   **Description:** Retrieves a list of all prompts from the database, ordered by creation date in descending order (newest first).
*   **Request Parameters:** None
*   **Response Body (Success - HTTP 200 OK):**
    ```json
    [
      {
        "id": "string",
        "title": "string",
        "content": "string",
        "category": "string",
        "created_at": "string" // ISO 8601 timestamp
      },
      ...
    ]
    ```
    *   Array of `Prompt` objects. Each object contains:
        *   `id`:  Unique identifier for the prompt. (Data type: `string`)
        *   `title`:  Title of the prompt. (Data type: `string`)
        *   `content`:  The prompt text. (Data type: `string`)
        *   `category`:  Category of the prompt. (Data type: `string`)
        *   `created_at`:  Timestamp of when the prompt was created. (Data type: `string`, ISO 8601 format)
*   **Response Body (Error - HTTP 500 Internal Server Error):**
    ```json
    {
      "error": "string" // Error message
    }
    ```
    *   `error`:  Indicates a server-side error, such as a database connection error or query failure. (Data type: `string`)

#### 3.  `GET /api/categories`

*   **Description:** Retrieves a list of unique prompt categories from the database.
*   **Request Parameters:** None
*   **Response Body (Success - HTTP 200 OK):**
    ```json
    [
      "Category 1",
      "Category 2",
      ...
    ]
    ```
    *   Array of unique category names. (Data type: `string[]`)
*   **Response Body (Error - HTTP 500 Internal Server Error):**
    ```json
    {
      "error": "string" // Error message
    }
    ```
    *   `error`:  Indicates a server-side error, such as a database connection error or query failure. (Data type: `string`)

#### 4.  `POST /api/prompts`

*   **Description:** Creates a new prompt in the database.
*   **Request Body:**
    ```json
    {
      "title": "string",
      "content": "string",
      "category": "string"
    }
    ```
    *   `title`:  Title of the prompt. (Data type: `string`, Required: Yes)
    *   `content`:  The prompt text. (Data type: `string`, Required: Yes)
    *   `category`:  Category of the prompt. (Data type: `string`, Required: Yes)
*   **Response Body (Success - HTTP 201 Created):**
    ```json
    {
      "message": "Prompt added successfully"
    }
    ```
    *   `message`:  Confirmation message indicating successful prompt creation. (Data type: `string`)
*   **Response Body (Error - HTTP 400 Bad Request):**
    ```json
    {
      "error": "string" // Error message
    }
    ```
    *   `error`:  Indicates a client-side error, such as missing required fields in the request body. (Data type: `string`)
*   **Response Body (Error - HTTP 500 Internal Server Error):**
    ```json
    {
      "error": "string" // Error message
    }
    ```
    *   `error`:  Indicates a server-side error, such as a database connection error or insertion failure. (Data type: `string`)

#### 5.  `PUT /api/prompts/:id`

*   **Description:** Updates an existing prompt in the database.
*   **Path Parameters:**
    *   `id`:  The ID of the prompt to be updated. (Data type: `string`, Required: Yes)
*   **Request Body:**
    ```json
    {
      "title": "string",
      "content": "string",
      "category": "string"
    }
    ```
    *   `title`:  Updated title of the prompt. (Data type: `string`, Required: Yes)
    *   `content`:  Updated prompt text. (Data type: `string`, Required: Yes)
    *   `category`:  Updated category of the prompt. (Data type: `string`, Required: Yes)
*   **Response Body (Success - HTTP 200 OK):**
    ```json
    {
      "message": "Prompt updated successfully"
    }
    ```
    *   `message`:  Confirmation message indicating successful prompt update. (Data type: `string`)
*   **Response Body (Error - HTTP 400 Bad Request):**
    ```json
    {
      "error": "string" // Error message
    }
    ```
    *   `error`:  Indicates a client-side error, such as missing required fields in the request body. (Data type: `string`)
*   **Response Body (Error - HTTP 500 Internal Server Error):**
    ```json
    {
      "error": "string" // Error message
    }
    ```
    *   `error`:  Indicates a server-side error, such as a database connection error or update failure. (Data type: `string`)

#### 6.  `DELETE /api/prompts/:id`

*   **Description:** Deletes a prompt from the database.
*   **Path Parameters:**
    *   `id`:  The ID of the prompt to be deleted. (Data type: `string`, Required: Yes)
*   **Request Body:** None
*   **Response Body (Success - HTTP 200 OK):**
    ```json
    {
      "message": "Prompt deleted successfully"
    }
    ```
    *   `message`:  Confirmation message indicating successful prompt deletion. (Data type: `string`)
*   **Response Body (Error - HTTP 500 Internal Server Error):**
    ```json
    {
      "error": "string" // Error message
    }
    ```
    *   `error`:  Indicates a server-side error, such as a database connection error or deletion failure. (Data type: `string`)

---

### Frontend API Functions (`src/lib/api.ts`)

These are the frontend API functions that interact with the backend API endpoints.

#### 1.  `fetchPrompts()`

*   **Description:** Fetches all prompts from the backend API.
*   **Signature:** `async function fetchPrompts(): Promise<Prompt[]>`
*   **Parameters:** None
*   **Return Value:**
    *   Type: `Promise<Prompt[]>`
    *   Description: A Promise that resolves to an array of `Prompt` objects if the request is successful. Each `Prompt` object has the following structure:
        ```typescript
        interface Prompt {
            id: string;
            title: string;
            content: string;
            category: string;
            created_at: string;
        }
        ```
*   **Exceptions:**
    *   Throws an `Error` if the API request fails (e.g., network error, server error). The error message will describe the failure.

#### 2.  `fetchCategories()`

*   **Description:** Fetches all unique prompt categories from the backend API.
*   **Signature:** `async function fetchCategories(): Promise<string[]>`
*   **Parameters:** None
*   **Return Value:**
    *   Type: `Promise<string[]>`
    *   Description: A Promise that resolves to an array of strings, where each string is a unique prompt category.
*   **Exceptions:**
    *   Throws an `Error` if the API request fails. The error message will describe the failure.

#### 3.  `addPrompt(promptData)`

*   **Description:** Sends a request to the backend API to add a new prompt.
*   **Signature:** `async function addPrompt(promptData: { title: string; content: string; category: string }): Promise<void>`
*   **Parameters:**
    *   `promptData`: An object containing the data for the new prompt.
        *   `title`:  Title of the prompt. (Data type: `string`, Required: Yes)
        *   `content`:  The prompt text. (Data type: `string`, Required: Yes)
        *   `category`:  Category of the prompt. (Data type: `string`, Required: Yes)
*   **Return Value:**
    *   Type: `Promise<void>`
    *   Description: A Promise that resolves when the prompt is successfully added to the backend.
*   **Exceptions:**
    *   Throws an `Error` if the API request fails. The error message will describe the failure.

#### 4.  `updatePrompt(id, promptData)`

*   **Description:** Sends a request to the backend API to update an existing prompt.
*   **Signature:** `async function updatePrompt(id: string, promptData: { title: string; content: string; category: string }): Promise<void>`
*   **Parameters:**
    *   `id`:  The ID of the prompt to be updated. (Data type: `string`, Required: Yes)
    *   `promptData`: An object containing the updated data for the prompt.
        *   `title`:  Updated title of the prompt. (Data type: `string`, Required: Yes)
        *   `content`:  Updated prompt text. (Data type: `string`, Required: Yes)
        *   `category`:  Updated category of the prompt. (Data type: `string`, Required: Yes)
*   **Return Value:**
    *   Type: `Promise<void>`
    *   Description: A Promise that resolves when the prompt is successfully updated in the backend.
*   **Exceptions:**
    *   Throws an `Error` if the API request fails. The error message will describe the failure.

#### 5.  `deletePrompt(id)`

*   **Description:** Sends a request to the backend API to delete a prompt.
*   **Signature:** `async function deletePrompt(id: string): Promise<void>`
*   **Parameters:**
    *   `id`:  The ID of the prompt to be deleted. (Data type: `string`, Required: Yes)
*   **Return Value:**
    *   Type: `Promise<void>`
    *   Description: A Promise that resolves when the prompt is successfully deleted from the backend.
*   **Exceptions:**
    *   Throws an `Error` if the API request fails. The error message will describe the failure.

#### 6.  `enhancePrompt(prompt)`

*   **Description:** Sends a request to the backend API to enhance a given prompt using the Gemini API.
*   **Signature:** `async function enhancePrompt(prompt: string): Promise<string>`
*   **Parameters:**
    *   `prompt`:  The prompt text to be enhanced. (Data type: `string`, Required: Yes)
*   **Return Value:**
    *   Type: `Promise<string>`
    *   Description: A Promise that resolves to a string containing the enhanced prompt text, as returned by the backend API.
*   **Exceptions:**
    *   Throws an `Error` if the API request fails. The error message will describe the failure.

---

## 5. Contributing

We welcome contributions to the Prompt Gallery project! If you're interested in contributing, please follow these guidelines:

### Coding Style

*   **ESLint:** This project uses ESLint for linting. Ensure your code passes ESLint checks before submitting pull requests. You can run linting locally using the command: `npm run lint`.
*   **Code Formatting:**  Follow standard code formatting conventions for JavaScript/TypeScript and React. Consistent code style helps maintain readability and makes collaboration easier.

### Branching Strategy

*   **Fork and Branch:** Fork the repository to your own GitHub account and create a new branch for your feature or bug fix. Use descriptive branch names, e.g., `feature/add-category-filter` or `bugfix/typo-in-installation-docs`.
*   **Main Branch:**  The `main` branch represents the stable, production-ready codebase. Do not directly commit to the `main` branch.
*   **Development Branch (Optional):** For larger features, you may consider using a `develop` branch to integrate changes before merging into `main`. However, for smaller contributions, feature branches directly merged into `main` are sufficient.

### Pull Request Process

1.  **Create a branch:** Create a new branch from the `main` branch for your changes.
2.  **Implement your changes:**  Develop your feature or bug fix in your branch, adhering to the coding style and best practices.
3.  **Test your changes:**  Thoroughly test your changes to ensure they work as expected and do not introduce regressions.
4.  **Lint your code:** Run `npm run lint` to ensure your code passes ESLint checks.
5.  **Commit your changes:** Commit your changes with clear and concise commit messages.
6.  **Push your branch:** Push your branch to your forked repository on GitHub.
7.  **Submit a Pull Request (PR):**
    *   Go to the original Prompt Gallery repository on GitHub.
    *   Click on "Compare & pull request".
    *   Ensure your branch is being merged into the `main` branch.
    *   Provide a clear and descriptive title for your PR.
    *   In the PR description, explain the changes you've made, the problem you're solving (if applicable), and any relevant context or screenshots.
8.  **Code Review:**  Your PR will be reviewed by project maintainers. Be prepared to address feedback and make revisions as needed.
9.  **Merge:** Once your PR is approved, it will be merged into the `main` branch.

### Reporting Bugs and Suggesting Features

*   **Bug Reports:** If you find a bug, please submit a detailed bug report as a GitHub issue. Include steps to reproduce the bug, expected behavior, actual behavior, and any relevant error messages or screenshots.
*   **Feature Requests:** If you have a suggestion for a new feature or enhancement, please submit a feature request as a GitHub issue. Describe the feature in detail, explain its benefits, and provide any relevant use cases or examples.

By following these guidelines, you can help contribute to the Prompt Gallery project and make it even better!
