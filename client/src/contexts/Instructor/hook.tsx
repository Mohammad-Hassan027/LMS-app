import {
  createContext,
  useContext,
  type Dispatch,
  type SetStateAction,
} from "react";
import type {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";

type CourseLandingFormType = typeof courseLandingInitialFormData;
export type CourseCurriculumFormType = typeof courseCurriculumInitialFormData;

type InstructorContextType = {
  courseLandingFormData: CourseLandingFormType;
  setCourseLandingFormData: Dispatch<SetStateAction<CourseLandingFormType>>;
  courseCurriculumFormData: CourseCurriculumFormType;
  setCourseCurriculumFormData: Dispatch<
    SetStateAction<CourseCurriculumFormType>
  >;
  mediaUploadProgress: boolean;
  setMediaUploadProgress: Dispatch<SetStateAction<boolean>>;
  mediaUploadProgressPercent: number;
  setMediaUploadProgressPercent: Dispatch<SetStateAction<number>>;
  currentEditedCourseId: string;
  setCurrentEditedCourseId: Dispatch<SetStateAction<string>>;
  activeTab: string;
  setActiveTab: Dispatch<SetStateAction<string>>;
};

export const InstructorContext = createContext<InstructorContextType | null>(
  null
);

export const useInstructorContext = () => {
  const instructorContext = useContext(InstructorContext);

  if (!instructorContext) {
    // If the provider is not present, fail fast with a helpful message.
    throw new Error("CourseLanding must be used within an InstructorProvider");
  }

  return instructorContext;
};
