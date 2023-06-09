import {
  type IProgressItem,
  type IProgressPayload,
} from "@/models/ProgressModel";
import {
  type SupabaseClient,
  createServerSupabaseClient,
} from "@supabase/auth-helpers-nextjs";
import { type NextApiResponse, type NextApiHandler } from "next";

const updateProgress = async (
  id: string,
  progress: IProgressItem[],
  supabase: SupabaseClient,
  res: NextApiResponse
): Promise<unknown> => {
  const { data: updateData, error: updateError } = await supabase
    .from("games")
    .update({ progress })
    .eq("id", id)
    .select("progress")
    .single();
  if (updateError !== null) {
    console.error("unable to update game progress", id, updateError);
    return res
      .status(400)
      .json({ message: "Unable to update game progress", id });
  }
  return res.status(200).json({
    message: "Game progress successfully updated!",
    progress: updateData.progress,
  });
};

const saveGameProgress: NextApiHandler = async (req, res) => {
  const {
    query: { id },
    body,
  } = req;
  const { payload } = body as IProgressPayload;
  const supabase = createServerSupabaseClient({ req, res });

  if (id === undefined || Array.isArray(id)) {
    console.error("invalid [id] query", req.query);
    return res.status(400).json({ message: "Invalid [id] query" });
  }

  if (payload == null || !Array.isArray(payload) || payload.length === 0) {
    console.error("invalid payload", payload);
    return res.status(400).json({ message: "Invalid payload" });
  }

  const { data, error } = await supabase
    .from("games")
    .select("progress")
    .eq("id", id)
    .single<{ progress: IProgressItem[] | null }>();

  if (error !== null) {
    console.error("unable to get game progress", id, error);
    return res.status(400).json({ message: "Unable to get game progress", id });
  }

  if (data.progress === null) {
    return await updateProgress(id, payload, supabase, res);
  }

  const map = new Map<number, IProgressItem>();
  const combined = data.progress.concat(payload);
  for (let n = 0; n < combined.length; n++) {
    const el = combined[n];
    map.set(el.id, { ...map.get(el.id), ...el });
  }
  const merged = Array.from(map.values());

  return await updateProgress(id, merged, supabase, res);
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
