import { useState, useEffect } from "react";
import { Howl } from "howler";

import Transport from "../Transport";
import PartSettings from "../PartSettings";
import Click from "../Click";

import type { SongData } from "../../App";

interface PlayerProps {
  songData: SongData;
}

export interface PartState {
  name: string;
  track: Howl;
  volume: number;
  muted: boolean;
  soloed: boolean;
}

export default function Player(props: PlayerProps) {
  const urlBase =
    "https://lytjllxvgnwrudwqfrpo.supabase.co/storage/v1/object/public/alicebyheart/";

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [beat, setBeat] = useState(0);
  // const [masterVolume, setMasterVolume] = useState(100);
  const [partStates, setPartStates] = useState<Array<PartState>>([]);
  const [partsSoloed, setPartsSoloed] = useState(0);

  // API CALL
  useEffect(() => {
    console.log("received metadata:", props.songData);

    setPartStates(
      props.songData.filenames.map((filename: string, index: number) => ({
        // change later
        name: props.songData.parts[index],
        track: new Howl({
          src: urlBase + props.songData.dirName + filename,
        }),
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

  useEffect(() => {
    // console.log("useeffect timeout being called");
    const intervalId = setInterval(() => {
      updateTime();
    }, 50);
    return () => clearTimeout(intervalId);
  }, [props.songData, currentTime, playing]);

  // console.log("dependencies:", currentTime, playing);

  function updateTime() {
    if (currentTime >= props.songData.duration) {
      handlePause();
    }
    if (playing) {
      const newTime = partStates[2].track.seek();
      if (
        (beat + 1) * props.songData.secsPerBeat + props.songData.offset <=
        newTime
      ) {
        setBeat(beat + 1);
      }
      setCurrentTime(newTime);
    }
  }

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
    setBeat(timestamp / props.songData.secsPerBeat);
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
    <>
      <div className="mx-20 my-10 max-w-200 flex flex-col gap-10">
        <Click beat={beat} />

        <div className="flex flex-row items-center gap-8">
          <h1 className="font-bold text-3xl">{props.songData.displayName}</h1>
          <p>{props.songData.keySignature}</p>
          <p>{props.songData.timeSignature}</p>
          <p>
            <span className="text-2xl">{props.songData.bpmUnit}</span> ={" "}
            {props.songData.bpm}
          </p>
        </div>

        <Transport
          duration={props.songData.duration || 0}
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
    </>
  );
}
