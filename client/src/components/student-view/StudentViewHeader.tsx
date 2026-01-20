import {
  CodeSquareIcon,
  Menu,
  PlaySquareIcon,
  ShoppingCartIcon,
  X,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import { useFilters } from "@/hooks/use-filters";
import { useState, useEffect } from "react";

function StudentViewHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setFilters } = useFilters();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Add shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  async function handleExploreCourses() {
    setIsMenuOpen(false);
    if (location.pathname.includes("/courses")) {
      await setFilters({
        category: null,
        level: null,
        primaryLanguage: null,
      });
    } else {
      navigate("/courses");
    }
  }

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-gray-200"
          : "bg-background border-transparent"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to={"/"} className="flex items-center gap-2 group">
            <div className="h-10 w-auto min-w-[120px] flex items-center justify-center rounded-md overflow-hidden">
              <img
                src="/logo.png"
                alt="PathOS Logo"
                className="h-full w-full object-contain"
                loading="eager"
              />
            </div>
          </Link>

          <Button
            variant="ghost"
            onClick={handleExploreCourses}
            className="hidden md:flex items-center gap-2 text-gray-600 transition-colors"
          >
            <CodeSquareIcon className="w-5 h-5" />
            <span className="font-medium">Explore Courses</span>
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <SignedIn>
            <Link to="/my-courses">
              <Button
                variant="ghost"
                className="hidden md:flex items-center gap-2 text-gray-600 transition-colors"
              >
                <PlaySquareIcon className="w-5 h-5" />
                <span className="font-medium">My Learning</span>
              </Button>
            </Link>
          </SignedIn>

          <Link to="/cart">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-gray-600"
            >
              <ShoppingCartIcon className="w-6 h-6" />
              <span className="sr-only">Cart</span>
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
            </Button>
          </Link>

          <div className="flex items-center gap-2">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button className="font-medium text-white">Sign In</Button>
              </SignInButton>
            </SignedOut>
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-gray-700"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>
        </div>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-background border-b shadow-xl md:hidden animate-in slide-in-from-top-5 duration-200">
          <nav className="p-4 flex flex-col gap-2">
            <button
              onClick={handleExploreCourses}
              className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-gray-100 text-sm font-medium transition-colors text-left"
            >
              <CodeSquareIcon className="h-5 w-5" />
              Explore Courses
            </button>

            <SignedIn>
              <Link
                to="/my-courses"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-md hover:bg-gray-100 text-sm font-medium transition-colors"
              >
                <PlaySquareIcon className="h-5 w-5" />
                My Learning
              </Link>
            </SignedIn>
          </nav>
        </div>
      )}
    </header>
  );
}

export default StudentViewHeader;
