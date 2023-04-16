import { type IProgressPayload } from "@/models/GameModel";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { type NextApiHandler } from "next";

const saveGameProgress: NextApiHandler = async (req, res) => {
  const {
    query: { id },
    body,
  } = req;
  const { payload } = body as IProgressPayload;
  const supabase = createServerSupabaseClient({ req, res });

  if (payload == null || !Array.isArray(payload) || payload.length === 0) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  const { data, error } = await supabase
    .from("games")
    .select("progress")
    .eq("id", id)
    .single();

  if (error !== null) {
    console.error("unable to get game progress", id, error);
    return res.status(400).json({ message: "Unable to get game progress", id });
  }

  if (data.progress === null) {
    const { data: updateData, error: updateError } = await supabase
      .from("games")
      .update({ progress: payload })
      .eq("id", id)
      .select("progress")
      .single();
    if (updateError !== null) {
      console.error("unable to update game progress", id, error);
      return res
        .status(400)
        .json({ message: "Unable to update game progress", id });
    }
    return res.status(200).json({
      message: "Game progress successfully updated!",
      data: updateData.progress,
    });
  }

  return res.status(200).json({
    message: "Hello world!",
    old: data.progress,
    new: payload,
  });
};

const handler: NextApiHandler = async (req, res) => {
  const { method = "[Not Found]" } = req;
  switch (method) {
    case "POST":
      return saveGameProgress(req, res);
    default:
      res.setHeader("Allow", ["POST"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
