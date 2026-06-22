import React, { useRef, useState } from "react";
import "./VideoTour.css";

// A sample royalty-free clip is used as the default virtual-tour source so the
// player works out of the box; pass `src`/`poster` props to show a real tour.
const DEFAULT_SRC =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBigBuckBunny.mp4";

const VideoTour = ({ src = DEFAULT_SRC, poster = "" }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    const video = videoRef.current;
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="video-tour">
      <video
        ref={videoRef}
        className="video-tour-player"
        poster={poster}
        controls
        preload="metadata"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      <button type="button" className="video-toggle-btn" onClick={togglePlay}>
        {isPlaying ? "⏸ Pause tour" : "▶ Play virtual tour"}
      </button>
    </div>
  );
};

export default VideoTour;
