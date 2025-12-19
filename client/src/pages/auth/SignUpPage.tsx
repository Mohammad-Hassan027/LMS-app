import { SignUp } from "@clerk/clerk-react";

function SignUpPage() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <SignUp
        signInUrl={`${import.meta.env.VITE_CLERK_SIGN_IN_URL || "/login"}`}
        signInForceRedirectUrl={`${
          import.meta.env.VITE_CLERK_SIGN_IN_FORCE_REDIRECT_URL
        }`}
        signInFallbackRedirectUrl={`${
          import.meta.env.VITE_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL
        }`}
        forceRedirectUrl={"/"}
      />
    </div>
  );
}

export default SignUpPage;
