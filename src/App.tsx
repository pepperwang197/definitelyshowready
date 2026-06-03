// import { useContext } from "react";
// import { TrackContext, TrackContext } from "./context/TrackContext";
import { useState, useRef, useEffect } from "react";
// import { useEffect } from "react";

import Transport from "./components/Transport";
import PartSettings from "./components/PartSettings";

export interface PartState {
  name: string;
  volume: number;
  muted: boolean;
  soloed: boolean;
  offset: number;
}

interface SongData {
  paths: Array<string>;
  duration: number;
}

export default function App() {
  const [songData, setSongData] = useState<SongData>();
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [masterVolume, setMasterVolume] = useState(100);
  const [partStates, setPartStates] = useState<Array<PartState>>([]);

  const audioRefs = useRef<Array<HTMLAudioElement | null>>([]);

  // get all track data
  useEffect(() => {
    console.log("getting data");
    // TODO: actually get files from api
    const data = {
      duration: 42,
      paths: ["/src/assets/Alfred.wav", "/src/assets/Alice.wav"],
    };
    setSongData(data);
    setPartStates(
      data.paths.map((path: string) => ({
        // change later
        name: path,
        volume: 100,
        muted: false,
        soloed: false,
        offset: 0,
      })),
    );
  }, []);

  // useEffect(() => {
  //   const timer = setTimeout(
  //     () => playing && updateTime(currentTime + 0.1),
  //     100,
  //   );
  //   // console.log(audioRefs.current[0]);
  //   return () => clearTimeout(timer);
  // }, [currentTime, playing]);

  function handlePlay() {
    if (!playing) {
      // console.log("PLAY");
      setPlaying(true);
      audioRefs.current.forEach((ref, index) => {
        if (index === 0) {
          ref!.play();
        } else {
          console.log(
            "Before:",
            ref?.currentTime,
            audioRefs.current[0]!.currentTime,
          );
          ref!.currentTime = audioRefs.current[0]!.currentTime;
          console.log(
            "after:",
            ref?.currentTime,
            audioRefs.current[0]!.currentTime,
          );
          ref!.play();
          console.log(
            "secret 3rd option:",
            ref?.currentTime,
            audioRefs.current[0]!.currentTime,
          );
        }
      });
    }
  }

  function handlePause() {
    if (playing) {
      // console.log("PAUSE");
      setPlaying(false);
      audioRefs.current.forEach((ref) => {
        ref?.pause();
      });
    }
  }

  function handleMove(timestamp: number) {
    console.log("moved to ", timestamp);
    setCurrentTime(timestamp);
    audioRefs.current.forEach((ref, index) => {
      if (index === 0) {
        ref!.currentTime = timestamp;
      }
      ref!.currentTime = audioRefs.current[0]?.currentTime || 0;
    });
  }

  function updateTime() {
    // update time based on audio elements' current time
    setCurrentTime(audioRefs.current[0]?.currentTime || 0);
  }

  return (
    <div className="m-20 flex flex-col gap-10">
      {songData?.paths.map((path, index) =>
        index !== 0 ? (
          <audio
            onEnded={handlePause}
            onTimeUpdate={updateTime}
            ref={(ref) => {
              audioRefs.current[index] = ref;
            }}
            src={path}
            key={path}
          />
        ) : (
          <audio
            ref={(ref) => {
              audioRefs.current[index] = ref;
            }}
            src={path}
            key={path}
          />
        ),
      )}

      <Transport
        duration={songData?.duration || 0}
        currentTime={currentTime}
        playing={playing}
        play={handlePlay}
        pause={handlePause}
        move={handleMove}
      />
      <PartSettings partStates={partStates} />
    </div>
  );
}
