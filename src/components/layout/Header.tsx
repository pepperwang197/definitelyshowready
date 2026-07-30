import { Link } from "react-router";
import MenuIcon from "@mui/icons-material/Menu";
import { Popover, Switch, Slider } from "radix-ui";
import SettingsIcon from "@mui/icons-material/Settings";

interface HeaderProps {
  dark: boolean;
  masterVolume: number;
  onToggleDark: () => void;
  onChangeVolume: (newVolume: number) => void;
  onExpandToggle: () => void;
}

export default function Header(props: HeaderProps) {
  const urlBase =
    "https://lytjllxvgnwrudwqfrpo.supabase.co/storage/v1/object/public/alicebyheart/";

  return (
    <div className="w-full px-8 py-4 border-b bg-white dark:bg-gray-900 border-slate-300 dark:border-gray-600 text-cyan-500 text-l font-black flex flex-row justify-between">
      <div className="flex flex-row items-center gap-6">
        <button className="cursor-pointer" onClick={props.onExpandToggle}>
          <MenuIcon fontSize="large" />
        </button>
        <Link to="/definitelyshowready">
          <img
            src={urlBase + "logo.png"}
            alt="DefinitelyShowReady"
            className="h-16"
          />
        </Link>
      </div>

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

              <div className="flex flex-row items-center gap-6 justify-between">
                Volume
                <Slider.Root
                  className="group relative flex items-center m-2 w-full md:max-w-100 h-2 md:pl-2"
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
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </div>
  );
}
