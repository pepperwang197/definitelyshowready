import { useState, useEffect } from "react";
import { Howl } from "howler";

import Transport from "../Transport";
import PartSettings from "../PartSettings";
// import Click from "../Click";

import type { SongData } from "../../App";
import Spinner from "../Spinner";
import SongInfoCard from "../SongInfoCard";

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

  const [tracksLoaded, setTracksLoaded] = useState<Array<boolean>>([]);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [beat, setBeat] = useState(0);
  // const [masterVolume, setMasterVolume] = useState(100);
  const [partStates, setPartStates] = useState<Array<PartState>>([]);
  const [partsSoloed, setPartsSoloed] = useState(0);

  // API CALL
  useEffect(() => {
    setTracksLoaded(Array(props.songData.filenames.length).fill(false));
    handlePause();

    console.log("received metadata:", props.songData);

    setPartStates(
      props.songData.filenames.map((filename: string, index: number) => ({
        name: props.songData.parts[index],
        track: new Howl({
          src: urlBase + props.songData.dirName + filename,
          onload: () => {
            setTracksLoaded((prev) => {
              return prev.map((element, i) => (i == index ? true : element));
            });
            console.log(props.songData.parts[index]);
          },
        }),
        volume: 0.7,
        muted: false,
        soloed: false,
      })),
    );
  }, [props.songData]);

  useEffect(() => {
    handleMove(0);
  }, [tracksLoaded.every((element) => element)]);

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

  function updateTime() {
    if (currentTime >= props.songData.duration) {
      handlePause();
    }
    if (playing) {
      const newTime = partStates[0].track.seek();
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
      handleMove(currentTime); // in case the tracks time gets off

      setPlaying(true);
      partStates.forEach((part) => {
        part.track.play();
      });
    }
  }

  function handlePause() {
    if (playing) {
      setPlaying(false);
      partStates.forEach((part) => {
        part.track.pause();
      });
    }
  }

  function handleForward5() {
    if (currentTime >= props.songData.duration - 5) {
      handleMove(props.songData.duration);
    } else {
      handleMove(currentTime + 5);
    }
  }

  function handleBack5() {
    if (currentTime <= 5) {
      handleMove(0);
    } else {
      handleMove(currentTime - 5);
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
      {!tracksLoaded.every((element) => element) && <Spinner />}

      <div className="px-10 md:px-20 py-10 max-w-200 flex flex-col gap-2 md:gap-10 text-black dark:text-white">
        {/* <Click beat={beat} /> */}

        <SongInfoCard songData={props.songData} />

        <Transport
          duration={props.songData.duration || 0}
          currentTime={currentTime}
          playing={playing}
          play={handlePlay}
          pause={handlePause}
          move={handleMove}
          forward5={handleForward5}
          back5={handleBack5}
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
