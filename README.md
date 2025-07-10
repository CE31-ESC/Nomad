
# Building Nomad Navigator: A Step-by-Step Guide

Welcome! This guide is designed to walk you through the process of building a travel accommodation booking application like **Nomad Navigator** from scratch. We'll cover project setup, core technology integration, feature implementation, and best practices using Next.js, React, ShadCN UI, Tailwind CSS, and Genkit for AI features.

This README will help you understand how to structure and develop such an application, whether you're starting fresh or using this project as a template.

## Core Technologies You'll Use

*   **Next.js (App Router)**: The backbone of our application, providing a React framework with server-side rendering, static site generation, and a powerful App Router for file-system based routing.
*   **React**: The JavaScript library for building dynamic and interactive user interfaces.
*   **TypeScript**: For adding static types to JavaScript, enhancing code quality, and improving developer experience.
*   **Tailwind CSS**: A utility-first CSS framework for rapidly styling your application.
*   **ShadCN UI**: A collection of beautifully designed, accessible, and customizable UI components built with Radix UI and Tailwind CSS.
*   **Genkit (with Google Gemini)**: A toolkit for building AI-powered features, enabling functionalities like intelligent search, recommendations, or content generation.
*   **Zod**: A TypeScript-first schema declaration and validation library, perfect for validating form inputs and API responses.
*   **React Hook Form**: For efficient and flexible form management in React.
*   **Lucide React**: A library providing a comprehensive set of clean and consistent icons.
*   **Date-fns**: A modern JavaScript date utility library for handling dates and times.

## Phase 1: Project Setup & Basic Structure

Let's start by setting up a new Next.js project and establishing the foundational structure.

### 1. Initialize Your Next.js Project
Open your terminal and run the following command to create a new Next.js application. We'll name it `nomad-navigator` (or your preferred project name):

```bash
npx create-next-app@latest nomad-navigator --typescript --tailwind --eslint
```
*   `--typescript`: Initializes the project with TypeScript.
*   `--tailwind`: Sets up Tailwind CSS.
*   `--eslint`: Includes ESLint for code linting.

Navigate into your newly created project directory:
```bash
cd nomad-navigator
```

### 2. Review Initial Configuration
*   **`tsconfig.json`**: Contains TypeScript compiler options. Ensure `strict` mode is enabled for better type safety.
*   **`.eslintrc.json`**: Configures ESLint for code quality.
*   **`next.config.ts`**: Next.js configuration file. You'll modify this later for things like image optimization domains.
*   **`tailwind.config.ts`**: Tailwind CSS configuration.

### 3. Understanding the `app/` Directory (App Router)
Next.js uses the App Router by default. Key files:
*   **`src/app/layout.tsx`**: This is the root layout for your entire application. It must include `<html>` and `<body>` tags.
*   **`src/app/page.tsx`**: This is the main homepage of your application.

Let's ensure `src/` directory usage from the start for better organization. If `create-next-app` didn't place `app` inside `src`, you can move it:
```bash
# If app is not in src, create src and move app into it
mkdir src
mv app public globals.css src/ # Move app, public, and globals.css into src
# Adjust paths in next.config.ts, tailwind.config.ts, and tsconfig.json if you move public or globals.css
```
For this project, we assume `app` and `globals.css` are within `src/`. Update your `tailwind.config.ts` content path and `globals.css` path if you move `globals.css` to `src/app/globals.css`.

### 4. Basic Root Layout and Homepage
Update `src/app/layout.tsx`:
```tsx
// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css'; // Assuming globals.css is in src/app

export const metadata: Metadata = {
  title: 'Nomad Navigator',
  description: 'Your travel booking app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```
Update `src/app/page.tsx`:
```tsx
// src/app/page.tsx
export default function HomePage() {
  return (
    <main>
      <h1>Welcome to Nomad Navigator</h1>
    </main>
  );
}
```

