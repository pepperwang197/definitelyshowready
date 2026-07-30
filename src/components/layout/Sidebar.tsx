import { Link } from "react-router";

import type { SongData } from "../../App";

interface SidebarProps {
  metadata: Array<SongData>;
}

export default function Sidebar(props: SidebarProps) {
  return (
    <div className="min-w-60 h-full flex flex-col text-black dark:text-white">
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
