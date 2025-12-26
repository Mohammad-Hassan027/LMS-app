import { useUser } from "@clerk/clerk-react";
import { useParams } from "react-router-dom";

export default function CourseProgressPage() {
  const { courseId } = useParams();
  const { user } = useUser();
  return (
    <div>
      Course : {courseId} of user : {user?.id}
    </div>
  );
}
