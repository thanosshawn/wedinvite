import { Suspense } from 'react';
import { getTemplates } from '@/lib/firestore';
import { TemplateBrowser } from '@/components/template-browser';
import { Skeleton } from '@/components/ui/skeleton';

function TemplateGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="aspect-video w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

export const revalidate = 3600; // Revalidate every hour

export default async function TemplatesPage() {
  const templates = await getTemplates();

  return (
    <div className="container py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Wedding Invitation Templates</h1>
          <p className="text-muted-foreground mt-2">
            Choose from our collection of beautiful wedding invitation templates
          </p>
        </div>

        <Suspense fallback={<TemplateGridSkeleton />}>
          <TemplateBrowser templates={templates} />
        </Suspense>
      </div>
    </div>
  );
} 