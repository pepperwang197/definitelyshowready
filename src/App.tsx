import Header from "./components/layout/Header";
import Player from "./components/layout/Player";
import Homepage from "./components/layout/Homepage";
import Sidebar from "./components/layout/Sidebar";
import MyScrollArea from "./components/MyScrollArea";
import { HashRouter, Routes, Route } from "react-router";
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
  const [sidebarExp, setSidebarExp] = useState(false);
  const [dark, setDark] = useState(false);
  const [masterVolume, setMasterVolume] = useState(1);

  useEffect(() => {
    setDark(localStorage.getItem("dark") == "true" ? true : false);
    setMasterVolume(Number(localStorage.getItem("masterVolume")) || 100);
  }, []);

  useEffect(() => {
    fetch(urlBase + "data.json", { cache: "no-store" })
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

  function handleToggleDark() {
    setDark(!dark);
    localStorage.setItem("dark", !dark ? "true" : "false");
  }

  function changeMasterVolume(newVolume: number) {
    setMasterVolume(newVolume);
    localStorage.setItem("masterVolume", String(newVolume));
  }

  return (
    <HashRouter>
      <div
        className={`flex flex-col overflow-hidden h-dvh ${dark ? "dark" : ""} bg-white dark:bg-gray-900`}
      >
        <div className="sticky top-0">
          <Header
            dark={dark}
            masterVolume={masterVolume}
            onToggleDark={handleToggleDark}
            onChangeVolume={changeMasterVolume}
            onExpandToggle={() => {
              setSidebarExp(!sidebarExp);
            }}
          />
        </div>

        <div className="grow flex flex-row overflow-hidden ">
          {sidebarExp && (
            <div className="flex h-full min-w-60 border-r border-slate-300 dark:border-gray-600">
              <MyScrollArea>
                <Sidebar metadata={metadata || []} />
              </MyScrollArea>
            </div>
          )}

          <div className="grow">
            <MyScrollArea>
              <Routes>
                <Route path="/" element={<Homepage />} />
                {metadata.map((data: SongData) => (
                  <Route
                    path={`/${data.dirName}`}
                    element={
                      <Player songData={data} masterVolume={masterVolume} />
                    }
                  />
                ))}
              </Routes>
            </MyScrollArea>
          </div>
        </div>
      </div>
    </HashRouter>
  );
}
