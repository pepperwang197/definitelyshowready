import { Piano, MidiNumbers } from "react-piano";
import { Soundfont } from "smplr";
import { WebMidi } from "webmidi";
import "react-piano/dist/styles.css";
import { useEffect, useState } from "react";
import VolumeSlider from "../VolumeSlider";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeDownIcon from "@mui/icons-material/VolumeDown";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";

interface PianoProps {
  masterVolume: number;
}

export default function PianoWindow(props: PianoProps) {
  const [context, _] = useState(new AudioContext());
  const [instrument, setInstrument] = useState<Soundfont>();
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    setInstrument(Soundfont(context, { instrument: "acoustic_grand_piano" }));
  }, []);

  useEffect(() => {
    WebMidi.enable()
      .then(onEnableMidi)
      .catch((err) => alert(err));

    return () => {
      WebMidi.inputs.forEach((input) => {
        input.channels.forEach((channel) => {
          channel.removeListener();
        });
      });
    };
  }, [instrument]);

  function onEnableMidi() {
    WebMidi.inputs.forEach((input) => {
      input.addListener("noteon", (e: any) => {
        console.log(e);
        instrument?.start({
          note: e.note.number,
          velocity: volume * 127 * e.velocity * props.masterVolume,
        });
      });
      input.addListener("noteoff", (e) => {
        instrument?.stop(e.note.number);
      });
    });
  }

  return (
    <div className="size-full select-none bg-white dark:bg-gray-900 md:border-t border-slate-300 dark:border-gray-600 text-black dark:text-white">
      <div
        className="size-full py-4 px-8"
        onMouseDown={(event) => event.preventDefault()}
      >
        <header className="mb-4 text-xl font-bold flex flex-row items-center gap-4">
          <span>Piano</span>
          <div className="flex flex-row items-center w-40 text-cyan-500">
            {(function () {
              if (volume == 0) {
                return <VolumeOffIcon fontSize="large" />;
              }
              if (volume < 0.5) {
                return <VolumeDownIcon fontSize="large" />;
              }
              return <VolumeUpIcon fontSize="large" />;
            })()}
            <VolumeSlider
              value={volume * 100}
              onChange={(value: number[]) => {
                setVolume(value[0] / 100);
              }}
            />
          </div>
        </header>
        <div className="rotate-90 md:rotate-0 origin-bottom-left -translate-y-50 md:translate-0">
          <Piano
            noteRange={{
              first: MidiNumbers.fromNote("c3"),
              last: MidiNumbers.fromNote("c5"),
            }}
            playNote={(midiNumber: any) => {
              instrument?.start({
                note: midiNumber,
                velocity: volume * 127 * props.masterVolume,
              });
            }}
            stopNote={(midiNumber: any) => {
              instrument?.stop(midiNumber);
            }}
            width={1000}
          />
        </div>
      </div>
    </div>
  );
}
