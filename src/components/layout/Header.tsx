import { Link } from "react-router";
import MenuIcon from "@mui/icons-material/Menu";
// import SettingsIcon from "@mui/icons-material/Settings";

interface HeaderProps {
  onExpandToggle: () => void;
}

export default function Header(props: HeaderProps) {
  const urlBase =
    "https://lytjllxvgnwrudwqfrpo.supabase.co/storage/v1/object/public/alicebyheart/";

  return (
    <div className="w-full px-6 py-4 border-b border-slate-300 text-cyan-500 text-l font-black flex items-center gap-6">
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

      {/* <SettingsIcon fontSize="large" className="self-end" /> */}
    </div>
  );
}
