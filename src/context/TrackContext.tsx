import { createContext } from "react";

export interface TrackInfo {
  name: string;
}

export const TrackContext = createContext({ name: "myName" });
