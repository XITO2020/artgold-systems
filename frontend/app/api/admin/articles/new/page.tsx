// api/admin/articles/new/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "ù/card";
import { Button } from "ù/button";
import { Input } from "ù/input";
import { Textarea } from "ù/textarea";
import { Label } from "ù/label";
import { VideoChapterEditor } from "@comp/admin/video-chapter-editor";
import { Switch } from "ù/switch";
import { Video, FileText, Image as ImageIcon } from "lucide-react";
import { useToast } from "#//use-toast";

/**
 * 
    Utilité : Ce composant permet aux administrateurs de créer de nouveaux articles. Il gère l'upload des images de couverture et les envoie à l'API pour obtenir un CID.
    Corrections : Assurez-vous que le composant gère correctement l'upload des fichiers et envoie les données à l'API pour créer un nouvel article.

 */

interface Chapter {
  id?: string; // Ajoutez l'ID pour correspondre à VideoChapter
  title: string;
  content: string;
  videoUrl?: string;
  thumbnail?: string;
  duration?: number;
  textContent?: string; // Ajoutez textContent pour correspondre à VideoChapter
}

export default function NewArticlePage() {
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"video" | "text">("video");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    content: "",
    tags: "",
    chapters: [] as Chapter[]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Upload cover image if exists
      let coverImageUrl;
      if (coverImage) {
        const formData = new FormData();
        formData.append('file', coverImage);
        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        const { url } = await uploadRes.json();
        coverImageUrl = url;
      }

      // Create article
      const res = await fetch('/api/admin/articles/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          coverImage: coverImageUrl,
          tags: formData.tags.split(',').map(t => t.trim()),
        })
      });

      if (!res.ok) throw new Error('Failed to create article');

      toast({
        title: "Success",
        description: "Article created successfully",
      });

      router.push('/admin/articles');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create article",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addChapter = () => {
    setFormData(prev => ({
      ...prev,
      chapters: [
        ...prev.chapters,
        { title: "", content: "", textContent: "" } // Ajoutez textContent
      ]
    }));
  };

  const updateChapter = (index: number, chapter: Chapter) => {
    setFormData(prev => ({
      ...prev,
      chapters: prev.chapters.map((ch, i) =>
        i === index ? chapter : ch
      )
    }));
  };

  const removeChapter = (index: number) => {
    setFormData(prev => ({
      ...prev,
      chapters: prev.chapters.filter((_, i) => i !== index)
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
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Main Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={e => setFormData(prev => ({ ...prev, content: e.target.value }))}
                className="min-h-[200px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={e => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="tag1, tag2, tag3"
              />
            </div>

            <div className="space-y-2">
              <Label>Cover Image</Label>
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                {coverImage ? (
                  <div className="space-y-2">
                    <p>{coverImage.name}</p>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setCoverImage(null)}
                    >
                      Remove
                    </Button>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground mb-2">
                      Upload a cover image
                    </p>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={e => e.target.files?.[0] && setCoverImage(e.target.files[0])}
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
                  onCheckedChange={(checked) => setViewMode(checked ? "text" : "video")}
                />
                <FileText className={`h-5 w-5 ${viewMode === "text" ? "text-primary" : "text-muted-foreground"}`} />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={addChapter}
                disabled={formData.chapters.length >= 8}
              >
                Add Chapter
              </Button>
            </div>
          </div>

          {formData.chapters.map((chapter, index) => (
            <VideoChapterEditor
              key={index}
              chapter={chapter}
              viewMode={viewMode}
              onChange={(updated) => updateChapter(index, updated)}
              onRemove={() => removeChapter(index)}
            />
          ))}
        </div>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
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
