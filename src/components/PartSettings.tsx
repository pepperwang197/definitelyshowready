import Settings from "./Settings";
import type { PartState } from "./layout/Player";
import { Checkbox } from "radix-ui";
import CheckIcon from "@mui/icons-material/Check";

interface PartSettingsProps {
  partStates: Array<PartState>;
  updateVolume: (name: string, volume: number) => void;
  updateMute: (name: string, mute: boolean) => void;
  updateSolo: (name: string, solo: boolean) => void;
  updateSelection: (name: string, solo: boolean) => void;
  selecting: boolean;
}

export default function PartSettings(props: PartSettingsProps) {
  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-4">
        {props.partStates.map((part) => (
          <div key={part.name} className="flex flex-row gap-4 items-center">
            <Checkbox.Root
              className={`${!props.selecting && "hidden"} flex size-6 aspect-square items-center justify-center rounded cursor-pointer bg-slate-300 dark:bg-gray-600`}
              checked={part.selected || false}
              onCheckedChange={() => {
                console.log("changing", part.name, "to", !part.selected);
                props.updateSelection(part.name, !part.selected);
              }}
            >
              <Checkbox.Indicator>
                <CheckIcon />
              </Checkbox.Indicator>
            </Checkbox.Root>

            <Settings
              state={part}
              updateVolume={props.updateVolume}
              updateMute={props.updateMute}
              updateSolo={props.updateSolo}
            />
          </div>
        ))}
      </ul>
    </div>
  );
}
