import type { Template } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Tag, Film } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TemplateCardProps {
  template: Template;
}

export default function TemplateCard({ template }: TemplateCardProps) {
  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg">
      <CardHeader className="p-0 relative">
        <Link href={`/templates/${template.id}`} aria-label={`Customize ${template.title}`}>
          <div className="aspect-[16/9] w-full overflow-hidden">
            <Image
              src={template.thumbnailUrl || 'https://placehold.co/600x400.png'}
              alt={template.title}
              width={600}
              height={400}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              data-ai-hint="invitation video still"
            />
          </div>
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-grow">
        <CardTitle className="text-xl font-headline mb-2">
          <Link href={`/templates/${template.id}`} className="hover:text-primary transition-colors">
            {template.title}
          </Link>
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {template.description}
        </CardDescription>
        <div className="flex items-center text-xs text-muted-foreground space-x-3 mb-3">
          <div className="flex items-center">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>{template.duration}s</span>
          </div>
          <div className="flex items-center">
            <Film className="h-3.5 w-3.5 mr-1" />
            <span>{template.remotionId}</span>
          </div>
        </div>
        {template.tags && template.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {template.tags.slice(0, 3).map(tag => (
              <Badge key={tag} variant="secondary" className="text-xs capitalize">
                <Tag className="h-3 w-3 mr-1" />{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 border-t">
        <Button asChild className="w-full" size="lg">
          <Link href={`/templates/${template.id}`}>Customize</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
