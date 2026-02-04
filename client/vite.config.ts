import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

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
            // 1. Video Player & Heavy Libs
            if (
              id.includes("react-player") ||
              id.includes("dashjs") ||
              id.includes("hls.js")
            ) {
              return "video-player-libs";
            }

            // 2. PayPal
            if (id.includes("@paypal")) {
              return "paypal-lib";
            }
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
