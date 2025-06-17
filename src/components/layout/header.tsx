'use client';

import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/components/auth-provider';
import Logo from './logo';
import { LogIn, LogOut, User as UserIcon, LayoutGrid, PlusCircle, Sun, Moon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useTheme } from '@/components/theme-provider';

export default function Header() {
  const { user, loading, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Logo />
        <nav className="flex items-center space-x-2 md:space-x-4">
          <Button variant="ghost" asChild>
            <Link href="/">Browse Templates</Link>
          </Button>
          {user && (
            <Button variant="ghost" asChild>
              <Link href="/my-invites">My Invites</Link>
            </Button>
          )}
          <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
          {loading ? (
            <Skeleton className="h-10 w-10 rounded-full" />
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? 'User Avatar'} />
                    <AvatarFallback>{user.displayName?.charAt(0).toUpperCase() ?? user.email?.charAt(0).toUpperCase() ?? 'U'}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName ?? 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/my-invites"><LayoutGrid className="mr-2 h-4 w-4" /> My Invites</Link>
                </DropdownMenuItem>
                {/* <DropdownMenuItem asChild><Link href="/templates/new"><PlusCircle className="mr-2 h-4 w-4" /> New Template (Admin)</Link></DropdownMenuItem> */}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link href="/auth">
                <LogIn className="mr-2 h-4 w-4" /> Sign In
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
