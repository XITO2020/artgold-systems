import { Card } from "ù/card";
import { Button } from "ù/button";
import { Play, Pause } from "lucide-react";

export function VideoShowcase() {
  const videos = ['video1.mp4', 'video2.mp4', 'video3.mp4']; // Remplacez par vos fichiers réels

  return (
    <div className="grid grid-cols-2 gap-6">
      {videos.map((video, i) => (
        <Card key={i} className="overflow-hidden">
          <div className="aspect-video relative bg-black">
            <video
              src={`/videos/${video}`}
              className="w-full h-full object-cover"
              controls
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <Button size="icon" variant="secondary">
                <Play className="h-8 w-8" />
              </Button>
            </div>
          </div>
          <div className="p-4">
            <h3 className="font-semibold">Video Project {i + 1}</h3>
            <p className="text-sm text-muted-foreground">Short description</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
