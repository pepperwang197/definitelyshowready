import { Howl } from "howler";
import { useEffect, useState, type ChangeEvent } from "react";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

interface MetronomeProps {
  focus: () => void;
  blur: () => void;
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

  return (
    <div className="bg-white dark:bg-gray-900 py-4 px-8 border-l border-slate-300 dark:border-gray-600 text-black dark:text-white">
      <header className="mb-4 text-xl font-bold">Metronome</header>
      <div className="flex flex-row gap-4 items-center">
        <div className="flex flex-col gap-2 items-center">
          <div className="p-4 rounded-lg border border-slate-300 dark:border-gray-600">
            <input
              className="focus:outline-none text-2xl font-bold"
              type="number"
              min="40"
              max="218"
              value={bpm}
              onChange={updateBpm}
              onFocus={props.focus}
              onBlur={props.blur}
            />
          </div>
          BPM
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
    </div>
  );
}
