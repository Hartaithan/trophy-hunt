import { validatePayload } from "@/helpers/payload";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { type NextApiHandler } from "next";

const getNote: NextApiHandler = async (req, res) => {
  const {
    query: { id },
  } = req;
  const supabase = createServerSupabaseClient({ req, res });

  if (id === undefined || Array.isArray(id)) {
    console.error("invalid [id] query", req.query);
    return res.status(400).json({ message: "Invalid [id] query" });
  }

  const { data, error } = await supabase
    .from("notes")
    .select("*")
    .eq("id", id)
    .single();

  if (error !== null) {
    console.error("unable to get note by id", id, error);
    return res.status(400).json({ message: "Unable to get note by id", id });
  }

  return res.status(200).json({ note: data });
};

const updateNote: NextApiHandler = async (req, res) => {
  const {
    query: { id },
    body,
  } = req;
  const supabase = createServerSupabaseClient({ req, res });

  if (id === undefined || Array.isArray(id)) {
    console.error("invalid [id] query", req.query);
    return res.status(400).json({ message: "Invalid [id] query" });
  }

  const results = validatePayload(body);
  if (results !== null) {
    console.error("invalid payload", results.errors);
    return res.status(400).json(results);
  }

  const { data, error } = await supabase
    .from("notes")
    .update(body)
    .eq("id", id)
    .select("*")
    .single();

  if (error !== null) {
    console.error("unable to update note by id", id, error);
    return res.status(400).json({ message: "Unable to update note by id", id });
  }

  return res
    .status(200)
    .json({ message: "Note successfully updated!", note: data });
};

const deleteNote: NextApiHandler = async (req, res) => {
  const {
    query: { id },
  } = req;
  const supabase = createServerSupabaseClient({ req, res });

  if (id === undefined || Array.isArray(id)) {
    console.error("invalid [id] query", req.query);
    return res.status(400).json({ message: "Invalid [id] query" });
  }

  const { error } = await supabase.from("notes").delete().eq("id", id);

  if (error !== null) {
    console.error("unable to delete note by id", id, error);
    return res.status(400).json({ message: "Unable to delete note by id", id });
  }

  return res.status(200).json({ message: "Note successfully deleted!", id });
};

const handler: NextApiHandler = async (req, res) => {
  const { method = "[Not Found]" } = req;
  switch (method) {
    case "GET":
      return getNote(req, res);
    case "PUT":
      return updateNote(req, res);
    case "DELETE":
      return deleteNote(req, res);
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
