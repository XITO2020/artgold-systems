"use client";

import { useState, useEffect } from "react";
import { Card } from "ù/card";
import { Button } from "ù/button";
import { Input } from "ù/input";
import { Label } from "ù/label";
import { Textarea } from "ù/textarea";
import { Upload, MapPin, AlertTriangle } from "lucide-react";
import { LocationPicker } from "@comp/location-picker";
import { useToast } from "#//use-toast";
import { useSession } from "next-auth/react";
import { Alert, AlertTitle, AlertDescription } from "ù/alert";

export default function UploadPage() {
  const { data: session } = useSession();
  const [availableSlots, setAvailableSlots] = useState<number | null>(null);
  const [bonusSlots, setBonusSlots] = useState<number>(0);
  const [showMap, setShowMap] = useState(false);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
    address: string;
  } | null>(null);
  const { toast } = useToast();
  const [theme, setTheme] = useState("default");

    useEffect(() => {
    if (session?.user) {
      fetchSlotInfo();
    }
  }, [session]);

   // Change the theme dynamically
   useEffect(() => {
    // On récupère le thème stocké dans le localStorage
    const savedTheme = localStorage.getItem("theme") || "default";
    setTheme(savedTheme);
  }, []);

  useEffect(() => {
    // Appliquer le thème au body
    document.body.setAttribute("data-theme", theme);
  
    // Charger le fichier SCSS correspondant au thème
    if (theme !== "default") {
      import(`@/wonderstyles/effects/${theme}.scss`).then(() => {
        // Réinitialiser l'animation après un court délai pour garantir que le thème soit appliqué
        setTimeout(() => {
          const laserboxContainer = document.querySelector(".laserbox-container");
  
          if (laserboxContainer) {
            // Utiliser une assertion de type pour garantir que c'est un HTMLElement
            const laserboxElement = laserboxContainer as HTMLElement;
            
            // Supprimer la classe de l'animation
            laserboxElement.classList.remove("laserbox-container");
  
            // Forcer un reflow pour réinitialiser l'animation
            void laserboxElement.offsetHeight; // Trigger reflow
  
            // Réajouter la classe pour redémarrer l'animation
            laserboxElement.classList.add("laserbox-container");
          }
        }, 10000); // Ajuster ce délai en fonction des besoins
      });
    }
  }, [theme]);
  

    const fetchSlotInfo = async () => {
    const response = await fetch('/api/user/slots');
    const data = await response.json();
    setAvailableSlots(data.availableSlots);
    setBonusSlots(data.bonusSlots);
  };

  const handleLocationSelect = (loc: {
    latitude: number;
    longitude: number;
    address: string;
  }) => {
    setLocation(loc);
    setShowMap(false);
  };

    if (availableSlots === 0 && bonusSlots === 0) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>No Available Slots</AlertTitle>
        <AlertDescription>
          You have reached the maximum number of artworks. Sell some existing artworks. To upload more: suppress those unsold and without likes or acquire bonus slotswith the increase of your 12 masterpieces value (lots of likes and new owners).
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">Convert Your Art</h1>

      <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg mb-8">
        <div className="flex gap-2">
          <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 shrink-0 mt-1" />
          <div className="text-sm text-yellow-800 dark:text-yellow-200">
            <p className="font-medium">Important Notice</p>
            <p>You can upload up to 12 artworks. When uploading a 13th artwork, you will need to remove one of your existing artworks first 
            <br/> <span className="text-lime-400">( or win new slots with your fame! )</span></p>
          </div>
        </div>
      </div>
      <div className="laserbox-container" key={theme}>
          <Card className="laserbox">
          <form className="space-y-6 p-6 w-full bg-gradient-to-b from-violet-50 via-orange-100 to-red-300">
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

            <Button className="w-full" size="lg">
              Submit for Validation
            </Button>
          </form>
        </Card>
      </div>
      
    </div>
  );
}