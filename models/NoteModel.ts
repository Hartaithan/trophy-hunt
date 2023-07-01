export interface INote {
  id: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  username: string;
  game_id: number;
  trophy_id: number;
  content: string;
}

export interface IAddNotePayload {
  game_id: number;
  trophy_id: number;
  content: string;
}

export interface INewNotePayload
  extends Omit<INote, "id" | "created_at" | "updated_at" | "content"> {
  content: string | null;
}
