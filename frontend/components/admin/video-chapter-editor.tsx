// components/admin/video-chapter-editor.tsx
import React, { useState } from "react";
import { Card } from "@ui/card";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Textarea } from "@ui/textarea";
import { Label } from "@ui/label";
import { Trash, Upload } from "lucide-react";
import type { VideoChapter } from "@t/article";


interface VideoChapterEditorProps {
  chapter: VideoChapter;
  viewMode: "video" | "text";
  onChange: (chapter: VideoChapter) => void;
  onRemove: () => void;
}

export function VideoChapterEditor({
  chapter,
  viewMode,
  onChange,
  onRemove
}: VideoChapterEditorProps) {
  const [uploading, setUploading] = useState(false);

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      // Implement video upload logic here
      // const videoUrl = await uploadVideo(file);
      // const thumbnail = await generateThumbnail(file);
      // const duration = await getVideoDuration(file);
      // onChange({
      //   ...chapter,
      //   videoUrl,
      //   thumbnail,
      //   duration,
      // });
    } catch (error) {
      console.error("Error uploading video:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2 flex-1">
            <Label htmlFor={`chapter-${chapter.id}-title`}>Chapter Title</Label>
            <Input
              id={`chapter-${chapter.id}-title`}
              value={chapter.title}
              onChange={(e) => onChange({ ...chapter, title: e.target.value })}
            />
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={onRemove}
            className="ml-4"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>

        {viewMode === "video" ? (
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              {chapter.videoUrl ? (
                <video
                  src={chapter.videoUrl}
                  controls
                  className="max-h-[200px] mx-auto"
                />
              ) : (
                <>
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-2">
                    Upload a video (max 1 minute)
                  </p>
                  <Button
                    variant="secondary"
                    disabled={uploading}
                    onClick={() => document.getElementById(`video-${chapter.id}`)?.click()}
                  >
                    {uploading ? "Uploading..." : "Select Video"}
                  </Button>
                  <input
                    type="file"
                    id={`video-${chapter.id}`}
                    accept="video/*"
                    className="hidden"
                    onChange={handleVideoUpload}
                  />
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor={`chapter-${chapter.id}-content`}>Text Content</Label>
            <Textarea
              id={`chapter-${chapter.id}-content`}
              value={chapter.textContent || ''}
              onChange={(e) => onChange({ ...chapter, textContent: e.target.value })}
              className="min-h-[200px]"
            />
          </div>
        )}
      </div>
    </Card>
  );
}
