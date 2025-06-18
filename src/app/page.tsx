import TemplateCard from '@/components/template-card';
import { getTemplates } from '@/lib/firestore';
import type { Template } from '@/types';
import { Separator } from '@/components/ui/separator';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Loading skeleton for template cards
function TemplateCardSkeleton() {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="aspect-[16/9] w-full">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="p-4 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-20" />
        </div>
      </div>
    </div>
  );
}

// Template grid with loading state
function TemplateGrid({ templates }: { templates: Template[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
      {templates.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
}

export const revalidate = 3600; // Revalidate every hour

export default async function HomePage() {
  const templates: Template[] = await getTemplates();

  return (
    <div className="space-y-8">
      <section className="text-center py-8 md:py-12">
        <h1 className="text-4xl md:text-5xl font-headline font-bold mb-4 tracking-tight">
          Create Your Perfect Video Invitation
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          Browse our collection of beautifully designed templates and personalize your own in minutes.
        </p>
      </section>

      <Separator />

      <section>
        <h2 className="text-3xl font-headline font-semibold mb-8 text-center">
          Choose a Template
        </h2>
        {templates.length === 0 ? (
          <p className="text-center text-muted-foreground">No templates available at the moment. Check back soon!</p>
        ) : (
          <Suspense 
            fallback={
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <TemplateCardSkeleton key={i} />
                ))}
              </div>
            }
          >
            <TemplateGrid templates={templates} />
          </Suspense>
        )}
      </section>
    </div>
  );
}
