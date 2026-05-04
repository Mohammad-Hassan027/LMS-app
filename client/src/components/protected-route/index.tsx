import { Fragment, type ReactNode } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";
import Loader from "@/components/Loader";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
  redirectPath?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  redirectPath = "/login",
}) => {
  const { isLoaded, isSignedIn } = useAuth();
  const { user } = useUser();
  const location = useLocation();

  if (!isLoaded) {
    return <Loader height={"h-screen"} />;
  }

  if (!isSignedIn) {
    // Redirect them to login, but save where they were trying to go
    return <Navigate to={redirectPath} state={{ from: location }} replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const metadata = user?.publicMetadata;
    const rawRoles = metadata?.roles || metadata?.role;

    const userRoles = Array.isArray(rawRoles)
      ? rawRoles
      : typeof rawRoles === "string"
        ? [rawRoles]
        : [];

    const hasPermission = allowedRoles.some((role) => userRoles.includes(role));

    if (!hasPermission) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Fragment>{children}</Fragment>;
};

export default ProtectedRoute;
