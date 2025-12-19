import {
  CodeSquareIcon,
  GraduationCap,
  PlaySquareIcon,
  ShoppingCartIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";

function StudentViewHeader() {
  return (
    <header className="px-4 lg:px-6 h-16 flex items-center justify-between border-b">
      <div className="flex items-center space-x-5">
        <Link to={"/"} className="flex items-center justify-center">
          <GraduationCap className="h-8 w-8 mr-4" />
          <span className="font-extrabold text-xl">LMS LERN</span>
        </Link>
        <Link
          to={"/courses"}
          className="inline-flex items-center justify-center gap-2 px-3 py-2"
        >
          <CodeSquareIcon />
          <span className="text-lg font-bold">Explore Courses</span>
        </Link>
      </div>

      <div className="ml-auto flex items-center space-x-5">
        <Link
          to={"/my-courses"}
          className="inline-flex items-center justify-center gap-2 px-3 py-2"
        >
          <PlaySquareIcon className="h-6 w-6" />
          {/* <YoutubeIcon className="h-6 w-6" /> */}
          <span className="text-lg font-bold">My Courses</span>
        </Link>
        <Link to={"/cart"}>
          <ShoppingCartIcon className="h-6 w-6" />
        </Link>
        <SignedIn>
          <UserButton />
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
      </div>
    </header>
  );
}

export default StudentViewHeader;
