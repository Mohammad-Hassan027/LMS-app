import type { Course } from "@/@types/types";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CourseCard({ course }: { course: Course }) {
  const navigate = useNavigate();
  return (
    <Card
      onClick={() => navigate(`/course/details/${course._id}`)}
      className="group flex flex-col cursor-pointer overflow-hidden border-gray-200 hover:shadow-xl transition-all duration-300"
    >
      <div className="relative overflow-hidden aspect-video">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
          {course.category || "Course"}
        </div>
      </div>

      <CardContent className="grow p-5">
        <h3 className="text-lg font-bold text-gray-900 transition-colors line-clamp-2 mb-2">
          {course.title}
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <span className="flex items-center gap-1">
            <Users className="w-3 h-3" /> {course.students.length || 120}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> 12h
          </span>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0 flex items-center justify-between">
        <span className="text-xl font-bold text-gray-800">
          ${course.pricing}
        </span>
        <span className="text-sm font-medium text-gray-500 group-hover:translate-x-1 transition-transform">
          View Details &rarr;
        </span>
      </CardFooter>
    </Card>
  );
}

export default CourseCard;
