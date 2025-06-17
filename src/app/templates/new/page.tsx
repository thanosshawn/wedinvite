import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock } from "lucide-react";

export default function NewTemplatePage() {
  // This page would typically be admin-only.
  // For now, it's a placeholder.
  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="font-headline text-2xl flex items-center">
            <Lock className="mr-2 h-6 w-6 text-primary" />
            Submit New Template (Admin)
          </CardTitle>
          <CardDescription>
            This section is for administrative purposes to add new video templates to the platform.
            Functionality for this page is not yet implemented.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Future enhancements would include a form to define template metadata, upload thumbnail images,
            and specify Remotion composition details.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
