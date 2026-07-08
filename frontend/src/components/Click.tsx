import { useEffect, useState } from "react";
import { Howl } from "howler";

interface ClickProps {
  beat: number;
}

export default function ClickTrack(props: ClickProps) {
  const [sound, setSound] = useState<Howl>();

  useEffect(() => {
    setSound(new Howl({ src: "/src/assets/click.wav" }));
  }, []);

  useEffect(() => {
    sound?.play();
  }, [props.beat]);

  return <></>;
}
