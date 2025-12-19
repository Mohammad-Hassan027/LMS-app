import { useState, type ReactNode } from "react";
import { StudentContext } from "./hook";

export default function StudentContextProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [studentViewCoursesList, setStudentViewCoursesList] = useState<
    models.Course[]
  >([]);
  return (
    <StudentContext.Provider
      value={{ studentViewCoursesList, setStudentViewCoursesList }}
    >
      {children}
    </StudentContext.Provider>
  );
}
