import { useRef } from "react";
import ReactPlayer from "react-player";

export default function Player({
  url,
  width = 320,
  height = 180,
  onStart: handleStart,
  onEnded: handleEnded,
  onDuration,
}: {
  url: string;
  width?: number | string;
  height?: number | string;
  onStart?: () => void;
  onEnded?: () => void;
  onDuration?: (duration: number) => void;
}) {
  const playerRef = useRef<HTMLVideoElement | null>(null);

  return (
    <ReactPlayer
      ref={playerRef}
      width={width}
      height={height}
      slot="media"
      src={url}
      controls
      // We use onStart to fetch duration because onReady can sometimes be too early for the ref
      onStart={() => {
        if (handleStart) handleStart();

        // Safety check: Ensure the player ref exists and use HTML media duration
        if (playerRef.current) {
          const duration = playerRef.current.duration || 0;
          if (duration && onDuration) {
            onDuration(duration);
          }
        }
      }}
      onEnded={handleEnded}
    />
  );
}
