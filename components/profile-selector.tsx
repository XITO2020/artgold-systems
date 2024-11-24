"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Text } from 'lucide-react';

const FONT_FAMILIES = {
  serif: "Font Serif",
  sans: "Font Sans",
  mono: "Font Mono",
  cursive: "Font Cursive",
  fantasy: "Font Fantasy"
};

const COLORS = [
  { name: "Ruby Red", value: "#E63946" },
  { name: "Sapphire Blue", value: "#1D3557" },
  { name: "Emerald Green", value: "#2A9D8F" },
  { name: "Royal Purple", value: "#7209B7" },
  { name: "Golden Yellow", value: "#FFB703" },
  { name: "Obsidian Black", value: "#2B2D42" },
  { name: "Pearl White", value: "#F1FAEE" },
  { name: "Rose Gold", value: "#F4A261" },
  { name: "Aqua Blue", value: "#48CAE4" },
  { name: "Forest Green", value: "#40916C" }
];

export function ProfileSelector({ onSave }: { onSave: (profile: any) => void }) {
  const [fontColor, setFontColor] = useState(COLORS[0].value);
  const [fontFamily, setFontFamily] = useState<string>("sans");
  const [previewText, setPreviewText] = useState("Anonymous");

  return (
    <Card className="p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Select Your Style</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Choose your unique font style and color to create your anonymous identity
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Font Style</label>
          <Select value={fontFamily} onValueChange={setFontFamily}>
            <SelectTrigger>
              <SelectValue placeholder="Select font style" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(FONT_FAMILIES).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  <span className={value}>{label}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium mb-2 block">Font Color</label>
          <div className="grid grid-cols-5 gap-2">
            {COLORS.map((color) => (
              <Button
                key={color.value}
                variant="outline"
                className={`w-full h-10 rounded-md p-0 ${
                  fontColor === color.value ? 'ring-2 ring-primary' : ''
                }`}
                style={{ backgroundColor: color.value }}
                onClick={() => setFontColor(color.value)}
              >
                <span className="sr-only">{color.name}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t">
          <label className="text-sm font-medium mb-2 block">Preview</label>
          <div className="p-4 bg-muted rounded-lg">
            <p
              style={{
                color: fontColor,
                fontFamily: fontFamily === 'serif' ? 'serif' :
                           fontFamily === 'mono' ? 'monospace' :
                           fontFamily === 'cursive' ? 'cursive' :
                           fontFamily === 'fantasy' ? 'fantasy' : 'sans-serif'
              }}
              className="text-2xl"
            >
              {previewText}
            </p>
          </div>
        </div>

        <Button 
          className="w-full"
          onClick={() => onSave({ fontColor, fontFamily })}
        >
          <Text className="w-4 h-4 mr-2" />
          Save Style
        </Button>
      </div>
    </Card>
  );
}