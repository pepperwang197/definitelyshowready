import { Howl } from "howler";
import { useEffect, useState, type ChangeEvent } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeDownIcon from "@mui/icons-material/VolumeDown";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeSlider from "../VolumeSlider";

interface MetronomeProps {
  focus?: () => void;
  blur?: () => void;
}

export default function Metronome(props: MetronomeProps) {
  const [bpm, setBpm] = useState(120);
  const [msPerBeat, setMsPerBeat] = useState(60000 / bpm);
  const [click, setClick] = useState<Howl>();
  const [volume, setVolume] = useState(1);
  const [playing, setPlaying] = useState(false);
  const [lastClick, setLastClick] = useState(Date.now());

  useEffect(() => {
    if (click === undefined || click?.state() == "unloaded") {
      setClick(
        new Howl({
          src: [`${import.meta.env.BASE_URL}/click.wav`],
          onload: () => {
            console.log("click loaded");
          },
          volume: volume,
        }),
      );
    }
  }, [click?.state()]);

  useEffect(() => {
    if (playing) {
      const intervalId = setInterval(() => {
        const now = Date.now();
        if (now - lastClick > msPerBeat) {
          setLastClick(now);
          click!.play();
        }
      }, 50);
      return () => {
        clearTimeout(intervalId);
      };
    }
  }, [playing, lastClick]);

  function updateBpm(event: ChangeEvent<HTMLInputElement>) {
    const newBpm = Number(event.target.value);
    setBpm(newBpm);
    setMsPerBeat(60000 / newBpm);
  }

  function changeVolume(newVolume: number) {
    setVolume(newVolume);
    click?.volume(newVolume);
  }

  return (
    <div className="bg-white dark:bg-gray-900 py-4 px-8 md:border-l border-slate-300 dark:border-gray-600 text-black dark:text-white">
      <header className="mb-4 text-xl font-bold flex flex-row items-center justify-between">
        Metronome
      </header>
      <div className="flex flex-row gap-16 items-center mb-2">
        <div className="p-4 rounded-lg border border-slate-300 dark:border-gray-600">
          <input
            className="focus:outline-none text-2xl font-bold"
            type="number"
            inputMode="numeric"
            min="40"
            max="218"
            value={bpm}
            onChange={updateBpm}
            onFocus={props.focus}
            onBlur={props.blur}
          />
        </div>
        <button
          className="text-white cursor-pointer p-2 rounded-full aspect-square bg-cyan-500"
          onClick={() => {
            setPlaying(!playing);
          }}
        >
          {playing ? (
            <PauseIcon fontSize="large" />
          ) : (
            <PlayArrowIcon fontSize="large" />
          )}
        </button>
      </div>
      BPM
      <div className="flex flex-row items-center max-w-60 mt-4 text-cyan-500">
        {(function () {
          if (volume == 0) {
            return <VolumeOffIcon fontSize="large" />;
          }
          if (volume < 0.5) {
            return <VolumeDownIcon fontSize="large" />;
          }
          return <VolumeUpIcon fontSize="large" />;
        })()}
        <VolumeSlider
          value={volume * 100}
          onChange={(value: number[]) => {
            changeVolume(value[0] / 100);
          }}
        />
      </div>
    </div>
  );
}
