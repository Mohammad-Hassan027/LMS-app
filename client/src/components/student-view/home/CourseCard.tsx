import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { BookOpen, Users } from "lucide-react"; // Changed Clock to BookOpen
import { useNavigate } from "react-router-dom";
import type { Course } from "@/@types/types";

function CourseCard({ course }: { course: Course }) {
  const navigate = useNavigate();
  return (
    <Card
      onClick={() => navigate(`/course/details/${course._id}`)}
      className="group flex flex-col cursor-pointer overflow-hidden border-border bg-card hover:shadow-lg hover:border-primary/30 transition-all duration-300 h-full"
    >
      <div className="relative overflow-hidden aspect-video">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded capitalize">
          {course.category || "Course"}
        </div>
      </div>

      <CardContent className="grow p-5">
        <h3 className="text-lg font-bold text-card-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
          {course.title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" /> {course.students?.length || 0}{" "}
            Enrolled
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <BookOpen className="w-3 h-3" /> {course.curriculum?.length || 0}{" "}
            Lectures
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 flex items-center justify-between">
        <span className="text-xl font-bold text-primary">
          ${course.pricing}
        </span>
        <span className="text-sm font-medium text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all">
          View Details &rarr;
        </span>
      </CardFooter>
    </Card>
  );
}

export default CourseCard;
