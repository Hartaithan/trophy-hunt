import { type CSSProperties } from "react";

export interface CustomPosition {
  top?: string | number;
  left?: string | number;
  bottom?: string | number;
  right?: string | number;
  transform: CSSProperties["transform"];
}

export interface Params<T> {
  params: T;
}
