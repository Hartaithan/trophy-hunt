import { type ReorderPayload } from "@/models/GameModel";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { type NextApiHandler } from "next";

const reorderGames: NextApiHandler = async (req, res) => {
  const { items } = req.body as ReorderPayload;
  const supabase = createServerSupabaseClient({ req, res });

  if (items == null || items.length === 0) {
    console.error("invalid payload", items);
    return res.status(400).json({ message: "Invalid payload" });
  }

  const { error } = await supabase.rpc("reorder", { payload: items });
  if (error !== null) {
    console.error("unable to reorder games", error);
    return res.status(400).json({ message: "Unable to reorder games" });
  }

  return res.status(200).json({ message: "Games successfully reordered!" });
};

const handler: NextApiHandler = async (req, res) => {
  const { method = "[Not Found]" } = req;
  switch (method) {
    case "POST":
      return reorderGames(req, res);
    default:
      res.setHeader("Allow", ["POST"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
