import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";

import ProgressBar from "./ProgressBar";

interface TransportProps {
  duration: number;
  currentTime: number;
  playing: boolean;
  play: () => void;
  pause: () => void;
  move: (timestamp: number) => void;
}

export default function Transport(props: TransportProps) {
  function formatTime(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  }

  return (
    <>
      <div className="flex flex-col py-2 md:py-0 md:flex-row items-center gap-2 md:gap-4">
        <div className="flex flex-row items-center gap-4">
          <button className="cursor-pointer" onClick={() => props.move(0)}>
            <SkipPreviousIcon fontSize="large" />
          </button>
          {props.playing ? (
            <button className="cursor-pointer" onClick={props.pause}>
              <PauseIcon fontSize="large" />
            </button>
          ) : (
            <button className="cursor-pointer" onClick={props.play}>
              <PlayArrowIcon fontSize="large" />
            </button>
          )}
        </div>

        <p className="hidden md:block w-20">{formatTime(props.currentTime)}</p>

        <ProgressBar
          duration={props.duration}
          currentTime={props.currentTime}
          move={props.move}
        />

        <p className="hidden md:block">{formatTime(props.duration)}</p>

        <div className="md:hidden w-full flex flex-row justify-between">
          <p className="">{formatTime(props.currentTime)}</p>
          <p className="">{formatTime(props.duration)}</p>
        </div>
      </div>
    </>
  );
}