### 5. Tailwind CSS Setup
Ensure `src/app/globals.css` (or `src/globals.css` if you placed it there) has the Tailwind directives:
```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Basic body styling (optional, can be extended later) */
body {
  @apply bg-background text-foreground;
  font-family: 'Inter', sans-serif; /* Example font */
}
```
Ensure `tailwind.config.ts` points to your source files:
```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}', // If you use pages router
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // You'll define custom theme colors here later
    },
  },
  plugins: [require('tailwindcss-animate')], // For ShadCN animations
};
export default config;
```

## Phase 2: Integrating ShadCN UI

ShadCN UI provides excellent, unstyled components that you can customize.

### 1. Initialize ShadCN UI
Run the ShadCN UI initialization command in your project root:
```bash
npx shadcn-ui@latest init
```
You'll be prompted with a few questions:
*   **Which style would you like to use?**: `Default`
*   **Which color would you like to use as base color?**: `Neutral` (or choose another)
*   **Where is your `global.css`?**: `src/app/globals.css` (adjust if you placed it elsewhere)
*   **Do you want to use CSS variables for colors?**: `Yes`
*   **Where is your tailwind.config.js (or .ts)?**: `tailwind.config.ts`
*   **Configure import alias for components**: `@/components`
*   **Configure import alias for utils**: `@/lib/utils`
*   **Are you using React Server Components?**: `Yes`

This creates:
*   `components.json`: Configuration for ShadCN UI.
*   `src/lib/utils.ts`: With a `cn` utility function for merging Tailwind classes.
*   `src/components/ui/`: This directory will house the components you add.
*   Updates `globals.css` with CSS variables for the theme.
*   Updates `tailwind.config.ts` for ShadCN's animation plugin.

### 2. Adding Core UI Components
Add components as you need them. For a start:
```bash
npx shadcn-ui@latest add button card input label popover calendar select separator toast sheet avatar tabs dialog alert-dialog
```
These components will be added to `src/components/ui/`.

### 3. Defining Your Theme in `globals.css`
ShadCN `init` adds base color variables. You should expand this to define your application's color palette using HSL CSS variables. Open `src/app/globals.css` and customize the `:root` and `.dark` sections. Refer to the `globals.css` in this project for a complete example, focusing on:
*   `--background`, `--foreground`
*   `--card`, `--card-foreground`
*   `--primary`, `--primary-foreground`
*   `--secondary`, `--secondary-foreground`
*   `--muted`, `--muted-foreground`
*   `--accent`, `--accent-foreground`
*   `--destructive`, `--destructive-foreground`
*   `--border`, `--input`, `--ring`

## Phase 3: Building Core Application Structure & Shared Components

A well-organized project structure is crucial.

### 1. Finalizing Directory Organization
Your `src/` directory will evolve to look like this:
*   **`src/app/`**: For Next.js App Router files (layouts, pages, route groups).
    *   `(main)/`: Example route group for pages sharing a common layout (e.g., main app section).
    *   `booking/`, `hotels/`, `login/`, `profile/`, `signup/`: Feature-specific routes.
    *   `layout.tsx`: Root layout.
    *   `page.tsx`: Homepage.
    *   `globals.css`: Global styles and theme variables.
*   **`src/components/`**: Reusable React components.
    *   **`shared/`**: Components used across multiple parts of the app (e.g., `Header.tsx`, `Footer.tsx`, `PageContainer.tsx`, `Logo.tsx`, `AppProviders.tsx`).
    *   **`features/`**: Components specific to application features (e.g., `destination-search/`, `hotel-search/`).
    *   **`ui/`**: ShadCN UI components (automatically generated here).
*   **`src/lib/`**: Utility functions, constants, and type definitions.
    *   `utils.ts`: General utility functions (like `cn`).
    *   `constants.ts`: Application-wide constants (mock data, configuration values).
*   **`src/hooks/`**: Custom React hooks.
    *   `useToast.ts`: For using the ShadCN toaster.
    *   `useMobile.ts`: For detecting mobile viewports.
*   **`src/types/`**: TypeScript type definitions and interfaces.
    *   `index.ts`: Main file exporting all types.
*   **`src/ai/`**: Files related to AI functionality using Genkit.
    *   `flows/`: Contains Genkit flow definitions.
    *   `genkit.ts`: Global Genkit instance configuration.
    *   `dev.ts`: Entry point for Genkit development server.
