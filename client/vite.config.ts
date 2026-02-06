import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: ["babel-plugin-react-compiler"],
      },
    }),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon.png", "logo.png"],
      manifest: {
        id: "/",
        name: "PathOS | Path to Success",
        short_name: "PathOS",
        description:
          "Unlock your potential with PathOS. A comprehensive Learning Management System (LMS).",
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        scope: "/",
        start_url: "/",
        orientation: "portrait",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
        screenshots: [
          {
            src: "/screenshot-desktop.png",
            sizes: "1280x720",
            type: "image/png",
            form_factor: "wide",
            label: "Desktop Dashboard",
          },
          {
            src: "/screenshot-mobile.png",
            sizes: "750x1334",
            type: "image/png",
            form_factor: "narrow",
            label: "Mobile Course View",
          },
        ],
      },
    }),
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
