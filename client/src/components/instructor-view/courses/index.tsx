import { Delete, Edit } from "lucide-react";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../ui/table";
import { useNavigate } from "react-router-dom";
import { useInstructorContext } from "../../../contexts/Instructor/hook";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "../../../config";
import { useUser } from "@clerk/clerk-react";
import {
  useDeleteCourseService,
  useInstructorCoursesService,
} from "../../../service/instructorQueries";
import Loader from "../../Loader";

function InstructorCourses() {
  const navigate = useNavigate();
  const {
    setCourseCurriculumFormData,
    setCourseLandingFormData,
    setCurrentEditedCourseId,
  } = useInstructorContext();
  const { user } = useUser();
  const { data: listOfCourses, isLoading } = useInstructorCoursesService(
    user?.id as string
  );
  const { mutateAsync: deleteCourse } = useDeleteCourseService();

  return (
    <Card>
      <CardHeader className="flex justify-between flex-col sm:flex-row items-center">
        <CardTitle className="text-2xl sm:text-3xl font-extrabold">
          All Courses
        </CardTitle>
        <Button
          className="p-4 sm:p-5"
          onClick={() => {
            setCurrentEditedCourseId(null as unknown as string);
            navigate("/instructor/add-new-course");
            setCourseCurriculumFormData(courseCurriculumInitialFormData);
            setCourseLandingFormData(courseLandingInitialFormData);
          }}
        >
          Create New Courses
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading && <Loader height="h-15 ml-5" />}
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Courses</TableHead>
                <TableHead>Student</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listOfCourses && listOfCourses.length > 0
                ? listOfCourses.map((course) => (
                    <TableRow key={course?._id}>
                      <TableCell className="font-medium">
                        {course?.title}
                      </TableCell>
                      <TableCell>{course?.students?.length}</TableCell>
                      <TableCell>
                        {course?.students?.length * Number(course?.pricing)}
                      </TableCell>
                      <TableCell className="text-center flex gap-1 justify-center">
                        <Button
                          onClick={() => {
                            navigate(`/instructor/edit-course/${course?._id}`);
                          }}
                          variant="ghost"
                          size={"sm"}
                        >
                          <Edit />
                        </Button>
                        <Button
                          onClick={() => deleteCourse(course?._id)}
                          variant="ghost"
                          size={"sm"}
                        >
                          <Delete />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                : null}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

export default InstructorCourses;
