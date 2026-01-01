import { type ReactNode } from "react";
import { StudentContext } from "./hook";

export default function StudentContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <StudentContext.Provider value={{}}>{children}</StudentContext.Provider>
  );
}
