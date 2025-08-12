"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { Card } from "ù/card";
import { Button } from "ù/button";
import { Input } from "ù/input";
import { Textarea } from "ù/textarea";
import { Label } from "ù/label";
import { VideoChapterEditor } from "ç/admin/video-chapter-editor";
import { Switch } from "ù/switch";
import { Video, FileText } from "lucide-react";
import type { Article, VideoChapter } from "T/article";

export default function EditArticlePage({ params }: { params: { id: string } }) {
  const [viewMode, setViewMode] = useState<"video" | "text">("video");
  const { register, handleSubmit, watch } = useForm<Article>();
  const [chapters, setChapters] = useState<VideoChapter[]>([]);

  const onSubmit = async (data: Article) => {
    // Handle article submission with chapters
    console.log({ ...data, chapters });
  };

  const addChapter = () => {
    setChapters([
      ...chapters,
      {
        id: `ch${chapters.length + 1}`,
        title: "",
        videoUrl: "",
        thumbnail: "",
        duration: 0,
        textContent: ""
      }
    ]);
  };

  const updateChapter = (index: number, chapter: VideoChapter) => {
    const newChapters = [...chapters];
    newChapters[index] = chapter;
    setChapters(newChapters);
  };

  const removeChapter = (index: number) => {
    setChapters(chapters.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Edit Article</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Video className={`h-5 w-5 ${viewMode === "video" ? "text-primary" : "text-muted-foreground"}`} />
            <Switch
              checked={viewMode === "text"}
              onCheckedChange={(checked) => setViewMode(checked ? "text" : "video")}
            />
            <FileText className={`h-5 w-5 ${viewMode === "text" ? "text-primary" : "text-muted-foreground"}`} />
          </div>
          <Button type="submit" form="article-form">Save Changes</Button>
        </div>
      </div>

      <form id="article-form" onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...register("title")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                {...register("description")}
              />
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Chapters</h2>
            <Button
              type="button"
              variant="outline"
              onClick={addChapter}
              disabled={chapters.length >= 8}
            >
              Add Chapter
            </Button>
          </div>

          {chapters.map((chapter, index) => (
            <VideoChapterEditor
              key={chapter.id}
              chapter={chapter}
              viewMode={viewMode}
              onChange={(updated) => updateChapter(index, updated)}
              onRemove={() => removeChapter(index)}
            />
          ))}
        </div>
      </form>
    </div>
  );
}