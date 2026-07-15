import { Link } from "react-router";
import MenuIcon from "@mui/icons-material/Menu";
import { Popover, Switch } from "radix-ui";
import SettingsIcon from "@mui/icons-material/Settings";

interface HeaderProps {
  dark: boolean;
  onToggleDark: () => void;
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
            <Popover.Content sideOffset={5}>
              <div
                className={`${props.dark ? "dark" : ""} mr-4 rounded-md border dark:text-white border-slate-300 dark:border-gray-600 shadow p-4 bg-white dark:bg-gray-900 flex flex-col gap-4`}
              >
                <div className="flex flex-row items-center gap-4">
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
              </div>
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
    </div>
  );
}
