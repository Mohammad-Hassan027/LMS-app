import { useRef, useState, lazy, Suspense } from "react";
import { toast } from "sonner";
import { Upload } from "lucide-react";
import { useInstructorContext } from "@/contexts/Instructor/hook";
import {
  DeleteMediaService,
  UploadBulkMediaService,
  UploadMediaService,
} from "@/service";
const MediaProgressBar = lazy(() => import("@/components/media-progress-bar"));
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
const Player = lazy(() => import("@/components/video-player"));
import { AlertDialogDestructive } from "./AlertDialogDestructive";

function CourseCurriculum() {
  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercent,
    setMediaUploadProgressPercent,
  } = useInstructorContext();

  const bulkUploadRef = useRef<HTMLInputElement>(null);

  const [activeDialog, setActiveDialog] = useState<{
    index: number;
    type: "delete" | "replace";
  } | null>(null);

  function handleAddLecture() {
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      {
        title: "",
        videoUrl: "",
        isFreePreview: false,
        public_id: "",
      },
    ]);
  }

  function handleCourseTitleChange(
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) {
    const updatedCurriculum = [...courseCurriculumFormData];
    updatedCurriculum[index] = {
      ...updatedCurriculum[index],
      [event.currentTarget.id]: event.target.value,
    };
    setCourseCurriculumFormData(updatedCurriculum);
  }

  function handleCourseIsFreePreviewChange(
    currentValue: boolean,
    index: number,
  ) {
    const cpyCurriculumFormData = [...courseCurriculumFormData];
    cpyCurriculumFormData[index] = {
      ...cpyCurriculumFormData[index],
      isFreePreview: currentValue,
    };
    setCourseCurriculumFormData(cpyCurriculumFormData);
  }

  async function handleSingleLectureUpload(
    event: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      const videoFormData = new FormData();
      videoFormData.append("file", selectedFile);
      try {
        setMediaUploadProgress(true);
        const data = await UploadMediaService(
          videoFormData,
          setMediaUploadProgressPercent,
        );
        if (!data) return;

        const updatedCurriculum = [...courseCurriculumFormData];
        updatedCurriculum[index] = {
          ...updatedCurriculum[index],
          videoUrl: data.url,
          public_id: data.public_id,
        };
        setCourseCurriculumFormData(updatedCurriculum);
        toast.success("Lecture uploaded successfully");
      } catch (error) {
        toast.error("Error occured while uploading.");
        console.error("Failed to upload video:", error);
      } finally {
        setMediaUploadProgress(false);
      }
    }
  }

  async function handleReplaceVideo(index: number) {
    const publicId = courseCurriculumFormData[index]?.public_id;
    try {
      if (publicId) {
        toast.promise(DeleteMediaService(publicId, "video"), {
          loading: "Removing old video...",
          success: `Video removed successfully.`,
          error: "Error occured while deleting.",
        });
      }

      const updatedCurriculum = [...courseCurriculumFormData];
      updatedCurriculum[index] = {
        ...updatedCurriculum[index],
        videoUrl: "",
        public_id: "",
      };
      setCourseCurriculumFormData(updatedCurriculum);
    } catch (error) {
      console.log("Failed to delete video", error);
    } finally {
      setActiveDialog(null);
    }
  }

  async function handleDeleteLecture(index: number) {
    const publicId = courseCurriculumFormData[index]?.public_id;
    try {
      if (publicId) {
        toast.promise(DeleteMediaService(publicId, "video"), {
          loading: "Deleting video...",
          success: "Lecture video deleted.",
          error: "Failed to delete video",
        });
      }

      const cpyCurriculumFormData = courseCurriculumFormData.filter(
        (_, i) => i !== index,
      );
      setCourseCurriculumFormData(cpyCurriculumFormData);
    } catch (error) {
      console.log("Failed to delete Lecture", error);
    } finally {
      setActiveDialog(null);
    }
  }

  function isCurriculumFormDataVaild() {
    return courseCurriculumFormData.every((item) => {
      return (
        item &&
        typeof item === "object" &&
        item.title.trim() !== "" &&
        item.videoUrl.trim() !== ""
      );
    });
  }

  async function handleBulkUploadMedia(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    if (!event.target.files) return;
    const selectedFiles = Array.from(event.target.files);
    const bulkFormData = new FormData();

    selectedFiles.forEach((fileItem) => bulkFormData.append("files", fileItem));

    try {
      setMediaUploadProgress(true);
      const data = await UploadBulkMediaService(
        bulkFormData,
        setMediaUploadProgressPercent,
      );
      if (data) {
        let cpyCurriculum = [...courseCurriculumFormData];

        // Optional: clear if the only item is an empty initial lecture
        if (
          cpyCurriculum.length === 1 &&
          cpyCurriculum[0].title === "" &&
          cpyCurriculum[0].videoUrl === ""
        ) {
          cpyCurriculum = [];
        }

        data.forEach((mediaItem) => {
          cpyCurriculum.push({
            title: `Lecture ${cpyCurriculum.length + 1}`,
            videoUrl: mediaItem.url,
            public_id: mediaItem.public_id,
            isFreePreview: false,
          });
        });

        setCourseCurriculumFormData(cpyCurriculum);
        toast.success("Bulk lectures uploaded successfully");
      }
    } catch (error) {
      toast.error("Error occured while uploading.");
      console.log("Failed to upload videos", error);
    } finally {
      setMediaUploadProgress(false);
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <CardTitle>Course Curriculum</CardTitle>
        <div className="w-full sm:w-auto">
          <input
            type="file"
            ref={bulkUploadRef}
            accept="video/*"
            multiple
            className="hidden"
            id="bulk-media-upload"
            onChange={handleBulkUploadMedia}
          />
          <Button
            className="cursor-pointer"
            variant="outline"
            onClick={() => bulkUploadRef.current?.click()}
          >
            <Upload className="w-4 h-5 mr-2" />
            Bulk Upload
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Button
          disabled={!isCurriculumFormDataVaild() || mediaUploadProgress}
          onClick={handleAddLecture}
        >
          Add Lectures
        </Button>

        {mediaUploadProgress && (
          <div className="mt-4">
            <Suspense fallback={<Skeleton className="h-8 w-full" />}>
              <MediaProgressBar
                isMediaUploading={mediaUploadProgress}
                progress={mediaUploadProgressPercent}
              />
            </Suspense>
          </div>
        )}

        <div className="mt-4 space-y-4">
          {courseCurriculumFormData.map((curriculumItem, index) => (
            <div
              className="border p-3 sm:p-5 rounded-md"
              key={curriculumItem.public_id || index}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
                <h3 className="font-medium text-sm whitespace-nowrap">
                  Lecture {index + 1}
                </h3>
                <Input
                  type="text"
                  value={curriculumItem.title}
                  id="title"
                  placeholder="Lecture Title"
                  className="w-full sm:max-w-96"
                  onChange={(e) => handleCourseTitleChange(e, index)}
                />
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={curriculumItem.isFreePreview}
                    id={`freePreview-${index + 1}`}
                    onCheckedChange={(value) =>
                      handleCourseIsFreePreviewChange(value, index)
                    }
                  />
                  <Label htmlFor={`freePreview-${index + 1}`}>
                    Free Preview
                  </Label>
                </div>
              </div>

              <div className="mt-4">
                {curriculumItem.videoUrl ? (
                  <div className="flex flex-col md:flex-row gap-3">
                    <Suspense fallback={<Skeleton className="h-36 w-full" />}>
                      <Player url={curriculumItem.videoUrl} />
                    </Suspense>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        variant="destructive"
                        className="w-full sm:w-auto"
                        onClick={() =>
                          setActiveDialog({ index, type: "replace" })
                        }
                      >
                        Replace Video
                      </Button>

                      <Button
                        className="bg-red-800 w-full sm:w-auto"
                        variant="destructive"
                        onClick={() =>
                          setActiveDialog({ index, type: "delete" })
                        }
                      >
                        Delete Lecture
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Input
                    type="file"
                    accept="video/*"
                    className="mb-4 w-full"
                    onChange={(e) => handleSingleLectureUpload(e, index)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {activeDialog !== null && (
          <AlertDialogDestructive
            isOpen={true}
            setIsOpen={() => setActiveDialog(null)}
            title={courseCurriculumFormData[activeDialog.index]?.title}
            isDelete={activeDialog.type === "delete"}
            onConfirm={() => {
              if (activeDialog.type === "delete") {
                handleDeleteLecture(activeDialog.index);
              } else {
                handleReplaceVideo(activeDialog.index);
              }
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}

export default CourseCurriculum;
