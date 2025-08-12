import { Card } from "@ui/card";
import { Button } from "@ui/button";
import { Badge } from "@ui/badge";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";

export default function ModerationPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Content Moderation</h1>

      <div className="space-y-6">
        {/* Example submission */}
        <Card className="p-6">
          <div className="flex gap-6">
            <div className="w-48 h-48 relative rounded-lg overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5"
                alt="Artwork submission"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Abstract Harmony</h2>
                  <p className="text-muted-foreground">by John Doe</p>
                </div>
                <Badge variant="secondary">Pending Review</Badge>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Description</h3>
                  <p className="text-muted-foreground">
                    A contemporary piece exploring the relationship between form and color...
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">AI Detection Results</h3>
                  <div className="flex gap-4">
                    <Badge variant="outline" className="bg-green-50">
                      ✓ Not AI Generated
                    </Badge>
                    <Badge variant="outline" className="bg-green-50">
                      ✓ No Duplicates Found
                    </Badge>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button variant="destructive" className="flex items-center gap-2">
                    <XCircle className="h-4 w-4" />
                    Reject
                  </Button>
                  <Button variant="default" className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}