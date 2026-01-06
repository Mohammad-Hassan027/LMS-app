import { Suspense } from "react";
import Loader from "@/components/Loader";
import Routes from "@/components/Routes";

function App() {
  return (
    <>
      <Suspense fallback={<Loader height="h-screen" />}>
        <Routes />
      </Suspense>
    </>
  );
}

export default App;