*   **`public/`**: Static assets (images, fonts).

### 2. Enhancing Root Layout (`src/app/layout.tsx`)
Integrate fonts, `Toaster` for notifications, and `AppProviders` for global context.
```tsx
// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster"; // From ShadCN
import AppProviders from '@/components/shared/AppProviders'; // You'll create this

export const metadata: Metadata = {
  title: 'Nomad Navigator',
  description: 'Your ultimate travel booking companion.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning> {/* suppressHydrationWarning can be useful */}
      <head>
        {/* Example: Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning> {/* Add your font class */}
        <AppProviders> {/* For global context like Google Maps */}
          {children}
          <Toaster />
        </AppProviders>
      </body>
    </html>
  );
}
```

### 3. Creating `AppProviders`
This component is for wrapping your application with global context providers. For example, if you use Google Maps.
Create `src/components/shared/AppProviders.tsx`:
```tsx
// src/components/shared/AppProviders.tsx
"use client";

import type { ReactNode } from 'react';
// Example: import { APIProvider } from '@vis.gl/react-google-maps';

interface AppProvidersProps {
  children: ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  // const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // return googleMapsApiKey ? (
  //   <APIProvider apiKey={googleMapsApiKey}>
  //     {children}
  //   </APIProvider>
  // ) : (
  //   <>{children}</> // Render children directly if key is missing
  // );
  return <>{children}</>; // Start simple
}
```

### 4. Building Header, Footer, Logo, and PageContainer
*   **`src/components/shared/Logo.tsx`**: A simple component for your app's logo and name, linking to home.
*   **`src/components/shared/Header.tsx`**: Contains the logo, navigation links. Implement mock authentication later to show/hide links like "Profile" or "Login/Signup".
*   **`src/components/shared/Footer.tsx`**: Basic footer content.
*   **`src/components/shared/PageContainer.tsx`**: A wrapper to provide consistent padding and max-width for page content.

Refer to the existing project files for detailed implementations of these.

## Phase 4: Implementing Key Features (Iterative Process)

This is where you'll build out the core functionality. Start with mock data and gradually replace it with API calls or Genkit flows.

### 1. Homepage (`src/app/page.tsx`)
*   Use `PageContainer`.
*   Add a hero section with a title, tagline.
*   Integrate the `DestinationSearchForm`.

### 2. Destination Search Feature
*   Create `src/components/features/destination-search/DestinationSearchForm.tsx`.
    *   **Inputs**: Destination (text input with autocomplete), Dates (Calendar popover), Guests & Rooms (custom selector popover).
    *   **State Management**: Use `react-hook-form` with `zod` for validation.
    *   **Data**: Use mock destination data from `src/lib/constants.ts` for autocomplete.
    *   **Navigation**: On submit, navigate to the hotel search results page (`/hotels/search`) with query parameters.
*   Create `src/components/features/destination-search/GuestRoomSelector.tsx`.

### 3. Hotel Search Results (`src/app/hotels/search/page.tsx`)
*   Read query parameters from the URL.
*   **Fetch Data**: Initially, filter `MOCK_HOTELS` from `src/lib/constants.ts`.
*   **Display**: Create `HotelCard` components to show hotel information.
*   **Filtering**:
    *   Create `src/components/features/hotel-search/HotelFilters.tsx`.
    *   Filter by star rating, price range, guest rating. Use ShadCN `Checkbox`, `Slider`, `Accordion`.
*   **Sorting**: Allow sorting by price, rating, etc. (ShadCN `Select`).
*   **Map View**:
    *   Create `src/components/features/hotel-search/MapView.tsx`.
    *   Integrate `@vis.gl/react-google-maps` (requires `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` in `.env.local`).
    *   Display hotel markers.
*   **Pagination**: Implement simple client-side pagination.

### 4. Hotel Details Page (`src/app/hotels/[hotelId]/page.tsx`)
*   This is a dynamic route. Get `hotelId` from params.
*   **Fetch Data**: Get specific hotel details, rooms, and reviews (from mock data).
*   **Layout**:
    *   Image gallery for hotel images.
    *   Tabs (ShadCN `Tabs`) for "Overview", "Amenities", "Reviews", "Location".
    *   Display `RoomCard` components for available rooms.
