import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";
// import SkipPreviousIcon from "@mui/icons-material/SkipPrevious";

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
  return (
    <>
      <div className="flex flex-row items-center">
        {props.playing ? (
          <button onClick={props.pause}>
            <PauseIcon />
          </button>
        ) : (
          <button onClick={props.play}>
            <PlayArrowIcon />
          </button>
        )}
      </div>
      <ProgressBar
        duration={props.duration}
        currentTime={props.currentTime}
        move={props.move}
      />
    </>
  );
}
