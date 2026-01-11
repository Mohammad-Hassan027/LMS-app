import { useUser } from "@clerk/clerk-react";

export const useProtectedUser = () => {
  const { user } = useUser();

  if (!user) {
    throw new Error("useProtectedUser called outside of a protected context");
  }

  return user;
};
