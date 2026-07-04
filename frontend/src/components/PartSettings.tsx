import Settings from "./Settings";
import type { PartState } from "../App";

interface PartSettingsProps {
  partStates: Array<PartState>;
  updateVolume: (name: string, volume: number) => void;
  updateMute: (name: string, mute: boolean) => void;
  updateSolo: (name: string, solo: boolean) => void;
}

export default function PartSettings(props: PartSettingsProps) {
  return (
    <div>
      <ul className="flex flex-col gap-4">
        {props.partStates.map((part) => (
          <Settings
            state={part}
            key={part.name}
            updateVolume={props.updateVolume}
            updateMute={props.updateMute}
            updateSolo={props.updateSolo}
          />
        ))}
      </ul>
    </div>
  );
}
