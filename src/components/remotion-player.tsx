'use client';

import { Player } from '@remotion/player';
import { useCallback, useEffect, useState, memo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import dynamic from 'next/dynamic';

// Lazy load the Player component
const RemotionPlayerComponent = dynamic(() => import('@remotion/player').then(mod => mod.Player), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-full" />
});

interface RemotionPlayerProps {
  remotionId: string;
  duration: number;
  width?: number;
  height?: number;
  className?: string;
}

// Memoize the mock data to prevent unnecessary re-renders
const mockData = {
  brideName: 'Priya',
  groomName: 'Rahul',
  weddingDate: '2024-12-31',
  venue: 'Grand Palace',
  message: 'Join us in celebrating our special day',
};

// Memoize the placeholder component
const PlaceholderComponent = memo(() => (
  <div style={{ width: '100%', height: '100%', backgroundColor: '#000' }}>
    <div style={{ 
      color: 'white', 
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
      textAlign: 'center'
    }}>
      <h1 style={{ fontSize: '2em', marginBottom: '20px' }}>
        {mockData.brideName} & {mockData.groomName}
      </h1>
      <p style={{ fontSize: '1.2em' }}>
        {mockData.weddingDate} at {mockData.venue}
      </p>
      <p style={{ marginTop: '20px' }}>
        {mockData.message}
      </p>
    </div>
  </div>
));

PlaceholderComponent.displayName = 'PlaceholderComponent';

const RemotionPlayer = memo(function RemotionPlayer({
  remotionId,
  duration,
  width = 600,
  height = 400,
  className = '',
}: RemotionPlayerProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Intersection Observer to only load video when in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`remotion-player-${remotionId}`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [remotionId]);

  const handleError = useCallback((err: Error) => {
    console.error('Remotion player error:', err);
    setError('Failed to load video preview');
    setIsLoading(false);
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  if (error) {
    return (
      <div className={`bg-muted/50 rounded-lg flex items-center justify-center ${className}`} style={{ width, height }}>
        <p className="text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  return (
    <div 
      id={`remotion-player-${remotionId}`}
      className={`relative ${className}`} 
      style={{ width, height }}
    >
      {isLoading && (
        <Skeleton className="absolute inset-0" />
      )}
      {isVisible && (
        <RemotionPlayerComponent
          component={PlaceholderComponent}
          durationInFrames={duration * 30}
          fps={30}
          compositionWidth={width}
          compositionHeight={height}
          style={{
            width: '100%',
            height: '100%',
          }}
          controls
          autoPlay
          loop
          onError={handleError}
          onLoad={handleLoad}
          // Performance optimizations
          numberOfSharedAudioTags={1}
          renderLoading={() => <Skeleton className="w-full h-full" />}
          prefetch={false}
        />
      )}
    </div>
  );
});

RemotionPlayer.displayName = 'RemotionPlayer';

export default RemotionPlayer; 