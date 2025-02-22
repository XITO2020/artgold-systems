import { Card } from "ù/card";
import { Button } from "ù/button";
import { Input } from "ù/input";
import { Label } from "ù/label";
import { Textarea } from "ù/textarea";
import { MapPin, Upload } from "lucide-react";

export default function UploadPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Convert Your Art</h1>
      <Card className="max-w-2xl mx-auto p-6">
        <form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Artwork Title</Label>
            <Input id="title" placeholder="Enter the title of your artwork" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your artwork..."
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-2">
            <Label>Upload Images</Label>
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">
                Drag and drop your images here, or click to select files
              </p>
              <Button variant="secondary">Select Files</Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Location</Label>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <Button variant="outline" size="sm">
                Set Location
              </Button>
            </div>
          </div>

          <Button className="w-full" size="lg">
            Submit for Validation
          </Button>

          <p className="text-sm text-muted-foreground text-center">
            By submitting, you agree to our validation process and community guidelines
          </p>
        </form>
      </Card>
    </div>
  );
}