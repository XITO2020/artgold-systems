"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@ui/card";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Textarea } from "@ui/textarea";
import { Label } from "@ui/label";
import { VideoChapterEditor } from "@comp/admin/video-chapter-editor";
import { Switch } from "@ui/switch";
import { Video, FileText, Image as ImageIcon } from "lucide-react";
import { useToast } from "@hooks/use-toast";
import type { VideoChapter } from "@t/article";

export default function NewArticlePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"video" | "text">("video");
  const [coverImage, setCoverImage] = useState<File | null>(null);

  // ⚠️ Ceci est le contenu principal de l’article (pas un chapitre)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "", // corps principal de l’article
    tags: "",
    chapters: [] as VideoChapter[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload cover image si besoin
      let coverImageUrl: string | undefined;
      if (coverImage) {
        const fd = new FormData();
        fd.append("file", coverImage);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
        const { url } = await uploadRes.json();
        coverImageUrl = url;
      }

      // Crée l’article
      const res = await fetch("/api/admin/articles/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          coverImage: coverImageUrl,
          tags: formData.tags.split(",").map((t) => t.trim()),
        }),
      });

      if (!res.ok) throw new Error("Failed to create article");

      toast({ title: "Success", description: "Article created successfully" });
      router.push("/admin/articles");
    } catch {
      toast({ title: "Error", description: "Failed to create article", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const addChapter = () => {
    setFormData((prev) => ({
      ...prev,
      chapters: [
        ...prev.chapters,
        {
          id: (globalThis.crypto?.randomUUID?.() ?? `${Date.now()}`),
          title: "",
          textContent: "", // ← texte du chapitre
          videoUrl: "",     // ← URL vidéo (à remplir après upload)
          thumbnail: "",
          duration: 0,
        },
      ],
    }));
  };

  const updateChapter = (index: number, chapter: VideoChapter) => {
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.map((ch, i) => (i === index ? chapter : ch)),
    }));
  };

  const removeChapter = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      chapters: prev.chapters.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="container max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Article</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card className="p-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData((p) => ({ ...p, title: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Main Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData((p) => ({ ...p, content: e.target.value }))}
                className="min-h-[200px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData((p) => ({ ...p, tags: e.target.value }))}
                placeholder="tag1, tag2, tag3"
              />
            </div>

            <div className="space-y-2">
              <Label>Cover Image</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                {coverImage ? (
                  <div className="space-y-2">
                    <p>{coverImage.name}</p>
                    <Button type="button" variant="outline" onClick={() => setCoverImage(null)}>
                      Remove
                    </Button>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-2">Upload a cover image</p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && setCoverImage(e.target.files[0])}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Chapters</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Video className={`h-5 w-5 ${viewMode === "video" ? "text-primary" : "text-muted-foreground"}`} />
                <Switch
                  checked={viewMode === "text"}
                  onCheckedChange={(checked: boolean) => setViewMode(checked ? "text" : "video")}
                />
                <FileText className={`h-5 w-5 ${viewMode === "text" ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <Button type="button" variant="outline" onClick={addChapter} disabled={formData.chapters.length >= 8}>
                Add Chapter
              </Button>
            </div>
          </div>

          {formData.chapters.map((chapter, index) => (
            <VideoChapterEditor
              key={chapter.id || index}
              chapter={chapter}             // ← déjà le bon type
              viewMode={viewMode}
              onChange={(updated) => updateChapter(index, {
                ...updated,
                // on s’assure que tout reste défini pour éviter les lints `string | undefined`
                id: updated.id || (chapter.id ?? `${index}`),
                title: updated.title ?? "",
                textContent: updated.textContent ?? "",
                videoUrl: updated.videoUrl ?? "",
                thumbnail: updated.thumbnail ?? "",
                duration: typeof updated.duration === "number" ? updated.duration : 0,
              })}
              onRemove={() => removeChapter(index)}
            />
          ))}
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Article"}
          </Button>
        </div>
      </form>
    </div>
  );
}
