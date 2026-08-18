import type { PartState } from "./layout/Player";
import ToggleButton from "./ToggleButton";
import VolumeSlider from "./VolumeSlider";

interface SettingsProps {
  state: PartState;
  updateVolume: (name: string, volume: number) => void;
  updateMute: (name: string, mute: boolean) => void;
  updateSolo: (name: string, solo: boolean) => void;
}

export default function Settings(props: SettingsProps) {
  return (
    <div className="w-full flex flex-col gap-2 md:flex-row md:gap-4 md:items-center">
      <p className="md:w-30 lg:w-40">{props.state.name}</p>
      <div className="w-full flex flex-row items-center gap-4">
        <ToggleButton
          value={props.state.muted}
          handleClick={() =>
            props.updateMute(props.state.name, !props.state.muted)
          }
          square={true}
        >
          M
        </ToggleButton>
        <ToggleButton
          value={props.state.soloed}
          handleClick={() =>
            props.updateSolo(props.state.name, !props.state.soloed)
          }
          square={true}
        >
          S
        </ToggleButton>

        <VolumeSlider
          value={props.state.volume * 100}
          onChange={(value: number[]) => {
            props.updateVolume(props.state.name, value[0] / 100);
          }}
        />
      </div>
    </div>
  );
}
