import { createRoot } from "react-dom/client";
import "@/index.css";
import App from "@/App.tsx";
import AppWrapper from "@/components/AppWrapper.tsx";
import React from "react";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppWrapper>
      <App />
    </AppWrapper>
  </React.StrictMode>,
);
