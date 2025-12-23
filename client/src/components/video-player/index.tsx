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
  className,
}: {
  url: string;
  className?: string;
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
      slot="media"
      src={url}
      controls
      className={`mb-4 ${className ? className : "max-w-md"}`}
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
