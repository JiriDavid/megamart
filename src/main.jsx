import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import App from "@/App";
import "@/index.css";

// Import your publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  console.error("Missing Clerk Publishable Key. Please check your .env file.");
  // Render a simple error message instead of crashing
  ReactDOM.createRoot(document.getElementById("root")).render(
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Configuration Error</h1>
      <p>
        Missing Clerk Publishable Key. Please check your .env file and ensure
        VITE_CLERK_PUBLISHABLE_KEY is set.
      </p>
      <p>Make sure to:</p>
      <ol>
        <li>
          Create a Clerk application at{" "}
          <a href="https://clerk.com" target="_blank">
            clerk.com
          </a>
        </li>
        <li>
          Copy your publishable key to the .env file as
          VITE_CLERK_PUBLISHABLE_KEY
        </li>
        <li>Restart the development server</li>
      </ol>
    </div>
  );
} else {
  ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        appearance={{
          baseTheme: undefined,
        }}
      >
        <App />
      </ClerkProvider>
    </React.StrictMode>
  );
}
