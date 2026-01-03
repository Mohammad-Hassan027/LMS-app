import ReactPlayer from "react-player";
// import {
//   MediaController,
//   MediaControlBar,
//   MediaTimeRange,
//   MediaTimeDisplay,
//   MediaVolumeRange,
//   MediaPlaybackRateButton,
//   MediaPlayButton,
//   MediaSeekBackwardButton,
//   MediaSeekForwardButton,
//   MediaMuteButton,
//   MediaFullscreenButton,
// } from "media-chrome/react";

export default function Player({
  url,
  width = 320,
  height = 180,
  onStart,
  onEnded,
}: {
  url: string;
  width?: number;
  height?: number;
  onStart?: () => void;
  onEnded?: () => void;
}) {
  return (
    // // <MediaController
    // //   style={{
    // //     width: "100%",
    // //     aspectRatio: "16/9",
    // //   }}
    // // >
    //   {/* https://stream.mux.com/maVbJv2GSYNRgS02kPXOOGdJMWGU1mkA019ZUjYE7VU7k */}
    <ReactPlayer
      width={width}
      height={height}
      slot="media"
      src={url}
      controls
      onStart={onStart}
      onEnded={onEnded}
    ></ReactPlayer>
    //   {/* <MediaControlBar className="px-4">
    //     <MediaPlayButton />
    //     <MediaSeekBackwardButton seekOffset={10} />
    //     <MediaSeekForwardButton seekOffset={10} />
    //     <MediaTimeRange />
    //     <MediaTimeDisplay showDuration />
    //     <MediaMuteButton />
    //     <MediaVolumeRange />
    //     <MediaPlaybackRateButton />
    //     <MediaFullscreenButton />
    //   </MediaControlBar>
    // </MediaController> */}
  );
}
