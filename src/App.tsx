import { useState, useRef, useEffect } from "react";
import MidiPlayer from "midi-player-js";
import { Soundfont, ElectricPiano } from "smplr";

import Transport from "./components/Transport";
import PartSettings from "./components/PartSettings";

export interface PartState {
  name: string;
  path: string;
  volume: number;
  muted: boolean;
  soloed: boolean;
}

interface SongData {
  songName: string;
  keySignature: string;
  timeSignature: string;
  bpm: string;
  duration: number;
  names: Array<string>;
}

export default function App() {
  const audioCtxRef = useRef<AudioContext>(null);
  const audioBufferRef = useRef<AudioBuffer>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode>(null);

  const [songData, setSongData] = useState<SongData>();
  const [midiData, setMidiData] = useState<ArrayBuffer>();

  const [player, setPlayer] = useState<MidiPlayer.Player>();
  const [piano, setPiano] = useState<Soundfont>();

  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [masterVolume, setMasterVolume] = useState(100);
  const [partStates, setPartStates] = useState<Array<PartState>>([]);
  const [partsSoloed, setPartsSoloed] = useState(0);

  const audioRefs = useRef<Array<HTMLAudioElement | null>>([]);

  // API CALL
  useEffect(() => {
    fetch("http://localhost:8080/midi", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        console.log(response);
        return response.arrayBuffer();
      })
      .then((data) => {
        console.log("received midi:", data);
        setMidiData(data);
      }) // Handle the returned data
      .catch((error) => console.error("Error fetching data:", error));
    /////////////////////////

    fetch("http://localhost:8080/backing", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        console.log(response);
        return response.arrayBuffer();
      })
      .then((data) => {
        console.log("received audio:", data);
        return audioCtxRef.current!.decodeAudioData(data);
      })
      .then((decodedData) => {
        audioBufferRef.current = decodedData;
        sourceNodeRef.current = audioCtxRef.current!.createBufferSource();
        sourceNodeRef.current.buffer = audioBufferRef.current;

        sourceNodeRef.current.connect(audioCtxRef.current!.destination);
      })
      .catch((error) => console.error("Error fetching data:", error));

    /////////////////////////

    fetch("http://localhost:8080/data")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json(); // Parse the JSON data
      })
      .then((data) => {
        console.log("received metadata:", data);
        setSongData(data);
        setPartStates(
          data.names.map((name: string) => ({
            // change later
            name: name,
            volume: 0.7,
            muted: false,
            soloed: false,
          })),
        );
      }) // Handle the returned data
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  // INITIALIZE AUDIO CONTEXT
  useEffect(() => {
    audioCtxRef.current = new AudioContext();

    console.log("initialized context:", audioCtxRef.current);

    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close(); // Frees up browser audio threads
      }
      console.log("running audioctx cleanup");
    };
  }, []);

  // INITIALIZE INSTRUMENT
  useEffect(() => {
    setPiano(
      // Soundfont(audioCtxRef.current!, { instrument: "acoustic_grand_piano" }),
      ElectricPiano(audioCtxRef.current!, { instrument: "PianetT" }),
    );
    // console.log("made piano");
    return () => {
      if (piano) {
        piano!.dispose();
      }
      // console.log("disposed piano");
    };
  }, [audioCtxRef]);

  // INITIALIZE MIDIPLAYER
  useEffect(() => {
    if (midiData != null) {
      const myPlayer = new MidiPlayer.Player(function (event: any) {
        console.log(event);
        switch (event.name) {
          case "Note on":
            piano!.start({ note: event.noteName, velocity: 80 });
            break;
          case "Note off":
            piano?.stop(event.noteName);
            break;
          case "End of Track":
            handlePause();
            break;
        }
      });
      myPlayer.loadArrayBuffer(midiData);

      // console.log("loaded");

      myPlayer.on("playing", function (currentTick) {
        console.log("playing", currentTick);
      });

      // myPlayer.on("midiEvent", function (event) {
      //   console.log("midi event");
      // });

      setPlayer(myPlayer);

      // console.log("player", myPlayer);
    }
  }, [midiData]);

  // handle spacebar
  useEffect(() => {
    const handleGlobalKeyDown = (event: KeyboardEvent) => {
      if (event.key === " " && !event.repeat) {
        event.preventDefault();
        playing ? handlePause() : handlePlay();
      }
    };

    window.addEventListener("keydown", handleGlobalKeyDown);

    // Always clean up listeners to prevent application memory leaks
    return () => {
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, [playing]);

  function handlePlay() {
    if (!playing) {
      console.log("PLAY");
      setPlaying(true);
      player?.play();
      sourceNodeRef.current!.start(0);
    }
  }

  function handlePause() {
    if (playing) {
      console.log("PAUSE");
      setPlaying(false);
      player?.pause();
    }
  }

  function handleMove(timestamp: number) {
    setCurrentTime(timestamp);
    player?.skipToSeconds(timestamp);
  }

  function updateTime() {
    // update time based on audio elements' current time
    setCurrentTime(player?.getSongTime() || 0);
  }

  function updateVolume(name: string, volume: number) {
    setPartStates((prev: Array<PartState>) =>
      prev.map((part, index) => {
        if (part.name === name) {
          audioRefs.current[index]!.volume = volume;
        }
        return part.name === name ? { ...part, volume: volume } : part;
      }),
    );
  }

  function updateMute(name: string, mute: boolean) {
    setPartStates((prev: Array<PartState>) =>
      prev.map((part) =>
        part.name === name ? { ...part, muted: mute } : part,
      ),
    );
  }

  function updateSolo(name: string, solo: boolean) {
    if (solo) {
      setPartsSoloed((prev) => prev + 1);
    } else {
      setPartsSoloed((prev) => prev - 1);
    }

    setPartStates((prev: Array<PartState>) =>
      prev.map((part) =>
        part.name === name ? { ...part, soloed: solo } : part,
      ),
    );
  }

  return (
    <div className="m-20 max-w-300 flex flex-col gap-10">
      <div className="hidden">
        {partStates?.map((part, index) =>
          index === 0 ? (
            <audio
              onEnded={handlePause}
              onTimeUpdate={updateTime}
              ref={(ref) => {
                audioRefs.current[index] = ref;
              }}
              muted={part.muted || (partsSoloed > 0 && !part.soloed)}
              src={part.path}
              key={part.name}
            />
          ) : (
            <audio
              ref={(ref) => {
                audioRefs.current[index] = ref;
              }}
              muted={part.muted || (partsSoloed > 0 && !part.soloed)}
              src={part.path}
              key={part.name}
            />
          ),
        )}
      </div>

      <div className="flex flex-row items-center gap-8">
        <h1 className="font-bold text-3xl">{songData?.songName}</h1>
        <p>{songData?.keySignature}</p>
        <p>{songData?.timeSignature}</p>
        <p>{songData?.bpm}</p>
      </div>

      <Transport
        duration={songData?.duration || 0}
        currentTime={currentTime}
        playing={playing}
        play={handlePlay}
        pause={handlePause}
        move={handleMove}
      />
      <PartSettings
        partStates={partStates}
        updateVolume={updateVolume}
        updateMute={updateMute}
        updateSolo={updateSolo}
      />
    </div>
  );
}
