import TemplateCard from '@/components/template-card';
import { getTemplates } from '@/lib/firestore';
import type { Template } from '@/types';
import { Separator } from '@/components/ui/separator';

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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {templates.map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
