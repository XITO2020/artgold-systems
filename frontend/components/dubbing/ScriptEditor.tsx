import { useState, useEffect } from 'react';
import { Card } from "@ui/card";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Textarea } from "@ui/textarea";
import { Label } from "@ui/label";
import { VoiceRecorder } from "./VoiceRecorder";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@ui/select";
import { Mic, Type, Save, Download, Share, Upload } from "lucide-react";
import { useToast } from "#/use-toast";
import { pinFileToIPFS } from '$/services/pinataServices';
import { ShareModal } from '../modals/dubbing/ShareModal';

export interface ScriptEditorProps {
  mode: "dubbed" | "subtitled";
  onComplete: () => void;
}

interface ScriptLine {
  id: number;
  text: string;
  audioBlob?: Blob;
  aiVoice?: string;
  startTime?: number;
  endTime?: number;
}

export function ScriptEditor({ mode, onComplete }: ScriptEditorProps) {
  const [lines, setLines] = useState<ScriptLine[]>([{ id: 1, text: "" }]);
  const [isComplete, setIsComplete] = useState(false);
  const [finalVideo, setFinalVideo] = useState<Blob | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleTextChange = (id: number, text: string) => {
    setLines(lines.map(line =>
      line.id === id ? { ...line, text } : line
    ));
  };

  const handleRecording = (id: number, blob: Blob) => {
    setLines(lines.map(line =>
      line.id === id ? { ...line, audioBlob: blob } : line
    ));
  };

  const handleTimeChange = (id: number, startTime: number, endTime: number) => {
    setLines(lines.map(line =>
      line.id === id ? { ...line, startTime, endTime } : line
    ));
  };

  const addLine = () => {
    if (lines.length < 10) {
      setLines([...lines, { id: lines.length + 1, text: "" }]);
    }
  };

  const handleSubmitAsArtwork = async () => {
    if (!finalVideo) {
      toast({
        title: "Error",
        description: "Please generate the final video first",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert Blob to Buffer
      const arrayBuffer = await finalVideo.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload to IPFS
      const response = await pinFileToIPFS(
        buffer,
        `${mode}-content-${Date.now()}.mp4`,
        {
          type: mode,
          lines: lines.length,
          timestamp: Date.now()
        }
      );

      // Register as artwork
      const artworkResponse = await fetch('/api/artwork/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${mode === 'dubbed' ? 'Dubbed' : 'Subtitled'} Content`,
          description: lines[0].text,
          category: mode === 'dubbed' ? 'dubbing' : 'subtitles',
          ipfsCid: response.IpfsHash
        })
      });

      if (!artworkResponse.ok) {
        throw new Error('Failed to register as artwork');
      }

      toast({
        title: "Success",
        description: "Content registered as artwork successfully",
      });

      onComplete();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit as artwork",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownload = () => {
    if (!finalVideo) {
      toast({
        title: "Error",
        description: "Please generate the final video first",
        variant: "destructive"
      });
      return;
    }

    const url = URL.createObjectURL(finalVideo);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${mode}-content-${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const checkCompletion = () => {
    const isComplete = lines.every(line => {
      if (mode === 'dubbed') {
        return line.text && (line.audioBlob || line.aiVoice);
      } else {
        return line.text && line.startTime !== undefined && line.endTime !== undefined;
      }
    });

    setIsComplete(isComplete);
  };

  useEffect(() => {
    checkCompletion();
  }, [lines]);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">
          {mode === 'dubbed' ? 'Voice Recording' : 'Subtitle Editor'}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
            disabled={!finalVideo}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsShareModalOpen(true)}
            disabled={!finalVideo}
          >
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleSubmitAsArtwork}
            disabled={!finalVideo || isSubmitting}
          >
            <Upload className="h-4 w-4 mr-2" />
            Submit as Artwork
          </Button>
        </div>
      </div>

      {lines.map((line) => (
        <Card key={line.id} className="p-4 space-y-4">
          <div className="flex gap-4">
            <span className="text-2xl font-bold text-muted-foreground">
              {line.id}
            </span>
            <div className="flex-1 space-y-4">
              <Textarea
                value={line.text}
                onChange={(e) => handleTextChange(line.id, e.target.value)}
                placeholder={`Enter ${mode === 'dubbed' ? 'script' : 'subtitle'} line...`}
              />

              {mode === 'dubbed' ? (
                <div className="flex items-center gap-4">
                  <Select>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select AI voice" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male1">Male Voice 1</SelectItem>
                      <SelectItem value="female1">Female Voice 1</SelectItem>
                      <SelectItem value="male2">Male Voice 2</SelectItem>
                      <SelectItem value="female2">Female Voice 2</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-muted-foreground">or</span>
                  <VoiceRecorder onRecordingComplete={(blob) => handleRecording(line.id, blob)} />
                </div>
              ) : (
                <div className="flex gap-4">
                  <Input
                    type="number"
                    placeholder="Start time (s)"
                    onChange={(e) => handleTimeChange(
                      line.id,
                      parseFloat(e.target.value),
                      line.endTime || 0
                    )}
                  />
                  <Input
                    type="number"
                    placeholder="End time (s)"
                    onChange={(e) => handleTimeChange(
                      line.id,
                      line.startTime || 0,
                      parseFloat(e.target.value)
                    )}
                  />
                </div>
              )}
            </div>
          </div>
        </Card>
      ))}

      {lines.length < 10 && (
        <Button onClick={addLine} className="w-full">
          Add Line
        </Button>
      )}

      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        videoBlob={finalVideo}
        mode={mode}
      />
    </div>
  );
}
