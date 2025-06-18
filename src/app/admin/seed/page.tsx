'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function SeedPage() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSeed = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/seed', {
        method: 'POST',
      });
      const data = await response.json();

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Templates seeded successfully!',
        });
      } else {
        throw new Error(data.error || 'Failed to seed templates');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to seed templates',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-heading mb-8">Seed Templates</h1>
      <Button
        onClick={handleSeed}
        disabled={loading}
        className="bg-primary hover:bg-primary/90"
      >
        {loading ? 'Seeding...' : 'Seed Templates'}
      </Button>
    </div>
  );
} 