import type { PartState } from "../App";
import { Slider } from "radix-ui";

interface SettingsProps {
  state: PartState;
}

export default function Settings({ state }: SettingsProps) {
  return (
    <div className="flex flex-row gap-4">
      <p>{state.name}</p>
      <button>M</button>
      <button>S</button>
      <Slider.Root
        className="group relative flex items-center w-full h-2"
        onValueChange={(value: number[]) => {
          // setPosition(value[0]);
        }}
        onValueCommit={(value: number[]) => {
          // props.move(value[0]);
        }}
        // value={[position]}
        max={100}
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
    </div>
  );
}
