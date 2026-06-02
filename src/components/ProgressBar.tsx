import { useEffect, useState } from "react";
import { Slider } from "radix-ui";

interface progressBarProps {
  duration: number;
  currentTime: number;
  move: (timestamp: number) => void;
}

export default function ProgressBar(props: progressBarProps) {
  const [position, setPosition] = useState(props.currentTime);

  useEffect(() => {
    setPosition(props.currentTime);
  }, [props.currentTime]);

  return (
    <>
      <Slider.Root
        className="group relative flex items-center w-full h-2"
        onValueChange={(value: number[]) => {
          setPosition(value[0]);
        }}
        onValueCommit={(value: number[]) => {
          props.move(value[0]);
        }}
        value={[position]}
        max={props.duration}
        step={1}
      >
        <Slider.Track className="relative grow size-full overflow-hidden rounded-full bg-black">
          <Slider.Range className="absolute grow h-full bg-gray-400" />
        </Slider.Track>
        <Slider.Thumb
          className="hidden p-1 w-8 aspect-square rounded-full bg-gray-400 outline-0 group-hover:block"
          aria-label="Volume"
        />
      </Slider.Root>
    </>
  );
}
