import { type PayloadObject } from "@/utils/payload";
import { type Dispatch, type SetStateAction } from "react";

export interface Note {
  id: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  username: string;
  game_id: number;
  trophy_id: number;
  content: string;
}

export interface AddNotePayload extends PayloadObject {
  game_id: number;
  trophy_id: number;
  content: string;
}

export interface NewNotePayload
  extends Omit<Note, "id" | "created_at" | "updated_at" | "content"> {
  content: string | null;
}

export interface NoteModalState {
  opened: boolean;
  game_id: number | null;
  trophy_id: number | null;
}

export interface NoteModalHandler extends NoteModalState {
  setState: Dispatch<SetStateAction<NoteModalState>>;
  open: (params?: Partial<NoteModalState>) => void;
  close: () => void;
}
