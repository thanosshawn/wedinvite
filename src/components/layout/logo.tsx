import Link from 'next/link';
import { Heart } from 'lucide-react';

export default function Logo() {
  return (
    <Link 
      href="/" 
      className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors group"
    >
      <div className="relative">
        <Heart className="h-8 w-8 animate-float" />
        <div className="absolute inset-0 animate-spin-slow">
          <Heart className="h-8 w-8 text-secondary opacity-50" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-decorative font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Wedding Invitations
        </span>
        <span className="text-xs text-muted-foreground font-sans">Create Beautiful Memories</span>
      </div>
    </Link>
  );
}
