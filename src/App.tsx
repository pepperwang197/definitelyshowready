import Header from "./components/layout/Header";
import Player from "./components/layout/Player";
import Homepage from "./components/layout/Homepage";
import Sidebar from "./components/layout/Sidebar";
import { BrowserRouter, Routes, Route } from "react-router";
import { useEffect, useState } from "react";

export interface SongData {
  displayName: string; // deez nuts
  dirName: string;
  keySignature: string;
  timeSignature: string;
  bpmUnit: string;
  bpm: number;
  secsPerBeat: number;
  offset: number;
  duration: number;
  parts: Array<string>;
  filenames: Array<string>;
}

export default function App() {
  const urlBase =
    "https://lytjllxvgnwrudwqfrpo.supabase.co/storage/v1/object/public/alicebyheart/";

  const [metadata, setMetadata] = useState<Array<SongData>>([]);

  useEffect(() => {
    fetch(urlBase + "data.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Parse the JSON data
      })
      .then((data) => {
        setMetadata(data.songs);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <BrowserRouter>
      <Header />

      <div className="flex flex-row h-full">
        <div className="h-screen">
          <Sidebar metadata={metadata || []} />
        </div>

        <div className="size-full">
          <Routes>
            <Route path="definitelyshowready" element={<Homepage />} />
            {metadata.map((data: SongData) => (
              <Route
                path={`definitelyshowready/${data.dirName}`}
                element={<Player songData={data} />}
              />
            ))}
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}
