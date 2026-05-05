import Loader from "@/components/Loader";
import Routes from "@/components/Routes";
import { useAuth } from "@clerk/clerk-react";

function App() {
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return <Loader height="h-screen" />;
  }
  return <Routes />;
}

export default App;
