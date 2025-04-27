# Image Identifier

This is a web application built with [Next.js](https://nextjs.org/) and [TypeScript](https://www.typescriptlang.org/) that allows users to upload an image and have an AI model identify objects, people, and scenes within it.

## Features

*   **Image Upload:** Users can select an image file (PNG, JPG, GIF) from their device or drag and drop it onto the upload area.
*   **AI Analysis:** Utilizes [Google AI models via Genkit](https://firebase.google.com/docs/genkit) to analyze the uploaded image.
*   **Result Display:** Shows the identified objects, people, and scenes found in the image.
*   **Modern UI:** Built with [Shadcn UI](https://ui.shadcn.com/) components (which utilize [Radix UI](https://www.radix-ui.com/) primitives) and styled using [Tailwind CSS](https://tailwindcss.com/).

## Tech Stack

*   **Framework:** Next.js 15
*   **Language:** TypeScript
*   **AI Integration:** Genkit, @genkit-ai/googleai
*   **UI Components:** Shadcn UI (built on Radix UI primitives)
*   **Styling:** Tailwind CSS
*   **Fonts:** Geist Sans, Geist Mono

## Getting Started

### Prerequisites

*   Node.js (v20 recommended)
*   pnpm (or npm/yarn)

### Installation

1.  Clone the repository:
    ```bash
    git clone <your-repository-url>
    cd <repository-directory>
    ```
2.  Install dependencies:
    ```bash
    pnpm install
    ```

### Running the Development Server

1.  **Set up Environment Variables:**
    Ensure you have the `GOOGLE_GENAI_API_KEY` environment variable set with your Google AI API key. You can typically do this by creating a `.env.local` file in the project root:
    ```
    GOOGLE_GENAI_API_KEY=your_api_key_here
    ```
    Refer to the [Genkit documentation](https://firebase.google.com/docs/genkit/get-started) for more details on authentication.

2.  **Start the Next.js development server:**
    This command starts the main web application.
    ```bash
    pnpm run dev
    ```

3.  Open [http://localhost:9002](http://localhost:9002) (or the port specified in your `package.json`) with your browser to see the result.

## Project Structure

```
.
├── .next/         # Next.js build output
├── node_modules/  # Project dependencies
├── public/        # Static assets
├── src/
│   ├── ai/        # Genkit AI flows and configurations
│   ├── app/       # Next.js App Router pages and layouts
│   ├── components/  # Reusable UI components (including Shadcn UI)
│   ├── hooks/     # Custom React hooks
│   ├── lib/       # Utility functions
│   └── ...
├── .gitignore
├── components.json # Shadcn UI configuration
├── next.config.ts  # Next.js configuration
├── package.json    # Project metadata and dependencies
├── postcss.config.mjs # PostCSS configuration
├── README.md       # This file
├── tailwind.config.ts # Tailwind CSS configuration
└── tsconfig.json   # TypeScript configuration
```