*   Create `RoomCard` component within this file or as a separate feature component.

### 5. Booking Process
*   **Booking Page (`src/app/booking/page.tsx`)**:
    *   A multi-step form (e.g., Guest Details, Review, Payment).
    *   Use query params to pre-fill selected hotel/room details.
    *   Use `react-hook-form` and `zod` for comprehensive validation.
*   **Server Action (`src/app/booking/actions.ts`)**:
    *   Handle form submission on the server.
    *   `'use server';` directive.
    *   Validate data again.
    *   Simulate payment processing and booking creation.
    *   Redirect to a confirmation page.
*   **Confirmation Page (`src/app/booking/confirmation/page.tsx`)**:
    *   Display booking success message and key details.

### 6. User Authentication (Mocked Initially)
*   **Pages**: Create `src/app/login/page.tsx` and `src/app/signup/page.tsx`.
*   **Forms**: Simple forms using ShadCN components, `react-hook-form`, and `zod`.
*   **Mock Logic**: Simulate login/signup success. For demo purposes, you can use `localStorage` to store a mock auth state (clearly note this is not for production).
*   **Profile Page (`src/app/profile/page.tsx`)**:
    *   Protect this route (redirect to login if not authenticated).
    *   Display mock user information and a list of mock bookings.

### 7. Defining TypeScript Types (`src/types/index.ts`)
Create interfaces for all major data structures: `Destination`, `Hotel`, `Room`, `User`, `BookingData`, `HotelReview`, `SearchParams`, etc. This ensures type safety throughout your application.

### 8. Utilities and Constants
*   **`src/lib/utils.ts`**: The `cn` function is already provided by ShadCN. You can add other general utilities here.
*   **`src/lib/constants.ts`**: Store mock data (destinations, hotels, rooms, reviews) and UI-related constants (max guests, price ranges).

## Phase 5: Integrating AI with Genkit

Now, let's add AI capabilities.

### 1. Setup Genkit
*   **Install Packages**:
    ```bash
    npm install genkit @genkit-ai/googleai @genkit-ai/next genkit-cli typescript tsx --save-dev # tsx if not already dev dep
    ```
*   **Configure Genkit Instance (`src/ai/genkit.ts`)**:
    ```ts
    // src/ai/genkit.ts
    import { genkit } from 'genkit';
    import { googleAI } from '@genkit-ai/googleai'; // Or your chosen provider

    export const ai = genkit({
      plugins: [googleAI()], // Configure with your API key via environment variables
      model: 'googleai/gemini-2.0-flash', // Default model
    });
    ```
    Ensure your Google AI API key is set in your environment (e.g., in a `.env.local` file, `GOOGLE_API_KEY=YOUR_API_KEY`).
*   **Genkit Dev Entry Point (`src/ai/dev.ts`)**:
    ```ts
    // src/ai/dev.ts
    // Import your flows here to make them discoverable by the Genkit dev server
    // e.g., import './flows/diagnose-plant-flow';
    ```
*   **Add Genkit Scripts to `package.json`**:
    ```json
    {
      "scripts": {
        "dev": "next dev --turbopack -p 9002", // Your Next.js dev script
        "genkit:dev": "genkit start -- tsx src/ai/dev.ts",
        "genkit:watch": "genkit start -- tsx --watch src/ai/dev.ts",
        "build": "next build",
        "start": "next start",
        "lint": "next lint"
      }
    }
    ```

