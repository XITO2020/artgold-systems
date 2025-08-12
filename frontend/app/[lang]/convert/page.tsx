"use client";

import { useState } from "react";
import { Card } from "@ui/card";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import { Label } from "@ui/label";
import { Textarea } from "@ui/textarea";
import { Upload, MapPin, AlertTriangle } from "lucide-react";
import { LocationPicker } from "@comp/location-picker";


export default function ConvertPage() {
  const [showMap, setShowMap] = useState(false);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    address: string;
  } | null>(null);

  const handleLocationSelect = (loc: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setLocation(loc);
    setShowMap(false);
  };

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Convert Your Art</h1>

      <Card className="p-6">
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
            {!showMap ? (
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setShowMap(true)}
              >
                <MapPin className="h-4 w-4 mr-2" />
                {location ? location.address : "Set Artwork Location"}
              </Button>
            ) : (
              <LocationPicker onLocationSelect={handleLocationSelect} />
            )}
          </div>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <div className="flex gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500" />
              <div className="text-sm text-yellow-800 dark:text-yellow-200">
                <p className="font-medium">Important Notice</p>
                <p>Only original, handmade artworks are accepted. AI-generated or copied works will result in permanent account suspension.</p>
              </div>
            </div>
          </div>

          <Button className="w-full" size="lg">
            Submit for Validation
          </Button>
        </form>
      </Card>
    </div>
  );
}