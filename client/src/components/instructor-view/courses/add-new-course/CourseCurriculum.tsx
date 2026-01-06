import { toast } from "sonner";
import { useInstructorContext } from "@/contexts/Instructor/hook";
import {
  DeleteMediaService,
  UploadBulkMediaService,
  UploadMediaService,
} from "@/service";
import MediaProgressBar from "@/components/media-progress-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import Player from "@/components/video-player";
import { useRef } from "react";
import { Upload } from "lucide-react";
import type { CourseCurriculumFormType } from "@/contexts/Instructor/hook";

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

  function handleAddLecture() {
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      { title: "", videoUrl: "", isFreePreview: false, public_id: "" },
    ]);
  }

  function handleCourseTitleChange(
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
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
    index: number
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
    index: number
  ) {
    const selectedFile = event.target.files?.[0];

    if (selectedFile) {
      const videoFormData = new FormData();
      videoFormData.append("file", selectedFile);
      try {
        setMediaUploadProgress(true);

        const data = await UploadMediaService(
          videoFormData,
          setMediaUploadProgressPercent
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

  async function handleReplaceVideo(publicId: string, index: number) {
    try {
      toast.promise(async () => await DeleteMediaService(publicId, "video"), {
        loading: "Loading...",
        success: `Lecture ${index} deleted successfully.`,
        error: "Error occured while deleting.",
      });

      const updatedCurriculum = [...courseCurriculumFormData];
      updatedCurriculum[index] = {
        ...updatedCurriculum[index],
        videoUrl: "",
        public_id: "",
      };
      setCourseCurriculumFormData(updatedCurriculum);
    } catch (error) {
      console.log("Failed to delete video", error);
    }
  }

  async function handleDeleteLecture(publicId: string, index: number) {
    try {
      toast.promise(async () => await DeleteMediaService(publicId, "video"), {
        loading: "Loading...",
        success: `Lecture ${index} deleted successfully.`,
        error: "Error occured while deleting.",
      });

      const cpyCurriculumFormData = courseCurriculumFormData.filter((_, i) => {
        return i !== index;
      });
      setCourseCurriculumFormData(cpyCurriculumFormData);
    } catch (error) {
      console.log("Failed to delete Lecture", error);
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

  function handleOpenBulkUpload() {
    bulkUploadRef.current?.click();
  }

  function areAllCourseCurriculumFormDataObjectsEmpty(
    arr: CourseCurriculumFormType
  ) {
    return arr.every((obj) => {
      return Object.entries(obj).every(([, value]) => {
        if (typeof value === "boolean") {
          return true;
        }

        return value === "";
      });
    });
  }

  async function handleBulkUploadMedia(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!event.target.files) {
      console.log(event.target.files, "e");
      return;
    }
    const selectedFiles = Array.from(event.target.files);
    const bulkFormData = new FormData();
    if (selectedFiles) {
      selectedFiles.forEach((fileItem) =>
        bulkFormData.append("files", fileItem)
      );
      try {
        setMediaUploadProgress(true);

        const data = await UploadBulkMediaService(
          bulkFormData,
          setMediaUploadProgressPercent
        );
        if (data) {
          console.log(data, "data");

          const cpyCurriculum = areAllCourseCurriculumFormDataObjectsEmpty(
            courseCurriculumFormData
          )
            ? []
            : [...courseCurriculumFormData];

          data.forEach((mediaItem, index) => {
            cpyCurriculum.push({
              title: `Lecture ${cpyCurriculum.length + 1 + index}`,
              videoUrl: mediaItem.url,
              public_id: mediaItem.public_id,
              isFreePreview: false,
            });
            console.log(mediaItem, "mediaItem");
          });

          setCourseCurriculumFormData(cpyCurriculum);
          toast.success("Lecture uploaded successfully");
        }
      } catch (error) {
        toast.error("Error occured while uploading.");
        console.error("Failed to upload video:", error);
      } finally {
        setMediaUploadProgress(false);
      }
    }
  }

  return (
    <Card>
      <CardHeader className="flex justify-between">
        <CardTitle>Course Curriculum</CardTitle>
        <div>
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
            onClick={handleOpenBulkUpload}
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
            <MediaProgressBar
              isMediaUploading={mediaUploadProgress}
              progress={mediaUploadProgressPercent}
            />
          </div>
        )}
        <div className="mt-4 space-y-4">
          {courseCurriculumFormData.map((_curriculumItem, index) => (
            <div className="border p-3 sm:p-5 rounded-md" key={index}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-5">
                <h3 className="font-medium text-sm">Lecture {index + 1}</h3>
                <Input
                  type="text"
                  value={courseCurriculumFormData[index]?.title}
                  id="title"
                  placeholder="Lecture Title"
                  className="max-w-96"
                  onChange={(e) => {
                    handleCourseTitleChange(e, index);
                  }}
                />
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={courseCurriculumFormData[index]?.isFreePreview}
                    id={`freePreview-${index + 1}`}
                    onCheckedChange={(value) => {
                      handleCourseIsFreePreviewChange(value, index);
                    }}
                  />
                  <Label htmlFor={`freePreview-${index + 1}`}>
                    Free Preview
                  </Label>
                </div>
              </div>
              <div className="mt-4">
                {courseCurriculumFormData[index]?.videoUrl ? (
                  <div className="flex flex-col md:flex-row gap-3">
                    {/* <video
                      src={courseCurriculumFormData[index]?.videoUrl}
                      controls
                      className="mb-4 max-w-md"
                    /> */}
                    <Player url={courseCurriculumFormData[index]?.videoUrl} />
                    <div className="flex gap-3">
                      <Button
                        onClick={() =>
                          handleReplaceVideo(
                            courseCurriculumFormData[index]?.public_id,
                            index
                          )
                        }
                      >
                        Replace Video
                      </Button>
                      <Button
                        className="bg-red-800"
                        onClick={() =>
                          handleDeleteLecture(
                            courseCurriculumFormData[index]?.public_id,
                            index
                          )
                        }
                      >
                        Delete Lecture
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Input
                    id="videoUrl"
                    type="file"
                    accept="video/*"
                    className="mb-4"
                    onChange={(e) => handleSingleLectureUpload(e, index)}
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseCurriculum;
