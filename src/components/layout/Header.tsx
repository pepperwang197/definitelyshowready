import { Link } from "react-router";
import MenuIcon from "@mui/icons-material/Menu";
import { Slider } from "radix-ui";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeDownIcon from "@mui/icons-material/VolumeDown";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

interface HeaderProps {
  dark: boolean;
  masterVolume: number;
  metronome: boolean;
  onToggleDark: () => void;
  onToggleMetronome: () => void;
  onChangeVolume: (newVolume: number) => void;
  onExpandToggle: () => void;
}

export default function Header(props: HeaderProps) {
  return (
    <div className="w-full px-8 py-4 border-b bg-white dark:bg-gray-900 border-slate-300 dark:border-gray-600 text-cyan-500 text-l font-black flex flex-row justify-between">
      <div className="flex flex-row items-center gap-6">
        <button className="cursor-pointer" onClick={props.onExpandToggle}>
          <MenuIcon fontSize="large" />
        </button>
        <Link to="/">
          <img
            src={`${import.meta.env.BASE_URL}/logo.png`}
            alt="DefinitelyShowReady"
            className="h-16"
          />
        </Link>
      </div>

      <div className="flex flex-row items-center gap-2">
        <button
          className="hidden md:block mx-4 cursor-pointer"
          onClick={props.onToggleMetronome}
        >
          {props.metronome ? (
            <img
              className="min-w-6 mx-1"
              src={`${import.meta.env.BASE_URL}/metronome_on.svg`}
            />
          ) : (
            <img
              className="min-w-6 mx-1 dark:invert"
              src={`${import.meta.env.BASE_URL}/metronome.svg`}
            />
          )}
        </button>

        {(function () {
          if (props.masterVolume == 0) {
            return <VolumeOffIcon fontSize="large" />;
          }
          if (props.masterVolume < 0.5) {
            return <VolumeDownIcon fontSize="large" />;
          }
          return <VolumeUpIcon fontSize="large" />;
        })()}
        <Slider.Root
          className="group relative cursor-pointer flex items-center m-2 w-30 md:max-w-100 h-2"
          onValueChange={(value: number[]) => {
            props.onChangeVolume(value[0] / 100);
          }}
          value={[props.masterVolume * 100]}
          max={100}
          step={1}
        >
          <Slider.Track className="relative -translate-x-1 grow size-full overflow-hidden rounded-full bg-slate-300 dark:bg-gray-600">
            <Slider.Range className="absolute grow h-full bg-cyan-500" />
          </Slider.Track>
          <Slider.Thumb
            className="p-2 aspect-square rounded-sm bg-cyan-500 outline-0"
            aria-label="Master Volume"
          />
        </Slider.Root>
        <button className="cursor-pointer" onClick={props.onToggleDark}>
          {props.dark ? (
            <DarkModeIcon fontSize="large" />
          ) : (
            <LightModeIcon fontSize="large" />
          )}
        </button>
      </div>
    </div>
  );
}
