import { Slider } from "radix-ui";

interface SliderProps {
  value: number; // should be between 0 and 1
  onChange: (value: number[]) => void;
}

export default function VolumeSlider(props: SliderProps) {
  return (
    <Slider.Root
      className="group relative flex items-center w-full md:max-w-100 h-2 ml-4"
      onValueChange={props.onChange}
      value={[props.value]}
      max={100}
      step={1}
    >
      <Slider.Track className="relative -translate-x-1 grow size-full overflow-hidden cursor-pointer rounded-full bg-slate-300 dark:bg-gray-600">
        <Slider.Range className="absolute grow h-full bg-cyan-500" />
      </Slider.Track>
      <Slider.Thumb
        className="p-2 aspect-square cursor-pointer rounded-sm bg-cyan-500 outline-0"
        aria-label="Volume"
      />
    </Slider.Root>
  );
}
