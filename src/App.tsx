// import { useContext } from "react";
// import { TrackContext, TrackContext } from "./context/TrackContext";
import { useState, useRef, useEffect } from "react";
// import { useEffect } from "react";

import Transport from "./components/Transport";
import PartSettings from "./components/PartSettings";

export interface PartState {
  name: string;
  path: string;
  volume: number;
  muted: boolean;
  soloed: boolean;
}

interface SongData {
  names: Array<string>;
  paths: Array<string>;
  duration: number;
}

export default function App() {
  const [songData, setSongData] = useState<SongData>();
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [masterVolume, setMasterVolume] = useState(100);
  const [partStates, setPartStates] = useState<Array<PartState>>([]);
  const [partsSoloed, setPartsSoloed] = useState(0);

  const audioRefs = useRef<Array<HTMLAudioElement | null>>([]);

  // get all track data
  useEffect(() => {
    // TODO: actually get files from api
    const data = {
      names: [
        "Alice",
        "White Rabbit",
        "Caterpillar 1",
        "Caterpillar 2",
        "Soprano",
        "Alto",
        "Tenor",
        "Baritone",
      ],
      paths: [
        "/src/testing_tracks/Alice_wow.wav",
        "/src/testing_tracks/White_Rabbit.wav",
        "/src/testing_tracks/Caterpillar_1.wav",
        "/src/testing_tracks/Caterpillar_2.wav",
        "/src/testing_tracks/Soprano.wav",
        "/src/testing_tracks/Alto.wav",
        "/src/testing_tracks/Tenor.wav",
        "/src/testing_tracks/Baritone.wav",
      ],
      duration: 3 * 60 + 9,
    };
    setSongData(data);
    setPartStates(
      data.names.map((name, index) => ({
        // change later
        name: name,
        path: data.paths[index],
        volume: 0.7,
        muted: false,
        soloed: false,
      })),
    );
  }, []);

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.key === " " && !event.repeat) {
        event.preventDefault();
        playing ? handlePause() : handlePlay();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);

    // Always clean up listeners to prevent application memory leaks
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [playing]);

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
      console.log("PLAY");
      setPlaying(true);
      audioRefs.current.forEach((ref) => {
        ref!.play();
      });
    }
  }

  function handlePause() {
    if (playing) {
      console.log("PAUSE");
      setPlaying(false);
      audioRefs.current.forEach((ref) => {
        ref?.pause();
      });
    }
  }

  function handleMove(timestamp: number) {
    setCurrentTime(timestamp);
    audioRefs.current.forEach((ref) => {
      ref!.currentTime = timestamp;
    });
  }

  function updateTime() {
    // update time based on audio elements' current time
    setCurrentTime(audioRefs.current[0]?.currentTime || 0);
  }

  function updateVolume(name: string, volume: number) {
    setPartStates((prev: Array<PartState>) =>
      prev.map((part, index) => {
        if (part.name === name) {
          audioRefs.current[index]!.volume = volume;
        }
        return part.name === name ? { ...part, volume: volume } : part;
      }),
    );
  }

  function updateMute(name: string, mute: boolean) {
    setPartStates((prev: Array<PartState>) =>
      prev.map((part) =>
        part.name === name ? { ...part, muted: mute } : part,
      ),
    );
  }

  function updateSolo(name: string, solo: boolean) {
    if (solo) {
      setPartsSoloed((prev) => prev + 1);
    } else {
      setPartsSoloed((prev) => prev - 1);
    }

    setPartStates((prev: Array<PartState>) =>
      prev.map((part) =>
        part.name === name ? { ...part, soloed: solo } : part,
      ),
    );
  }

  return (
    <div className="m-20 max-w-300 flex flex-col gap-10">
      {partStates?.map((part, index) =>
        index === 0 ? (
          <audio
            onEnded={handlePause}
            onTimeUpdate={updateTime}
            ref={(ref) => {
              audioRefs.current[index] = ref;
            }}
            muted={part.muted || (partsSoloed > 0 && !part.soloed)}
            src={part.path}
            key={part.name}
          />
        ) : (
          <audio
            ref={(ref) => {
              audioRefs.current[index] = ref;
            }}
            muted={part.muted || (partsSoloed > 0 && !part.soloed)}
            src={part.path}
            key={part.name}
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
      <PartSettings
        partStates={partStates}
        updateVolume={updateVolume}
        updateMute={updateMute}
        updateSolo={updateSolo}
      />
    </div>
  );
}
