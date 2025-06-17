'use client';

import { useEffect, useState, Suspense } from 'react';
import { useAuth } from '@/components/auth-provider';
import { getUserInvites, getTemplateById } from '@/lib/firestore';
import type { Invite, Template } from '@/types';
import InviteCard from '@/components/invite-card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { PlusCircle, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

function MyInvitesContent() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [invites, setInvites] = useState<Invite[]>([]);
  const [templatesCache, setTemplatesCache] = useState<Record<string, Template | null>>({});
  const [loadingInvites, setLoadingInvites] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/auth');
    } else if (user) {
      const fetchInvites = async () => {
        setLoadingInvites(true);
        const userInvites = await getUserInvites(user.uid);
        // Sort by creation date, newest first
        userInvites.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setInvites(userInvites);

        // Pre-fetch template data for these invites
        const uniqueTemplateIds = Array.from(new Set(userInvites.map(i => i.templateId)));
        const newTemplatesCache: Record<string, Template | null> = {};
        for (const id of uniqueTemplateIds) {
          if (!templatesCache[id]) { // Only fetch if not already in cache
            newTemplatesCache[id] = await getTemplateById(id);
          }
        }
        setTemplatesCache(prev => ({ ...prev, ...newTemplatesCache }));
        setLoadingInvites(false);
      };
      fetchInvites();
    }
  }, [user, authLoading, router, templatesCache]);

  useEffect(() => {
    const highlightedInviteId = searchParams.get('highlight');
    if (highlightedInviteId) {
      const element = document.getElementById(`invite-${highlightedInviteId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('ring-2', 'ring-primary', 'ring-offset-2', 'transition-all', 'duration-500', 'ease-in-out');
        setTimeout(() => element.classList.remove('ring-2', 'ring-primary', 'ring-offset-2'), 3000);
      }
    }
  }, [invites, searchParams]);


  if (authLoading || loadingInvites) {
    return (
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-headline font-bold">My Invitations</h1>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl md:text-4xl font-headline font-bold">My Invitations</h1>
        <Button asChild size="lg">
          <Link href="/">
            <PlusCircle className="mr-2 h-5 w-5" /> Create New Invitation
          </Link>
        </Button>
      </div>

      {invites.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-muted-foreground/30 rounded-lg">
          <FilmIcon className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Invitations Yet!</h2>
          <p className="text-muted-foreground mb-6">
            It looks like you haven&apos;t created any video invitations.
          </p>
          <Button asChild>
            <Link href="/">Explore Templates</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {invites.map((invite) => (
            <div key={invite.id} id={`invite-${invite.id}`}>
              <InviteCard invite={invite} template={templatesCache[invite.templateId]} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const CardSkeleton = () => (
  <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4 space-y-3">
    <div className="flex items-start gap-4">
      <Skeleton className="h-24 w-24 rounded-md" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-5 w-1/4 mt-2" />
      </div>
    </div>
    <Skeleton className="h-8 w-full" />
    <div className="flex justify-end gap-2">
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-8 w-20" />
    </div>
  </div>
);

const FilmIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"></rect><line x1="7" y1="2" x2="7" y2="22"></line><line x1="17" y1="2" x2="17" y2="22"></line><line x1="2" y1="12" x2="22" y2="12"></line><line x1="2" y1="7" x2="7" y2="7"></line><line x1="2" y1="17" x2="7" y2="17"></line><line x1="17" y1="17" x2="22" y2="17"></line><line x1="17" y1="7" x2="22" y2="7"></line></svg>
);


export default function MyInvitesPage() {
  return (
    <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin text-primary mx-auto my-10" />}>
      <MyInvitesContent />
    </Suspense>
  );
}
