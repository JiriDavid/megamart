import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    open: true,
    historyApiFallback: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    assetsDir: "assets",
  },
  preview: {
    port: 3000,
    open: true,
  },
  base: "/", // Ensure base URL is correct for Vercel
});
