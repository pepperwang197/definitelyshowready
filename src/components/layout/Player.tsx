import { useState, useEffect } from "react";
import { Howl, Howler } from "howler";

import Transport from "../Transport";
import PartSettings from "../PartSettings";

import type { SongData } from "../../App";
import Spinner from "../Spinner";
import SongInfoCard from "../SongInfoCard";

interface PlayerProps {
  songData: SongData;
  focused: boolean;
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
  const [partStates, setPartStates] = useState<Array<PartState>>([]);
  const [partsSoloed, setPartsSoloed] = useState(0);
  const [secsPerBeat, setSecsPerBeat] = useState<number>();
  const [clickMute, setClickMute] = useState(
    localStorage.getItem("clickMute") == "false" ? false : true,
  );

  const [click, setClick] = useState<Howl>();

  // API CALL
  useEffect(() => {
    setTracksLoaded(Array(props.songData.filenames.length).fill(false));
    handlePause();
    handleMove(0);

    console.log("received metadata:", props.songData);

    setSecsPerBeat(60 / props.songData.bpm);

    setClick(
      new Howl({
        src: [`${import.meta.env.BASE_URL}/click.m4a`],
        onload: () => {
          console.log("click loaded");
        },
        mute: clickMute,
      }),
    );

    setPartStates(
      props.songData.filenames.map((filename: string, index: number) => ({
        name: props.songData.parts[index],
        track: new Howl({
          src: urlBase + props.songData.dirName + filename,
          volume: 0.7,
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

    return () => {
      Howler.unload();
    };
  }, [props.songData]);

  useEffect(() => {
    handleMove(0);
  }, [tracksLoaded.every((element) => element)]);

  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (!props.focused && !event.repeat) {
        event.preventDefault();
        switch (event.key) {
          case " ":
            event.preventDefault();
            playing ? handlePause() : handlePlay();
            break;
          case "ArrowLeft":
            event.preventDefault();
            handleBack5();
            break;
          case "ArrowRight":
            event.preventDefault();
            handleForward5();
            break;
        }
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);

    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [playing, currentTime]);

  useEffect(() => {
    if (playing) {
      const intervalId = setInterval(() => {
        updateTime();
      }, 50);
      // console.log("set interval:", intervalId);
      return () => {
        clearTimeout(intervalId);
        // console.log("cleared", intervalId);
      };
    }
  }, [props.songData, currentTime, playing, beat]);

  function updateTime() {
    if (currentTime >= props.songData.duration) {
      handlePause();
    }

    if (playing) {
      const newTime = partStates[0].track.seek();
      if ((beat + 1) * secsPerBeat! + props.songData.offset <= newTime) {
        setBeat(beat + 1);
        click!.play();
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
    setBeat(Math.round(timestamp / secsPerBeat!));
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

  function toggleClickTrack() {
    setClickMute(!clickMute);
    click!.mute(!clickMute);
    localStorage.setItem("clickMute", !clickMute ? "true" : "false");
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

      <div className="px-10 md:px-20 py-10 max-w-300 flex flex-col gap-2 md:gap-10 text-black dark:text-white">
        <SongInfoCard songData={props.songData} />

        <Transport
          duration={props.songData.duration || 0}
          currentTime={currentTime}
          playing={playing}
          clickMute={clickMute}
          play={handlePlay}
          pause={handlePause}
          move={handleMove}
          forward5={handleForward5}
          back5={handleBack5}
          toggleClick={toggleClickTrack}
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
