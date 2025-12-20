import { Fragment, type ReactNode } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";
import Loader from "../Loader";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
  authPath?: string;
  homePath?: string;
  instructorPath?: string;
}

// Define the expected shape of publicMetadata
interface PublicMetadata {
  role?: string;
  roles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  authPath = "/login",
  homePath = "/",
  instructorPath = "/instructor",
}) => {
  const { isLoaded: authLoaded, isSignedIn } = useAuth();
  const { isLoaded: userLoaded, user } = useUser();
  const location = useLocation();

  if (!authLoaded || !userLoaded) {
    return <Loader height={"h-screen"} />;
  }

  if (!isSignedIn || !user) {
    return <Navigate to={authPath} />;
  }

  // Type-safe role extraction
  const metadata = user.publicMetadata as PublicMetadata;
  const rawRoles = metadata.roles ?? metadata.role;

  const userRoles: string[] = Array.isArray(rawRoles)
    ? rawRoles
    : typeof rawRoles === "string"
    ? rawRoles
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean)
    : [];

  const isOnAuthPath =
    location.pathname.includes(authPath.replace(/^\//, "")) ||
    location.pathname.includes("/auth");
  const isOnInstructorPath = location.pathname.includes("instructor");
  const isInstructor = userRoles.includes("instructor");

  if (!isSignedIn && !isOnAuthPath) {
    return <Navigate to={authPath} />;
  }

  if (isSignedIn && !isInstructor && (isOnInstructorPath || isOnAuthPath)) {
    return <Navigate to={homePath} />;
  }

  if (isSignedIn && isInstructor && !isOnInstructorPath) {
    return <Navigate to={instructorPath} />;
  }

  if (allowedRoles) {
    const hasRequiredRole = allowedRoles.some((role) =>
      userRoles.includes(role)
    );
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" />;
    }
  }

  return <Fragment>{children}</Fragment>;
};

export default ProtectedRoute;
