import { Card } from "@ui/card";
import { Mail } from "lucide-react";

export default function VerifyRequestPage() {
  return (
    <div className="container max-w-md mx-auto py-16">
      <Card className="p-6">
        <div className="text-center">
          <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Check your email</h1>
          <p className="text-muted-foreground">
            A sign in link has been sent to your email address.
            Please check your inbox and spam folder.
          </p>
        </div>
      </Card>
    </div>
  );
}