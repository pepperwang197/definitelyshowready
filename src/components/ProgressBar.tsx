import { useEffect, useState } from "react";
import { Slider } from "radix-ui";

interface progressBarProps {
  duration: number;
  currentTime: number;
  move: (timestamp: number) => void;
}

export default function ProgressBar(props: progressBarProps) {
  const [position, setPosition] = useState(props.currentTime);

  // console.log(position);

  useEffect(() => {
    setPosition(props.currentTime);
  }, [props.currentTime]);

  return (
    <>
      <Slider.Root
        className="group relative flex items-center w-full h-4"
        onValueChange={(value: number[]) => {
          // console.log(value);
          setPosition(value[0]);
        }}
        onValueCommit={(value: number[]) => {
          console.log(value);
          props.move(value[0]);
        }}
        value={[position]}
        max={props.duration}
        step={1}
      >
        <Slider.Track className="relative grow size-full overflow-hidden rounded-full bg-slate-300">
          <Slider.Range className="absolute grow h-full bg-cyan-500" />
        </Slider.Track>
        <Slider.Thumb
          className="hidden p-1 w-8 aspect-square rounded-full bg-cyan-500 outline-0 group-hover:block"
          aria-label="Volume"
        />
      </Slider.Root>
    </>
  );
}
