import { BrowserRouter } from "react-router-dom";
import { ClerkProvider } from "@clerk/clerk-react";
import InstructorProvider from "../contexts/Instructor/index.tsx";
import { Toaster } from "./ui/sonner.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import StudentContextProvider from "../contexts/student/index.tsx";
import type { ReactElement } from "react";
import { NuqsAdapter } from "nuqs/adapters/react";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";

// Environment Variables
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID; // Ensure this is in your .env

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key");
}

if (!PAYPAL_CLIENT_ID) {
  throw new Error("Missing PayPal Client ID");
}

const queryClient = new QueryClient();

export default function AppWrapper({ children }: { children: ReactElement }) {
  return (
    <BrowserRouter>
      <NuqsAdapter>
        <QueryClientProvider client={queryClient}>
          <PayPalScriptProvider
            options={{
              clientId: PAYPAL_CLIENT_ID,
              currency: "USD",
              intent: "capture",
            }}
          >
            <ClerkProvider
              publishableKey={PUBLISHABLE_KEY}
              signInUrl={import.meta.env.VITE_CLERK_SIGN_IN_URL}
              signUpUrl={import.meta.env.VITE_CLERK_SIGN_UP_URL}
              afterSignOutUrl={import.meta.env.VITE_CLERK_SIGN_IN_URL}
            >
              <InstructorProvider>
                <StudentContextProvider>
                  {children}
                  <Toaster />
                </StudentContextProvider>
              </InstructorProvider>
            </ClerkProvider>
          </PayPalScriptProvider>
        </QueryClientProvider>
      </NuqsAdapter>
    </BrowserRouter>
  );
}
