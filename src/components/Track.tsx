import MidiPlayer from "midi-player-js";
import { Howl } from "howler";
import { ElectricPiano } from "smplr";

interface Track {
  name: string;
  volume: number;
  muted: boolean;
  soloed: boolean;
  play(): void;
  pause(): void;
  seek(timestamp: number): void;
  changeVolume(volume: number): void;
  mute(mute: boolean): void;
}

class AudioTrack implements Track {
  name: string;
  player: Howl;
  volume: number = 0.7;
  muted: boolean = false;
  soloed: boolean = false;

  constructor(name: string, buffer: ArrayBuffer) {
    this.name = name;

    const blob = new Blob([buffer], { type: "audio/wav" });
    const blobUrl = URL.createObjectURL(blob);

    this.player = new Howl({
      src: [blobUrl],
    });
  }

  play() {
    this.player.play();
  }

  pause() {
    this.player.pause();
  }

  seek(timestamp: number) {
    this.player.seek(timestamp);
  }

  changeVolume(volume: number): void {
    this.volume = volume;
    this.player.volume(volume);
  }

  mute(mute: boolean): void {
    this.muted = mute;
    this.player.mute(mute);
  }
}

class MidiTrack implements Track {
  name: string;
  player: MidiPlayer.Player;
  volume: number = 0.7;
  muted: boolean = false;
  soloed: boolean = false;

  constructor(name: string, buffer: ArrayBuffer, instrument: ElectricPiano) {
    this.name = name;
    const midiPlayer = new MidiPlayer.Player(function (event: any) {
      console.log(event);
      switch (event.name) {
        case "Note on":
          instrument!.start({ note: event.noteName, velocity: this.volume });
          break;
        case "Note off":
          instrument?.stop(event.noteName);
          break;
      }
    });
    midiPlayer.loadArrayBuffer(buffer);

    this.player = midiPlayer;
  }

  play() {
    this.player.play();
  }

  pause() {
    this.player.pause();
  }

  seek(timestamp: number) {
    this.player.skipToSeconds(timestamp);
  }

  changeVolume(volume: number): void {
    this.volume = volume;
  }

  mute(mute: boolean): void {
    this.muted = mute;
  }
}
