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
import { useShoppingCart } from "@/contexts/student/hook";

function StudentViewHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setFilters } = useFilters();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { cartItems } = useShoppingCart();

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
          ? "bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 border-border/40 shadow-sm"
          : "bg-background border-transparent"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            to={"/"}
            className="flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <div className="h-9 w-auto flex items-center">
              <img
                src="/logo.png"
                alt="PathOS Logo"
                width={110}
                height={36}
                className="h-full w-full object-contain"
                loading="eager"
              />
            </div>
          </Link>

          <Button
            variant="ghost"
            onClick={handleExploreCourses}
            className={`hidden md:flex items-center gap-2 transition-colors ${
              location.pathname.includes("/courses")
                ? "text-primary bg-primary/5 font-semibold"
                : "text-muted-foreground hover:text-primary hover:bg-transparent"
            }`}
          >
            <CodeSquareIcon className="w-5 h-5" />
            <span className="text-sm lg:text-base">Explore Courses</span>
          </Button>
        </div>

        <div className="flex items-center gap-3 lg:gap-4">
          <SignedIn>
            <Link to="/my-courses">
              <Button
                variant="ghost"
                className={`hidden md:flex items-center gap-2 transition-colors ${
                  location.pathname.includes("/my-courses")
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-primary hover:bg-transparent"
                }`}
              >
                <PlaySquareIcon className="w-5 h-5" />
                <span className="text-sm lg:text-base">My Learning</span>
              </Button>
            </Link>
          </SignedIn>

          <Link to="/cart">
            <Button
              variant="ghost"
              size="icon"
              className="relative text-muted-foreground hover:text-primary transition-colors"
            >
              <ShoppingCartIcon className="w-5 h-5 lg:w-6 lg:h-6" />
              <span className="sr-only">Cart</span>
              {cartItems.length > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-600 ring-2 ring-background" />
              )}
            </Button>
          </Link>

          <div className="flex items-center gap-2 pl-2">
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button size="sm" className="font-semibold px-6">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-muted-foreground"
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

      {/* --- MOBILE MENU DROPDOWN --- */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-background/95 backdrop-blur-xl border-b shadow-lg md:hidden animate-in slide-in-from-top-5 duration-200 z-40">
          <nav className="p-4 flex flex-col gap-1">
            <button
              onClick={handleExploreCourses}
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/5 hover:text-primary text-sm font-medium transition-colors text-left text-foreground/80"
            >
              <CodeSquareIcon className="h-5 w-5" />
              Explore Courses
            </button>

            <SignedIn>
              <Link
                to="/my-courses"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary/5 hover:text-primary text-sm font-medium transition-colors text-foreground/80"
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
