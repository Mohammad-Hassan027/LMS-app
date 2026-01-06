import { courseLandingPageFormControls } from "@/config";
import { useInstructorContext } from "@/contexts/Instructor/hook";
import CommonForm from "@/components/common-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function CourseLanding() {
  const { courseLandingFormData, setCourseLandingFormData } =
    useInstructorContext();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Course Landing Page Details</CardTitle>
      </CardHeader>
      <CardContent>
        <CommonForm
          formControls={courseLandingPageFormControls}
          formData={courseLandingFormData}
          setFormData={setCourseLandingFormData}
        />
      </CardContent>
    </Card>
  );
}

export default CourseLanding;
