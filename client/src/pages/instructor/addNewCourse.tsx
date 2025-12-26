import CourseCurriculum from "../../components/instructor-view/courses/add-new-course/CourseCurriculum";
import CourseLanding from "../../components/instructor-view/courses/add-new-course/CourseLanding";
import CourseSetting from "../../components/instructor-view/courses/add-new-course/CourseSetting";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { useInstructorContext } from "../../contexts/Instructor/hook";
import { useUser } from "@clerk/clerk-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useAddNewCourseService,
  useCourseDetailsForInstructorService,
  useUpdateCourseService,
} from "../../service/instructorQueries";
import { isEmpty } from "../../utils";
import { useCallback, useEffect } from "react";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "../../config";

function AddNewCoursePage() {
  const {
    courseCurriculumFormData,
    courseLandingFormData,
    currentEditedCourseId,
    setCourseCurriculumFormData,
    setCourseLandingFormData,
    setCurrentEditedCourseId,
  } = useInstructorContext();
  const { user } = useUser();
  const navigate = useNavigate();
  const params = useParams<{ courseId: string }>();

  const { mutateAsync: addNewCourse } = useAddNewCourseService();
  const { mutateAsync: updateCourse } = useUpdateCourseService(
    currentEditedCourseId
  );
  const { data } = useCourseDetailsForInstructorService(currentEditedCourseId);

  const initializeEditedCourseId = useCallback(() => {
    if (params.courseId) {
      setCurrentEditedCourseId(params.courseId);
    }

    if (currentEditedCourseId && data) {
      setCourseCurriculumFormData(data.curriculum);
      const landingFormData = {
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
      };
      setCourseLandingFormData(landingFormData);
    }
  }, [
    params.courseId,
    currentEditedCourseId,
    data,
    setCurrentEditedCourseId,
    setCourseCurriculumFormData,
    setCourseLandingFormData,
  ]);

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

  async function handleCreateNewCourse() {
    if (!user || !user.fullName) return;
    if (!validateFormData()) return;

    const courseData = {
      instructorId: user?.id,
      instructorName: user?.fullName,
      ...courseLandingFormData,
      students: [],
      curriculum: courseCurriculumFormData,
      isPublished: true,
    };

    try {
      const response = await addNewCourse(courseData);

      if (response !== undefined) {
        setCourseLandingFormData(courseLandingInitialFormData);
        setCourseCurriculumFormData(courseCurriculumInitialFormData);
        navigate(-1);
        setCurrentEditedCourseId(null as unknown as string);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleEditCourse() {
    if (!user) return;
    if (!currentEditedCourseId) return;
    if (!validateFormData()) return;

    const courseData = {
      ...courseLandingFormData,
      curriculum: courseCurriculumFormData,
      isPublished: true,
    };

    try {
      const response = await updateCourse(courseData);

      if (response !== undefined) {
        setCourseLandingFormData(courseLandingInitialFormData);
        setCourseCurriculumFormData(courseCurriculumInitialFormData);
        navigate(-1);
        setCurrentEditedCourseId(null as unknown as string);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    initializeEditedCourseId();
  }, [initializeEditedCourseId, params.courseId]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between">
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-5">
          {currentEditedCourseId ? "Edit " : "Create a new "}course
        </h1>
        <Button
          disabled={!validateFormData()}
          className="text-sm tracking-wider font-bold px-8"
          onClick={(e) => {
            e.preventDefault();
            if (currentEditedCourseId !== null && currentEditedCourseId !== "")
              handleEditCourse();
            else handleCreateNewCourse();
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

export default AddNewCoursePage;
