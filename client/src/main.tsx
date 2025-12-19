import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import InstructorProvider from "./contexts/Instructor/index.tsx";
import { Toaster } from "./components/ui/sonner.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import StudentContextProvider from "./contexts/student/index.tsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        signInUrl={import.meta.env.VITE_CLERK_SIGN_IN_URL}
        signUpUrl={import.meta.env.VITE_CLERK_SIGN_UP_URL}
        afterSignOutUrl={import.meta.env.VITE_CLERK_SIGN_IN_URL}
      >
        <InstructorProvider>
          <StudentContextProvider>
            <App />
            <Toaster />
          </StudentContextProvider>
        </InstructorProvider>
      </ClerkProvider>
    </QueryClientProvider>
  </BrowserRouter>
);
