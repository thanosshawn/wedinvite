import type { Invite, Template } from '@/types';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle2, Download, ExternalLink, Film, Loader2, Share2, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface InviteCardProps {
  invite: Invite;
  template?: Template | null; // Associated template data
}

export default function InviteCard({ invite, template }: InviteCardProps) {
  const renderStatusContent = () => {
    switch (invite.status) {
      case 'draft':
        return <Badge variant="outline"><Film className="mr-1 h-3 w-3" />Draft</Badge>;
      case 'rendering':
        return (
          <div className="w-full">
            <div className="flex items-center text-sm text-blue-600 mb-1">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              <span>Rendering...</span>
            </div>
            <Progress value={50} className="h-2 w-full" /> {/* Simulate progress */}
          </div>
        );
      case 'rendered':
        return <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white"><CheckCircle2 className="mr-1 h-3 w-3" />Rendered</Badge>;
      case 'error':
        return <Badge variant="destructive"><AlertTriangle className="mr-1 h-3 w-3" />Error</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const formattedDate = invite.createdAt ? formatDistanceToNow(new Date(invite.createdAt), { addSuffix: true }) : 'N/A';

  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4">
        {template && (
          <div className="relative w-24 h-24 aspect-video rounded-md overflow-hidden shrink-0">
            <Image
              src={template.thumbnailUrl || 'https://placehold.co/150x84.png'}
              alt={template.title}
              layout="fill"
              objectFit="cover"
              data-ai-hint="invitation video thumbnail"
            />
          </div>
        )}
        <div className="flex-1">
          <CardTitle className="text-lg font-headline mb-1">
            {template ? template.title : `Invite ${invite.id.substring(0,6)}`}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Created: {formattedDate}
          </CardDescription>
          <div className="mt-2">{renderStatusContent()}</div>
        </div>
      </CardHeader>
      
      {invite.status === 'rendered' && invite.videoUrl && (
        <CardContent className="p-4 border-t">
            <video controls width="100%" className="rounded-md aspect-video" preload="metadata">
                <source src={invite.videoUrl} type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </CardContent>
      )}

      <CardFooter className="p-4 border-t flex flex-wrap gap-2 justify-end">
        {invite.status === 'rendered' && invite.videoUrl ? (
          <>
            <Button variant="outline" size="sm" asChild>
              <a href={invite.videoUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Open
              </a>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <a href={invite.videoUrl} download>
                <Download className="mr-1.5 h-3.5 w-3.5" /> Download
              </a>
            </Button>
            {/* Share functionality can be more complex, e.g., using Web Share API or copying link */}
            <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(invite.videoUrl!)}>
              <Share2 className="mr-1.5 h-3.5 w-3.5" /> Share
            </Button>
          </>
        ) : invite.status !== 'rendering' && template && (
          <Button variant="default" size="sm" asChild>
            <Link href={`/templates/${invite.templateId}`}>
              <Eye className="mr-1.5 h-3.5 w-3.5" /> View/Edit
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
