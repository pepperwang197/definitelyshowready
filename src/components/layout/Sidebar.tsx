import { Link } from "react-router";

import type { SongData } from "../../App";

interface SidebarProps {
  metadata: Array<SongData>;
}

export default function Sidebar(props: SidebarProps) {
  return (
    <div className="min-w-60 h-full flex flex-col border-r border-slate-300">
      {props.metadata.map((data: SongData) => (
        <Link
          to={`definitelyshowready/${data.dirName}/`}
          className="p-4 hover:bg-slate-100 border-b border-slate-300"
          key={data.dirName}
        >
          {data.displayName}
        </Link>
      ))}
    </div>
  );
}
