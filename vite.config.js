import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";

// Custom plugin to handle redirects
const copyRedirectsPlugin = () => {
  return {
    name: "copy-redirects",
    writeBundle() {
      try {
        // Copy _redirects file to dist directory
        if (fs.existsSync("public/_redirects")) {
          fs.copyFileSync("public/_redirects", "dist/_redirects");
        }

        // Also create a .htaccess file for additional compatibility
        const htaccessContent = `
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
`;
        fs.writeFileSync("dist/.htaccess", htaccessContent.trim());
      } catch (error) {
        console.warn("Could not copy redirects files:", error.message);
      }
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), copyRedirectsPlugin()],
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