### 2. Creating Your First Genkit Flow
Let's imagine a simple flow, for example, to generate a hotel description.
Create `src/ai/flows/hotel-description-flow.ts`:
```ts
// src/ai/flows/hotel-description-flow.ts
'use server';
/**
 * @fileOverview Generates a creative hotel description.
 */

import { ai } from '@/ai/genkit'; // Your global Genkit instance
import { z } from 'genkit/zod'; // Use genkit/zod for schema definition

// Define input schema
const HotelDescriptionInputSchema = z.object({
  hotelName: z.string().describe('The name of the hotel.'),
  location: z.string().describe('The location of the hotel (e.g., city, district).'),
  keyFeatures: z.array(z.string()).describe('A list of 2-3 key features of the hotel.'),
});
export type HotelDescriptionInput = z.infer<typeof HotelDescriptionInputSchema>;

// Define output schema
const HotelDescriptionOutputSchema = z.object({
  description: z.string().describe('A compelling, short description for the hotel.'),
});
export type HotelDescriptionOutput = z.infer<typeof HotelDescriptionOutputSchema>;

// Define the prompt
const descriptionPrompt = ai.definePrompt({
  name: 'hotelDescriptionPrompt',
  input: { schema: HotelDescriptionInputSchema },
  output: { schema: HotelDescriptionOutputSchema },
  prompt: `Generate a captivating and concise description (1-2 sentences) for a hotel named "{{hotelName}}" located in {{location}}. Highlight these features: {{#each keyFeatures}}- {{this}} {{/each}}. Make it sound appealing to travelers.`,
});

// Define the flow
const generateHotelDescriptionFlow = ai.defineFlow(
  {
    name: 'generateHotelDescriptionFlow',
    inputSchema: HotelDescriptionInputSchema,
    outputSchema: HotelDescriptionOutputSchema,
  },
  async (input) => {
    const { output } = await descriptionPrompt(input);
    return output!; // Non-null assertion if you expect output
  }
);

// Export a wrapper function to call the flow
export async function getHotelDescription(input: HotelDescriptionInput): Promise<HotelDescriptionOutput> {
  return generateHotelDescriptionFlow(input);
}
```
Remember to import this flow in `src/ai/dev.ts`:
```ts
// src/ai/dev.ts
import './flows/hotel-description-flow';
```

### 3. Using the Flow in Your Application
You can call `getHotelDescription` from a Server Component, Server Action, or an API route.

## Running Your Application

### Prerequisites
*   Node.js (version 18 or later recommended)
*   npm (or yarn/pnpm)

### Development Mode
1.  **Install Dependencies**:
    ```bash
    npm install
    ```
2.  **Run the Next.js Development Server**:
    This starts your main application (frontend and Next.js backend).
    ```bash
    npm run dev
    ```
    Typically, this will start the app on `http://localhost:9002` (or your configured port).

3.  **Run the Genkit Development Server** (for AI features):
    If you're working on or testing AI features, run the Genkit dev server in a *separate terminal*:
    ```bash
    npm run genkit:watch
    ```
    The Genkit server usually starts on `http://localhost:4000`, where you can inspect flows and traces.

### Environment Variables
Create a `.env.local` file in your project root for API keys and other sensitive information:
```
# .env.local
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
GOOGLE_API_KEY=YOUR_GOOGLE_AI_STUDIO_API_KEY
```
*   `NEXT_PUBLIC_` prefixed variables are exposed to the browser.
*   Variables without the prefix are only available on the server-side.

## Further Development & Best Practices

*   **Server Components by Default**: Leverage Next.js Server Components to reduce client-side JavaScript and improve performance.
*   **Error Handling**: Implement `error.js` boundary files at appropriate route segments in the App Router for graceful error recovery.
*   **Data Fetching**: Transition from mock data to actual API calls or database interactions. Consider using Server Actions for data mutations.
*   **Image Optimization**: Use the `next/image` component for optimized images. Add placeholder image domains (like `placehold.co`) to `next.config.ts`.
*   **Accessibility (a11y)**: Ensure your components are accessible by using ARIA attributes and semantic HTML. ShadCN components are a good start.
*   **Real Authentication**: Replace mock authentication with a robust solution like NextAuth.js, Firebase Authentication, or a custom backend.
*   **State Management**: For complex client-side state, consider tools like Zustand or Jotai if React Context isn't sufficient.
*   **Testing**: Implement unit tests (e.g., with Jest/React Testing Library) and end-to-end tests (e.g., with Playwright or Cypress).

This comprehensive guide provides a roadmap to building Nomad Navigator. The existing codebase of this project serves as a complete, working example for each of these steps.

Happy building, and navigate your coding journey with confidence!

