"use client";

import { useState, Suspense } from "react";
import { Card } from "ù/card";
import { Button } from "ù/button";
import { ScriptEditor } from "ç/dubbing/ScriptEditor";
import { DubbingGridModal } from "ç/modals/dubbing/DubbingGridModal";
import { TopDubbingGrid } from "ç/dubbing/TopDubbingGrid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "ù/tabs";
import { useTheme } from 'ç/theme/ThemeContext';

// Sample data with correct type
const sampleContent: Array<{
  id: string;
  title: string;
  thumbnail: string;
  likes: number;
  type: "dubbed" | "subtitled";
  duration: string;
}> = [
  {
    id: "1",
    title: "Japanese Classic Scene",
    thumbnail: "https://images.unsplash.com/photo-1578950435899-d1c1bf932ab2",
    likes: 850,
    type: "dubbed",
    duration: "2:30"
  },
  {
    id: "2",
    title: "Anime Episode 1",
    thumbnail: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5",
    likes: 720,
    type: "subtitled",
    duration: "3:45"
  }
];

export default function DubbingPage() {
  const [showDubbingGrid, setShowDubbingGrid] = useState(false);
  const [mode, setMode] = useState<"dubbed" | "subtitled">("dubbed");
  const [isComplete, setIsComplete] = useState(false);
  const { theme } = useTheme();

  const handleComplete = () => {
    setIsComplete(true);
    // Additional completion logic here
  };

  return (
    <div className={`container mx-auto py-8 ${theme}`} style={{background:"var(--sidebar)"}}>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-primary">Movie Dubbing & Subs</h1>
        <div className="flex gap-4">
          <Button 
            variant="accentOne"
            onClick={() => setShowDubbingGrid(true)}
          >
            Switch to &nbsp; <span>{ mode === "dubbed" ? "SUBTITLING": "DUBBING"}</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 mb-16">
        <div>
          <Card className="aspect-video bg-black mb-4">
            <video
              src="/videos/sample-scene.mp4"
              className="w-full h-full object-cover"
              controls
            />
          </Card>
          <p className="text-sm text-muted-foreground">
            Add your voice or use AI voices to dub this scene. You can add up to 10 lines.
          </p>
        </div>

        <div>
          <ScriptEditor 
            mode={mode}
            onComplete={handleComplete}
          />
        </div>
      </div>

      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-8">Top 1000 Dubbed Videos</h2>
        <Suspense fallback={<div>Loading top videos...</div>}>
          <TopDubbingGrid />
        </Suspense>
      </div>

      <DubbingGridModal 
        isOpen={showDubbingGrid}
        onClose={() => setShowDubbingGrid(false)}
        content={sampleContent}
      />
    </div>
  );
}