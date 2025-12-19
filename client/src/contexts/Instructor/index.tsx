import { useState, type ReactNode } from "react";

import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "../../config";
import { InstructorContext } from "./hook";

export default function InstructorProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [courseLandingFormData, setCourseLandingFormData] = useState(
    courseLandingInitialFormData
  );
  const [courseCurriculumFormData, setCourseCurriculumFormData] = useState(
    courseCurriculumInitialFormData
  );
  const [mediaUploadProgress, setMediaUploadProgress] = useState(false);
  const [mediaUploadProgressPercent, setMediaUploadProgressPercent] =
    useState(0);
  const [currentEditedCourseId, setCurrentEditedCourseId] = useState<string>(
    null as unknown as string
  );

  return (
    <InstructorContext.Provider
      value={{
        courseLandingFormData,
        setCourseLandingFormData,
        courseCurriculumFormData,
        setCourseCurriculumFormData,
        mediaUploadProgress,
        setMediaUploadProgress,
        mediaUploadProgressPercent,
        setMediaUploadProgressPercent,
        currentEditedCourseId,
        setCurrentEditedCourseId,
        activeTab,
        setActiveTab,
      }}
    >
      {children}
    </InstructorContext.Provider>
  );
}
