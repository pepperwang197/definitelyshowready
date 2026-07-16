import { useState } from "react";
import type { SongData } from "../App";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

interface SongInfoProps {
  songData: SongData;
}

export default function SongInfoCard(props: SongInfoProps) {
  const notationSvgs = new Map([
    [
      "flat",
      "https://upload.wikimedia.org/wikipedia/commons/a/a7/U%2B266D.svg",
    ],
    [
      "sharp",
      "https://upload.wikimedia.org/wikipedia/commons/d/dd/U%2B266F.svg",
    ],
    [
      "eighth",
      "https://upload.wikimedia.org/wikipedia/commons/archive/0/07/20210405173426%218thNote.svg",
    ],
    [
      "quarter",
      "https://upload.wikimedia.org/wikipedia/commons/archive/e/ef/20210123112123%21Quarter_note_with_upwards_stem.svg",
    ],
    [
      "dotted_quarter",
      "https://upload.wikimedia.org/wikipedia/commons/c/c4/Dotted_quarter_note_with_upwards_stem.svg",
    ],
    [
      "half",
      "https://upload.wikimedia.org/wikipedia/commons/archive/0/09/20230306052014%21Half_note_with_upwards_stem.svg",
    ],
  ]);

  const timeSigSplit = props.songData.timeSignature.split("/");
  const keySigSplit = props.songData.keySignature.split(" ");

  const [infoHidden, setInfoHidden] = useState(true);

  return (
    <div className="flex flex-col md:flex-row items-center gap-2 md:gap-12">
      <div className="flex flex-row gap-2">
        <h1 className="font-bold text-3xl">{props.songData.displayName}</h1>
        <button
          className="md:hidden"
          onClick={() => {
            setInfoHidden(!infoHidden);
          }}
        >
          {infoHidden ? <ExpandMoreIcon /> : <ExpandLessIcon />}
        </button>
      </div>

      <div
        className={`${infoHidden ? "hidden" : "flex"} md:flex flex-row items-center gap-12 md:text-xl`}
      >
        {keySigSplit.length >= 3 ? (
          <div className="flex flex-row">
            <p className="translate-x-1">{keySigSplit[0]}</p>
            <img
              src={notationSvgs.get(keySigSplit[1])}
              className="h-6 dark:invert"
            />
            <p>{keySigSplit[2]}</p>
          </div>
        ) : (
          <p>{props.songData.keySignature}</p>
        )}

        <div className="flex flex-col items-center">
          <p className="translate-y-1">{timeSigSplit[0]}</p>
          <p className="-translate-y-1">{timeSigSplit[1]}</p>
        </div>
        <div className="flex flex-row items-center gap-1">
          <img
            className="h-8 dark:invert"
            src={notationSvgs.get(props.songData.bpmUnit)}
          />
          <p> = {props.songData.bpm}</p>
        </div>
      </div>
    </div>
  );
}
