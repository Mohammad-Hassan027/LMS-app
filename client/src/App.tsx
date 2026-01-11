import { Suspense } from "react";
import Loader from "@/components/Loader";
import Routes from "@/components/Routes";
import { useAuth } from "@clerk/clerk-react";

function App() {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return <Loader height="h-screen" />;
  }
  return (
    <>
      <Suspense fallback={<Loader height="h-screen" />}>
        <Routes />
      </Suspense>
    </>
  );
}

export default App;
