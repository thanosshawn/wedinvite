import VideoEditor from '@/components/video-editor';
import { getTemplateById } from '@/lib/firestore';
import type { Template } from '@/types';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Clock, Tag, Film, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface TemplateDetailPageProps {
  params: { templateId: string };
}

export default async function TemplateDetailPage({ params }: TemplateDetailPageProps) {
  const template: Template | null = await getTemplateById(params.templateId);

  if (!template) {
    notFound();
  }

  return (
    <div className="space-y-12">
      <section className="bg-card p-6 md:p-8 rounded-lg shadow-md">
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 items-center">
          <div className="md:col-span-1 aspect-[16/9] w-full overflow-hidden rounded-md">
            <Image
              src={template.thumbnailUrl || 'https://placehold.co/600x400.png'}
              alt={template.title}
              width={600}
              height={400}
              className="object-cover w-full h-full"
              data-ai-hint="invitation video example"
              priority
            />
          </div>
          <div className="md:col-span-2">
            <h1 className="text-3xl md:text-4xl font-headline font-bold mb-3">{template.title}</h1>
            <p className="text-muted-foreground text-lg mb-4">{template.description}</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground mb-4">
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1.5" />
                <span>Duration: {template.duration} seconds</span>
              </div>
              <div className="flex items-center">
                <Film className="h-4 w-4 mr-1.5" />
                <span>Remotion ID: {template.remotionId}</span>
              </div>
            </div>
            {template.tags && template.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {template.tags.map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs capitalize">
                    <Tag className="h-3 w-3 mr-1" />{tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
      
      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle className="font-headline">Remotion & Supabase Notice</AlertTitle>
        <AlertDescription>
          This application is configured to work with Remotion for video rendering and Supabase for video storage.
          The actual rendering and upload processes are simulated in this version. Full integration requires setting up Remotion rendering (local or Lambda) and Supabase storage buckets.
        </AlertDescription>
      </Alert>

      <VideoEditor template={template} />
    </div>
  );
}

export async function generateStaticParams() {
  // In a real app, fetch all template IDs from Firestore here to pre-render pages
  // For now, returning an empty array as mock data is used directly in getTemplateById for fallback.
  // const templates = await getTemplates();
  // return templates.map(template => ({ templateId: template.id }));
  return []; 
}
