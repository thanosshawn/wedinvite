import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/components/auth-provider';
import Header from '@/components/layout/header';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: 'Wedding Invitations',
  description: 'Create beautiful Indian wedding invitations with modern animations.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col bg-background text-foreground">
        <ThemeProvider defaultTheme="light" storageKey="app-theme">
          <AuthProvider>
            <div className="mandala-pattern fixed inset-0 pointer-events-none opacity-[0.03]" />
            <div className="floral-border fixed top-0 left-0 right-0 pointer-events-none opacity-20" />
            <div className="floral-border fixed bottom-0 left-0 right-0 pointer-events-none rotate-180 opacity-20" />
            <Header />
            <main className="flex-grow container mx-auto px-4 py-8 relative z-10">
              <div className="animate-fade-in">
                {children}
              </div>
            </main>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
