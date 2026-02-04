import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            // 1. Video Player & Heavy Libs (Keep these separate!)
            // This catches react-player, dash.js, and hls.js
            if (
              id.includes("react-player") ||
              id.includes("dashjs") ||
              id.includes("hls.js")
            ) {
              return "video-player-libs";
            }

            // 2. PayPal (Only load this on checkout)
            if (id.includes("@paypal")) {
              return "paypal-lib";
            }

            // 3. Clerk (Authentication)
            if (id.includes("@clerk")) {
              return "clerk-vendor";
            }

            // 4. UI Libraries (Radix, Lucide, Tailwind utils)
            if (
              id.includes("@radix-ui") ||
              id.includes("class-variance-authority") ||
              id.includes("clsx") ||
              id.includes("tailwind-merge")
            ) {
              return "ui-vendor";
            }

            // 5. Core React (Strict check using Regex to avoid capturing other libs)
            // Matches /react/, /react-dom/, or /react-router-dom/ specifically
            if (
              /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/.test(
                id,
              )
            ) {
              return "react-vendor";
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
