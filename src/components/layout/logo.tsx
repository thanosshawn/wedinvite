import Link from 'next/link';
import { Film } from 'lucide-react';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors">
      <Film className="h-8 w-8" />
      <span className="text-2xl font-headline font-bold">Remotion Invitations</span>
    </Link>
  );
}
