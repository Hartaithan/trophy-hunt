import { type Params } from "@/models/AppModel";
import { type Note } from "@/models/NoteModel";
import { validatePayload } from "@/utils/payload";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

interface NoteParams {
  id: string;
}

export const GET = async (
  _req: Request,
  { params }: Params<NoteParams>,
): Promise<Response> => {
  const { id } = params;
  if (id == null || Array.isArray(id)) {
    console.error("invalid [id] query", id);
    return Response.json({ message: "Invalid [id] query" }, { status: 400 });
  }

  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .single();

  if (error !== null) {
    console.error("unable to get note by id", id, error);
    return Response.json(
      { message: "Unable to get note by id", id },
      { status: 400 },
    );
  }

  return Response.json({ note: data });
};

export const PUT = async (
  req: Request,
  { params }: Params<NoteParams>,
): Promise<Response> => {
  const { id } = params;
  if (id == null || Array.isArray(id)) {
    console.error("invalid [id] query", id);
    return Response.json({ message: "Invalid [id] query" }, { status: 400 });
  }

  let body: Partial<Note> | null = null;
  try {
    const request: Partial<Note> = await req.json();
    body = request;
  } catch (error) {
    console.error("request body not found", error);
    return Response.json(
      { message: "Request body not found" },
      { status: 400 },
    );
  }

  const results = validatePayload(body);
  if (results !== null) {
    console.error("invalid payload", results.errors);
    return Response.json(results, { status: 400 });
  }

  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { data, error } = await supabase
    .from("notes")
    .update(body)
    .eq("id", id)
    .select("*")
    .single();

  if (error !== null) {
    console.error("unable to update note by id", id, error);
    return Response.json(
      { message: "Unable to update note by id", id },
      { status: 400 },
    );
  }

  return Response.json({ message: "Note successfully updated!", note: data });
};

export const DELETE = async (
  _req: Request,
  { params }: Params<NoteParams>,
): Promise<Response> => {
  const { id } = params;
  if (id == null || Array.isArray(id)) {
    console.error("invalid [id] query", id);
    return Response.json({ message: "Invalid [id] query" }, { status: 400 });
  }

  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { error } = await supabase.from("notes").delete().eq("id", id);

  if (error !== null) {
    console.error("unable to delete note by id", id, error);
    return Response.json(
      { message: "Unable to delete note by id", id },
      { status: 400 },
    );
  }

  return Response.json({ message: "Note successfully deleted!", id });
};
