import { SignIn } from "@clerk/clerk-react";

function SignInPage() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <SignIn
        signUpUrl={`${import.meta.env.VITE_CLERK_SIGN_UP_URL || "/register"}`}
        signUpForceRedirectUrl={`${
          import.meta.env.VITE_CLERK_SIGN_UP_FORCE_REDIRECT_URL
        }`}
        signUpFallbackRedirectUrl={`${
          import.meta.env.VITE_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL
        }`}
        forceRedirectUrl={"/"}
      />
    </div>
  );
}

export default SignInPage;
