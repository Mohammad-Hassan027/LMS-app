import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, DollarSign, Users, Zap } from "lucide-react";
import {
  useCheckIsInstructorService,
  useRequestToBeInstructorService,
} from "@/service/adminQueries";
import { Link } from "react-router-dom";

const BecomeInstructor = () => {
  const { user } = useUser();
  const [reason, setReason] = useState("");
  const { data: isUserInstructor, isPending: isCheckingInstructor } =
    useCheckIsInstructorService({
      userId: user?.id || "",
    });
  const { mutate: requestToBeInstructor, isPending: isSubmitting } =
    useRequestToBeInstructorService();

  if (isCheckingInstructor) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isUserInstructor) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 md:p-12">
        <Card className="w-full max-w-lg text-center p-8 shadow-lg border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle className="text-2xl">
              You're Already an Instructor
            </CardTitle>
            <CardDescription className="mt-2 text-gray-600">
              Thank you for being a valued member of our instructor community!
            </CardDescription>
            <Button>
              <Link to="/instructor">Go to Dashboard</Link>
            </Button>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const handleSubmit = () => {
    if (!user || !user?.primaryEmailAddress) return;

    requestToBeInstructor(
      {
        userId: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        userName:
          user.fullName ||
          user.username ||
          user.primaryEmailAddress?.emailAddress?.split("@")[0],
        reason: reason,
      },
      {
        onSuccess: () => {
          setReason("");
        },
      },
    );
  };

  const benefits = [
    {
      icon: <DollarSign className="w-6 h-6 text-green-600" />,
      title: "Earn Money",
      desc: "Earn money every time a student purchases your course.",
    },
    {
      icon: <Users className="w-6 h-6 text-blue-600" />,
      title: "Inspire Students",
      desc: "Help people learn new skills, advance their careers, and explore their hobbies.",
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-500" />,
      title: "Flexible Schedule",
      desc: "Teach what you know and love, on your own terms and schedule.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 md:p-12">
      <div className="grid md:grid-cols-2 gap-12 max-w-6xl w-full items-start">
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
              Come teach with us
            </h1>
            <p className="text-lg text-gray-600">
              Become an instructor and change lives — including your own.
            </p>
          </div>

          <div className="grid gap-6">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="flex gap-4 items-start">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 shrink-0">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">
                    {benefit.title}
                  </h3>
                  <p className="text-gray-500">{benefit.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Card className="w-full shadow-lg border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle className="text-2xl">Instructor Application</CardTitle>
            <CardDescription>
              Tell us a bit about yourself and what you plan to teach.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Why do you want to teach on PathOS?
              </label>
              <Textarea
                placeholder="I have 5 years of experience in..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={isSubmitting}
                className="min-h-37.5 resize-none focus-visible:ring-primary"
              />
              <p className="text-xs text-muted-foreground text-right">
                {reason.length} characters
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-md flex gap-3 items-start">
              <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
              <p className="text-sm text-blue-700">
                By submitting, you agree to our Instructor Terms and Community
                Guidelines.
              </p>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !reason.trim()}
              className="w-full text-lg h-12"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </CardContent>
          <CardFooter className="justify-center border-t p-4 bg-gray-50">
            <p className="text-xs text-muted-foreground">
              We usually respond within 2-3 business days.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default BecomeInstructor;
