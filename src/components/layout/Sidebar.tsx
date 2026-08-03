import { Link } from "react-router";
import PianoIcon from "@mui/icons-material/Piano";
import type { SongData } from "../../App";

interface SidebarProps {
  metadata: Array<SongData>;
}

export default function Sidebar(props: SidebarProps) {
  return (
    <div className="min-w-60 h-full flex flex-col bg-white dark:bg-gray-900 text-black dark:text-white">
      <Link
        to="/piano/"
        className="md:hidden flex flex-row items-center gap-4 p-4 hover:bg-slate-100 dark:hover:bg-gray-800 border-b border-slate-300 dark:border-gray-600"
      >
        <PianoIcon fontSize="large" />
        Piano
      </Link>
      <Link
        to="/metronome/"
        className="md:hidden flex flex-row items-center gap-4 p-4 hover:bg-slate-100 dark:hover:bg-gray-800 border-b border-slate-300 dark:border-gray-600"
      >
        <img
          className="w-6 mx-1 dark:invert"
          src={`${import.meta.env.BASE_URL}/metronome.svg`}
        />
        Metronome
      </Link>
      {props.metadata.map((data: SongData) => (
        <Link
          to={`/${data.dirName}/`}
          className="p-4 hover:bg-slate-100 dark:hover:bg-gray-800 border-b border-slate-300 dark:border-gray-600"
          key={data.dirName}
        >
          {data.displayName}
        </Link>
      ))}
    </div>
  );
}
