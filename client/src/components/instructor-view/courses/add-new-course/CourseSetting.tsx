import { useInstructorContext } from "@/contexts/Instructor/hook";
import { UploadMediaService } from "@/service";
import MediaProgressBar from "@/components/media-progress-bar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon } from "lucide-react";

function CourseSetting() {
  const {
    courseLandingFormData,
    setCourseLandingFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercent,
    setMediaUploadProgressPercent,
  } = useInstructorContext();

  async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      const imageFormData = new FormData();
      imageFormData.append("file", selectedFile);
      try {
        setMediaUploadProgress(true);

        const data = await UploadMediaService(
          imageFormData,
          setMediaUploadProgressPercent,
        );

        if (!data) return;

        const updatedCourseLandingData = {
          ...courseLandingFormData,
          image: data.url,
        };
        setCourseLandingFormData(updatedCourseLandingData);
      } catch (error) {
        console.error("Failed to upload image:", error);
      } finally {
        setMediaUploadProgress(false);
      }
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Course Settings</CardTitle>
      </CardHeader>
      {mediaUploadProgress && (
        <div className="mt-4 px-3">
          <MediaProgressBar
            isMediaUploading={mediaUploadProgress}
            progress={mediaUploadProgressPercent}
          />
        </div>
      )}
      <CardContent>
        <div className="flex flex-col gap-3">
          <Label>Upload Course Image</Label>
          {courseLandingFormData.image ? (
            <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-md border bg-muted">
              <img
                src={courseLandingFormData.image}
                alt="Course cover"
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex aspect-video w-full max-w-md items-center justify-center rounded-md border border-dashed bg-muted text-muted-foreground">
              <ImageIcon className="h-10 w-10" />
            </div>
          )}
          <Input
            type="file"
            accept="image/*"
            onChange={(e) => {
              handleImageUpload(e);
            }}
            className="mb-4"
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseSetting;
