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
      <div className="flex flex-row items-center gap-4">
        <button onClick={() => props.move(0)}>
          <SkipPreviousIcon fontSize="large" />
        </button>
        {props.playing ? (
          <button onClick={props.pause}>
            <PauseIcon fontSize="large" />
          </button>
        ) : (
          <button onClick={props.play}>
            <PlayArrowIcon fontSize="large" />
          </button>
        )}
        <p>{formatTime(props.currentTime)}</p>
        <ProgressBar
          duration={props.duration}
          currentTime={props.currentTime}
          move={props.move}
        />
        <p>{formatTime(props.duration)}</p>
      </div>
    </>
  );
}
