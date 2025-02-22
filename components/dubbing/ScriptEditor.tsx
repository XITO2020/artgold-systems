"use client";

import { useState, useEffect } from 'react';
import { Card } from "ù/card";
import { Button } from "ù/button";
import { Input } from "ù/input";
import { Textarea } from "ù/textarea";
import { Label } from "ù/label";
import { VoiceRecorder } from "./VoiceRecorder";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "ù/select";
import { Mic, Type, Save } from "lucide-react";
import { useTheme } from 'ç/theme/ThemeContext';

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
  const { theme } = useTheme();

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

  const checkCompletion = () => {
    const isComplete = lines.every(line => {
      if (mode === 'dubbed') {
        return line.text && (line.audioBlob || line.aiVoice);
      } else {
        return line.text && line.startTime !== undefined && line.endTime !== undefined;
      }
    });

    if (isComplete && !isComplete) {
      setIsComplete(true);
      onComplete();
    }
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
        <Button variant="outline" size="sm" onClick={checkCompletion}>
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
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
        <Button onClick={addLine} className="w-full bg-primary">
          Add Line
        </Button>
      )}
    </div>
  );
}