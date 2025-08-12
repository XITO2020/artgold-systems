"use client";

import { useForm } from "react-hook-form";
import { Card } from "@ui/card";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Textarea } from "@ui/textarea";
import { Label } from "@ui/label";

export default function EditArticlePage() {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data: any) => {
    // Handle article submission
    console.log(data);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Edit Article</h1>

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" {...register("title")} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              {...register("content")}
              className="min-h-[300px]"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline">
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}