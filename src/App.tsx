// import { useContext } from "react";
// import { TrackContext, TrackContext } from "./context/TrackContext";
import { useState, useRef, useEffect } from "react";
// import { useEffect } from "react";

import Transport from "./components/Transport";
import PartSettings from "./components/PartSettings";

export default function App() {
  // const trackInfo = useContext(TrackContext);

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  const audioRef = useRef<HTMLAudioElement>(null);

  function handlePlay() {
    console.log("PLAY");
    setPlaying(true);
    audioRef.current?.play();
  }

  function handlePause() {
    console.log("PAUSE");
    setPlaying(false);
    audioRef.current?.pause();
  }

  function handleMove(timestamp: number) {
    setCurrentTime(timestamp);
    audioRef.current!.currentTime = timestamp;
  }

  function updateTime() {
    setCurrentTime(audioRef.current!.currentTime);
  }

  return (
    <div className="m-20 flex flex-col gap-10">
      <audio
        onEnded={handlePause}
        onTimeUpdate={updateTime}
        ref={audioRef}
        src={"/src/assets/sailor_song.mp3"}
      />

      <Transport
        duration={audioRef.current?.duration || 0}
        currentTime={currentTime}
        playing={playing}
        play={handlePlay}
        pause={handlePause}
        move={handleMove}
      />
      <PartSettings />
    </div>
  );
}
