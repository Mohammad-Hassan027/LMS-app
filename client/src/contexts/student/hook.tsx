import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";

type StudentContextType = {
  studentViewCoursesList: models.Course[];
  setStudentViewCoursesList: Dispatch<SetStateAction<models.Course[]>>;
};

export const StudentContext = createContext<StudentContextType | null>(null);

export const useStudentContext = () => {
  const studentContext = useContext(StudentContext);

  if (!studentContext) {
    // If the provider is not present, fail fast with a helpful message.
    throw new Error("CourseLanding must be used within an StudentProvider");
  }

  return studentContext;
};
