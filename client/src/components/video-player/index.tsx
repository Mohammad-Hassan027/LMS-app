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
  const playerRef = useRef<any>(null);

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

        // Safety check: Ensure the player ref exists
        if (playerRef.current) {
          let duration = 0;

          // Strategy A: Try the standard ReactPlayer method
          if (typeof playerRef.current.getDuration === "function") {
            duration = playerRef.current.getDuration();
          }
          // Strategy B: Fallback to HTML Media Element property
          else if (playerRef.current.duration) {
            duration = playerRef.current.duration;
          }

          // If we found a valid duration, update the parent
          if (duration && onDuration) {
            onDuration(duration);
          }
        }
      }}
      onEnded={handleEnded}
    />
  );
}
