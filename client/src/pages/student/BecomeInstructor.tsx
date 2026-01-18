import { useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { requestToBeInstructorService } from "@/service";

const BecomeInstructor = () => {
  const { user } = useUser();
  const [reason, setReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user || !user?.primaryEmailAddress) return;
    setIsSubmitting(true);

    try {
      await requestToBeInstructorService({
        userId: user.id,
        email: user.primaryEmailAddress?.emailAddress,
        userName:
          user.fullName ||
          user.username ||
          user.primaryEmailAddress?.emailAddress?.split("@")[0],
        reason: reason,
      });
      toast.success("Application submitted! An admin will review it shortly.");
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to submit application",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[80vh] p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Become an Instructor</CardTitle>
          <CardDescription>
            Share your knowledge with the world. Apply to become an instructor
            on PathOS.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Why do you want to teach?
            </label>
            <Textarea
              placeholder="Tell us about your experience and what you plan to teach..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !reason.trim()}
            className="w-full"
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default BecomeInstructor;
