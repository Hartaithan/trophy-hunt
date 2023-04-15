import { type IReorderPayload } from "@/models/GameModel";
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { type NextApiHandler } from "next";

const reorderGames: NextApiHandler = async (req, res) => {
  const { payload } = req.body as IReorderPayload;
  const supabase = createServerSupabaseClient({ req, res });

  if (payload == null || payload.length === 0) {
    return res.status(400).json({ message: "Invalid payload" });
  }

  const { data, error } = await supabase.rpc("reorder", { payload });
  if (error !== null) {
    console.error("unable to reorder games", error);
    return res.status(400).json({ message: "Unable to reorder games" });
  }

  return res
    .status(200)
    .json({ message: "Games successfully reordered!", data });
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
