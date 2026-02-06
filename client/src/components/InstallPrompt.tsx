import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export function InstallPrompt({ className }: { className?: string }) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [_, setIsInstallable] = useState(false);
  const [status, setStatus] = useState("Loading...");

  useEffect(() => {
    if (!window.matchMedia("(display-mode: standalone)").matches) {
      setStatus("Browser Mode"); // We are in a browser, so install is possible
    } else {
      setStatus("Already Installed"); // We are already in the app
    }
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e);
      // Update UI notify the user they can install the PWA
      setIsInstallable(true);
      setStatus("Ready to Install"); // Event fired successfully!
      console.log("✅ PWA Install Event captured.");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);

    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  // if (!isInstallable) return null;

  return (
    <Button
      onClick={handleInstallClick}
      variant={deferredPrompt ? "default" : "secondary"}
      className={className || "w-full sm:w-auto"}
    >
      {deferredPrompt ? "Install PathOS" : `Status: ${status}`}
    </Button>
  );
}
