import type { PartState } from "./layout/Player";
import { Slider } from "radix-ui";
import ToggleButton from "./ToggleButton";

interface SettingsProps {
  state: PartState;
  updateVolume: (name: string, volume: number) => void;
  updateMute: (name: string, mute: boolean) => void;
  updateSolo: (name: string, solo: boolean) => void;
}

export default function Settings(props: SettingsProps) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:gap-4 md:items-center">
      <p className="w-30">{props.state.name}</p>
      <div className="w-full flex flex-row items-center justify-between gap-4">
        <ToggleButton
          value={props.state.muted}
          handleClick={() =>
            props.updateMute(props.state.name, !props.state.muted)
          }
        >
          M
        </ToggleButton>
        <ToggleButton
          value={props.state.soloed}
          handleClick={() =>
            props.updateSolo(props.state.name, !props.state.soloed)
          }
        >
          S
        </ToggleButton>
        <Slider.Root
          className="group relative flex items-center w-full md:max-w-100 h-2 md:pl-2"
          onValueChange={(value: number[]) => {
            props.updateVolume(props.state.name, value[0] / 100);
          }}
          value={[props.state.volume * 100]}
          max={100}
          step={1}
        >
          <Slider.Track className="relative grow size-full overflow-hidden rounded-full bg-slate-300">
            <Slider.Range className="absolute grow h-full bg-cyan-500" />
          </Slider.Track>
          <Slider.Thumb
            className="p-2 aspect-square rounded-sm bg-cyan-500 outline-0"
            aria-label="Volume"
          />
        </Slider.Root>
      </div>
    </div>
  );
}
