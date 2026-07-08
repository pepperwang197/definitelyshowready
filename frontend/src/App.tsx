import { useState, useEffect } from "react";
import { Howl } from "howler";

import Transport from "./components/Transport";
import PartSettings from "./components/PartSettings";
import Click from "./components/Click";

export interface PartState {
  name: string;
  track: Howl;
  volume: number;
  muted: boolean;
  soloed: boolean;
}

interface SongData {
  songName: string;
  keySignature: string;
  timeSignature: string;
  bpmUnit: string;
  bpm: number;
  secsPerBeat: number;
  offset: number;
  duration: number;
  filenames: Array<string>;
}

export default function App() {
  const [songData, setSongData] = useState<SongData>();
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [beat, setBeat] = useState(0);
  // const [masterVolume, setMasterVolume] = useState(100);
  const [partStates, setPartStates] = useState<Array<PartState>>([]);
  const [partsSoloed, setPartsSoloed] = useState(0);

  // API CALL
  useEffect(() => {
    fetch(new URL("/data/", import.meta.env.BACKEND_URL))
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Parse the JSON data
      })
      .then((data) => {
        console.log("received metadata:", data);

        // TODO: have backend actually give offset
        setSongData({ ...data, secsPerBeat: 60 / data.bpm, offset: 0 });

        setPartStates(
          data.filenames.map((filename: string) => ({
            // change later
            name: filename.split(".")[0],
            track: new Howl({
              // src: `http://localhost:8080/files/${encodeURIComponent(filename)}?t=${Date.now()}`,
              src: `http://localhost:8080/files/${filename}`,
            }),
            volume: 0.7,
            muted: false,
            soloed: false,
          })),
        );
      })
      .catch((error) => console.error("Error fetching data:", error));
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

  useEffect(() => {
    if (songData) {
      const timer = setTimeout(() => {
        if (playing) {
          const newTime = currentTime + 20 / 1000;
          if ((beat + 1) * songData.secsPerBeat + songData.offset <= newTime) {
            setBeat(beat + 1);
          }
          setCurrentTime(newTime);
        }
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [currentTime, playing]);

  function handlePlay() {
    if (!playing) {
      console.log("PLAY");
      setPlaying(true);
      partStates.forEach((part) => {
        part.track.play();
      });
    }
  }

  function handlePause() {
    if (playing) {
      console.log("PAUSE");
      setPlaying(false);
      partStates.forEach((part) => {
        part.track.pause();
      });
    }
  }

  function handleMove(timestamp: number) {
    setCurrentTime(timestamp);
    partStates.forEach((part) => {
      part.track.seek(timestamp);
    });
  }

  function updateVolume(name: string, volume: number) {
    setPartStates((prev: Array<PartState>) =>
      prev.map((part) => {
        if (part.name === name) {
          part.track.volume(volume);
        }
        return part.name === name ? { ...part, volume: volume } : part;
      }),
    );
  }

  function updateMute(name: string, mute: boolean) {
    setPartStates((prev: Array<PartState>) =>
      prev.map((part) => {
        if (part.name === name) {
          part.track.mute(mute);
        }
        return part.name === name ? { ...part, muted: mute } : part;
      }),
    );
  }

  function updateSolo(name: string, solo: boolean) {
    let updatedPartsSoloed = partsSoloed;

    if (solo) {
      updatedPartsSoloed++;
    } else {
      updatedPartsSoloed--;
    }

    console.log(updatedPartsSoloed);

    let updatedStates = partStates.map((part) =>
      part.name === name ? { ...part, soloed: solo } : part,
    );

    partStates.forEach((part, index) => {
      if (
        part.muted ||
        (updatedPartsSoloed > 0 && !updatedStates[index].soloed)
      ) {
        part.track.mute(true);
      } else {
        part.track.mute(false);
      }
    });

    setPartsSoloed(updatedPartsSoloed);
    setPartStates(updatedStates);
  }

  return (
    <div className="m-20 max-w-300 flex flex-col gap-10">
      <Click beat={beat} />

      <div className="flex flex-row items-center gap-8">
        <h1 className="font-bold text-3xl">{songData?.songName}</h1>
        <p>{songData?.keySignature}</p>
        <p>{songData?.timeSignature}</p>
        <p>
          <span className="text-2xl">{songData?.bpmUnit}</span> ={" "}
          {songData?.bpm}
        </p>
      </div>

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
