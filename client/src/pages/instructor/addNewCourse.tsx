import { useEffect, Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";
import {
  useAddNewCourseService,
  useCourseDetailsForInstructorService,
  useUpdateCourseService,
} from "@/service/instructorQueries";
import { useInstructorContext } from "@/contexts/Instructor/hook";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { isEmpty } from "@/utils";

import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseCurriculum from "@/components/instructor-view/courses/add-new-course/CourseCurriculum";
import CourseLanding from "@/components/instructor-view/courses/add-new-course/CourseLanding";
import CourseSetting from "@/components/instructor-view/courses/add-new-course/CourseSetting";

function InstructorCourseForm({
  isEditMode = false,
  courseId = "",
}: {
  isEditMode?: boolean;
  courseId?: string;
}) {
  const {
    courseCurriculumFormData,
    courseLandingFormData,
    setCourseCurriculumFormData,
    setCourseLandingFormData,
    setCurrentEditedCourseId,
  } = useInstructorContext();

  const { user } = useUser();
  const navigate = useNavigate();

  const { mutateAsync: addNewCourse } = useAddNewCourseService();
  const { mutateAsync: updateCourse } = useUpdateCourseService(courseId);

  function validateFormData() {
    for (const key in courseLandingFormData) {
      if (
        isEmpty(
          courseLandingFormData[key as keyof typeof courseLandingFormData]
        )
      )
        return false;
    }

    let hasFreePreview = false;
    for (const item of courseCurriculumFormData) {
      if (
        isEmpty(item.title) ||
        isEmpty(item.videoUrl) ||
        isEmpty(item.public_id)
      ) {
        return false;
      }
      if (item.isFreePreview) {
        hasFreePreview = true;
      }
    }
    return hasFreePreview;
  }

  async function handleSubmit() {
    if (!user || !user.fullName) return;
    if (!validateFormData()) return;

    const commonData = {
      ...courseLandingFormData,
      curriculum: courseCurriculumFormData,
      isPublished: true,
    };

    try {
      let response;
      if (isEditMode) {
        // EDIT MODE
        response = await updateCourse(commonData);
      } else {
        // CREATE MODE
        response = await addNewCourse({
          ...commonData,
          instructorId: user.id,
          instructorName: user.fullName,
          students: [],
        });
      }

      if (response) {
        // Reset and Go Back
        setCourseLandingFormData(courseLandingInitialFormData);
        setCourseCurriculumFormData(courseCurriculumInitialFormData);
        navigate(-1);
        setCurrentEditedCourseId(null as unknown as string);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between">
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-5">
          {isEditMode ? "Edit " : "Create a new "}course
        </h1>
        <Button
          disabled={!validateFormData()}
          className="text-sm tracking-wider font-bold px-8"
          onClick={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          SUBMIT
        </Button>
      </div>
      <Card>
        <CardContent>
          <div className="container mx-auto p-0 sm:p-4">
            <Tabs defaultValue="course-curriculum">
              <TabsList>
                <TabsTrigger value="course-curriculum">Curriculum</TabsTrigger>
                <TabsTrigger value="course-landing-page">
                  Course Landing Page
                </TabsTrigger>
                <TabsTrigger value="course-setting">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="course-curriculum">
                <CourseCurriculum />
              </TabsContent>
              <TabsContent value="course-landing-page">
                <CourseLanding />
              </TabsContent>
              <TabsContent value="course-setting">
                <CourseSetting />
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EditCourseEntry({ courseId }: { courseId: string }) {
  const {
    setCourseCurriculumFormData,
    setCourseLandingFormData,
    setCurrentEditedCourseId,
  } = useInstructorContext();

  const { data } = useCourseDetailsForInstructorService(courseId);

  useEffect(() => {
    if (data) {
      setCurrentEditedCourseId(courseId);
      setCourseCurriculumFormData(data.curriculum || []);
      setCourseLandingFormData({
        title: data.title,
        description: data.description,
        category: data.category,
        level: data.level,
        primaryLanguage: data.primaryLanguage,
        subtitle: data.subtitle,
        image: data.image,
        welcomeMessage: data.welcomeMessage,
        pricing: data.pricing,
        objectives: data.objectives,
      });
    }
  }, [
    data,
    courseId,
    setCurrentEditedCourseId,
    setCourseCurriculumFormData,
    setCourseLandingFormData,
  ]);

  return <InstructorCourseForm isEditMode={true} courseId={courseId} />;
}

function CreateCourseEntry() {
  const {
    setCourseCurriculumFormData,
    setCourseLandingFormData,
    setCurrentEditedCourseId,
  } = useInstructorContext();

  useEffect(() => {
    setCurrentEditedCourseId(null as unknown as string);
    setCourseCurriculumFormData(courseCurriculumInitialFormData);
    setCourseLandingFormData(courseLandingInitialFormData);
  }, [
    setCurrentEditedCourseId,
    setCourseCurriculumFormData,
    setCourseLandingFormData,
  ]);

  return <InstructorCourseForm isEditMode={false} />;
}

function AddNewCoursePage() {
  const { user, isLoaded } = useUser();
  const params = useParams<{ courseId: string }>();

  if (!isLoaded) return <Loader />;
  if (!user?.id) return null;

  const isEdit = !!params.courseId;

  return (
    <Suspense fallback={<Loader />}>
      {isEdit ? (
        <EditCourseEntry courseId={params.courseId!} />
      ) : (
        <CreateCourseEntry />
      )}
    </Suspense>
  );
}

export default AddNewCoursePage;
