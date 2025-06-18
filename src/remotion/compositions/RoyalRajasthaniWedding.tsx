import { AbsoluteFill, useCurrentFrame, interpolate } from 'remotion';
import { z } from 'zod';

export const RoyalRajasthaniWeddingSchema = z.object({
  brideName: z.string(),
  groomName: z.string(),
  weddingDate: z.string(),
  venue: z.string(),
  message: z.string(),
  photos: z.array(z.string()).optional(),
  music: z.string().optional(),
});

export const RoyalRajasthaniWedding = ({
  brideName,
  groomName,
  weddingDate,
  venue,
  message,
  photos = [],
  music,
}: z.infer<typeof RoyalRajasthaniWeddingSchema>) => {
  const frame = useCurrentFrame();
  const duration = 300; // 10 seconds at 30fps

  // Fade in animation
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });

  // Slide up animation
  const translateY = interpolate(frame, [0, 30], [50, 0], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#f8f4e3',
        fontFamily: 'serif',
        color: '#8b0000',
      }}
    >
      {/* Background Pattern */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'radial-gradient(#8b0000 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          opacity: 0.1,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, -50%) translateY(${translateY}px)`,
          opacity,
          textAlign: 'center',
          width: '80%',
        }}
      >
        <h1
          style={{
            fontSize: '4rem',
            marginBottom: '2rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
          }}
        >
          {brideName} & {groomName}
        </h1>

        <div
          style={{
            fontSize: '2rem',
            marginBottom: '2rem',
            fontStyle: 'italic',
          }}
        >
          {weddingDate}
        </div>

        <div
          style={{
            fontSize: '1.5rem',
            marginBottom: '2rem',
          }}
        >
          {venue}
        </div>

        <div
          style={{
            fontSize: '1.2rem',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          {message}
        </div>
      </div>

      {/* Decorative Elements */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '100px',
          background: 'linear-gradient(45deg, #8b0000, #f8f4e3)',
          opacity: 0.2,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '100px',
          background: 'linear-gradient(45deg, #f8f4e3, #8b0000)',
          opacity: 0.2,
        }}
      />
    </AbsoluteFill>
  );
}; 