import {
  CodeSquareIcon,
  // GraduationCap,
  Menu,
  PlaySquareIcon,
  ShoppingCartIcon,
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
import { useState } from "react";

function StudentViewHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setFilters } = useFilters();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  async function handleExploreCourses() {
    // Close menu if open on mobile
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
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        {/* Left Section: Logo & Desktop Explore */}
        <div className="flex items-center space-x-4">
          <Link to={"/"} className="flex items-center justify-center">
            <img src="/logo.png" className="h-10 w-36 mr-2 bg-accent" />
            {/* <GraduationCap className="h-8 w-8 mr-2 lg:mr-4" /> */}
            {/* <span className="font-extrabold text-lg lg:text-xl">PathOS</span> */}
          </Link>

          {/* Desktop Only: Explore Button */}
          <Button
            className="hidden md:inline-flex items-center justify-center gap-2 px-3 py-2 cursor-pointer"
            onClick={handleExploreCourses}
            variant={"ghost"}
          >
            <CodeSquareIcon className="w-6 h-6" />
            <span className="text-base lg:text-lg font-bold">
              Explore Courses
            </span>
          </Button>
        </div>

        {/* Right Section: Icons & Menu */}
        <div className="flex items-center space-x-3 lg:space-x-5">
          {/* Desktop Only: My Courses */}
          <Link
            to={"/my-courses"}
            className="hidden md:inline-flex items-center justify-center gap-2 px-3 py-2"
          >
            <PlaySquareIcon className="h-6 w-6" />
            <span className="text-base lg:text-lg font-bold">My Courses</span>
          </Link>

          {/* Always Visible: Cart */}
          <Link to={"/cart"} className="flex items-center">
            <ShoppingCartIcon className="h-6 w-6" />
          </Link>

          {/* Always Visible: Auth */}
          <div className="flex items-center">
            <SignedIn>
              <UserButton />
            </SignedIn>
            <SignedOut>
              <Button>
                <SignInButton mode="modal" />
              </Button>
            </SignedOut>
          </div>

          {/* Mobile Only: Menu Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden border-t p-4 space-y-4 bg-background">
          <div
            onClick={handleExploreCourses}
            className="flex items-center gap-2 font-bold cursor-pointer py-2 hover:bg-muted rounded-md px-2"
          >
            <CodeSquareIcon className="h-5 w-5" />
            <span>Explore Courses</span>
          </div>

          <Link
            to={"/my-courses"}
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-2 font-bold py-2 hover:bg-muted rounded-md px-2"
          >
            <PlaySquareIcon className="h-5 w-5" />
            <span>My Courses</span>
          </Link>
        </div>
      )}
    </header>
  );
}

export default StudentViewHeader;
