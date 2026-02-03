import { useMemo } from "react";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useProtectedUser } from "@/hooks/useProtectedUser";
import { useInstructorCoursesService } from "@/service/instructorQueries";
import {
  TrendingUpIcon,
  Users,
  BookOpen,
  DollarSign,
  BarChart,
} from "lucide-react";
import type { Student } from "@/@types/types";
// import { Badge } from "@/components/ui/badge";

type SingleCardProps = {
  title: string;
  value: string;
  trendText: string;
  footerText: string;
  icon?: React.ReactNode;
};

function SingleCard({
  title,
  value,
  trendText,
  footerText,
  icon,
}: SingleCardProps) {
  return (
    <Card className="@container/card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardDescription>{title}</CardDescription>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {value}
        </CardTitle>
        <CardAction>
          {/* <Badge className="bg-primary/10 text-primary"></Badge> */}
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex items-center gap-2 font-medium">
          {trendText}
          <TrendingUpIcon className="size-4" />
        </div>
        <div className="text-muted-foreground">{footerText}</div>
      </CardFooter>
    </Card>
  );
}

export default function SectionCards() {
  const user = useProtectedUser();
  const { data: courses } = useInstructorCoursesService(user.id);

  const { totalRevenue, totalStudents, totalCourses, avgRevenuePerCourse } =
    useMemo(() => {
      if (!courses || courses.length === 0) {
        return {
          totalRevenue: 0,
          totalStudents: 0,
          totalCourses: 0,
          avgRevenuePerCourse: 0,
        };
      }

      let revenue = 0;
      let students = 0;

      courses.forEach((course) => {
        students += course.students.length;
        const courseRevenue = course.students.reduce(
          (acc, student: Student) => acc + (Number(student.paidAmount) || 0),
          0,
        );
        revenue += courseRevenue;
      });

      return {
        totalRevenue: revenue,
        totalStudents: students,
        totalCourses: courses.length,
        avgRevenuePerCourse: courses.length > 0 ? revenue / courses.length : 0,
      };
    }, [courses]);

  const statsData = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      trendText: "Gross earnings",
      footerText: "Lifetime revenue across all courses",
      icon: <DollarSign className="w-4 h-4" />,
    },
    {
      title: "Total Students",
      value: totalStudents.toLocaleString(),
      trendText: "Total enrollments",
      footerText: "Unique student registrations",
      icon: <Users className="w-4 h-4" />,
    },
    {
      title: "Total Courses",
      value: totalCourses.toString(),
      trendText: "Course catalog",
      footerText: "Active published courses",
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      title: "Avg. Revenue/Course",
      value: `$${avgRevenuePerCourse.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      trendText: "Performance metric",
      footerText: "Average earnings per published course",
      icon: <BarChart className="w-4 h-4" />,
    },
  ];

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {statsData.map((stat, index) => (
        <SingleCard
          key={index}
          title={stat.title}
          value={stat.value}
          trendText={stat.trendText}
          footerText={stat.footerText}
          icon={stat.icon}
        />
      ))}
    </div>
  );
}
