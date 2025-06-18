import { notFound } from 'next/navigation';
import { getTemplateById } from '@/lib/firestore';
import { TemplateEditor } from '@/components/template-editor';

interface EditTemplatePageProps {
  params: {
    id: string;
  };
}

export default async function EditTemplatePage({ params }: EditTemplatePageProps) {
  const template = await getTemplateById(params.id);

  if (!template) {
    notFound();
  }

  return (
    <div className="container py-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Edit {template.title}</h1>
          <p className="text-muted-foreground mt-2">
            Customize your wedding invitation with your details
          </p>
        </div>

        <TemplateEditor
          template={template}
          onSave={async (values) => {
            'use server';
            // TODO: Implement save functionality
            console.log('Saving values:', values);
          }}
        />
      </div>
    </div>
  );
} 