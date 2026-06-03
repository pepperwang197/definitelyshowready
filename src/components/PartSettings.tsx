import Settings from "./Settings";
import type { PartState } from "../App";

interface PartSettingsProps {
  partStates: Array<PartState>;
}

export default function PartSettings(props: PartSettingsProps) {
  return (
    <div>
      <ul>
        {props.partStates.map((part) => (
          <Settings state={part} key={part.name} />
        ))}
      </ul>
    </div>
  );
}
