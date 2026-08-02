import { Link } from "react-router";
import MenuIcon from "@mui/icons-material/Menu";
import { Popover, Switch } from "radix-ui";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeDownIcon from "@mui/icons-material/VolumeDown";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import SettingsIcon from "@mui/icons-material/Settings";
import MediaQuery from "react-responsive";
import VolumeSlider from "../VolumeSlider";

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

      <MediaQuery maxWidth={768}>
        <div className="flex">
          <Popover.Root>
            <Popover.Trigger asChild>
              <button className="cursor-pointer" aria-label="Settings">
                <SettingsIcon fontSize="large" />
              </button>
            </Popover.Trigger>
            <Popover.Portal>
              <Popover.Content
                sideOffset={5}
                className={`${props.dark ? "dark" : ""} w-60 dark:text-white mr-4 rounded-md border border-slate-300 dark:border-gray-600 shadow p-4 bg-white dark:bg-gray-900 flex flex-col gap-6`}
              >
                <div className="flex flex-row items-center gap-4 justify-between">
                  Dark Mode
                  <Switch.Root
                    className={`cursor-pointer w-16 h-9 p-1 rounded-full border transition duration-200 ease-in-out ${props.dark ? "bg-cyan-500" : "bg-slate-100"} border-slate-300 dark:border-gray-600`}
                    checked={props.dark}
                    onCheckedChange={props.onToggleDark}
                  >
                    <Switch.Thumb
                      className={`block size-6 border shadow border-slate-300 rounded-full bg-white transition duration-200 ease-in-out ${!props.dark ? "translate-x-1" : "translate-x-7"}`}
                    />
                  </Switch.Root>
                </div>

                <div className="flex flex-row items-center gap-6 mr-2 justify-between">
                  Volume
                  <VolumeSlider
                    value={props.masterVolume * 100}
                    onChange={(value: number[]) => {
                      props.onChangeVolume(value[0] / 100);
                    }}
                  />
                </div>
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>
      </MediaQuery>

      <MediaQuery minWidth={768}>
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

          <div className="flex flex-row items-center w-40 mr-4">
            {(function () {
              if (props.masterVolume == 0) {
                return <VolumeOffIcon fontSize="large" />;
              }
              if (props.masterVolume < 0.5) {
                return <VolumeDownIcon fontSize="large" />;
              }
              return <VolumeUpIcon fontSize="large" />;
            })()}
            <VolumeSlider
              value={props.masterVolume * 100}
              onChange={(value: number[]) => {
                props.onChangeVolume(value[0] / 100);
              }}
            />
          </div>

          <button className="cursor-pointer" onClick={props.onToggleDark}>
            {props.dark ? (
              <DarkModeIcon fontSize="large" />
            ) : (
              <LightModeIcon fontSize="large" />
            )}
          </button>
        </div>
      </MediaQuery>
    </div>
  );
}
