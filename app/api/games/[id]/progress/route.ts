import { type Params } from "@/models/AppModel";
import {
  type ProgressItem,
  type ProgressPayload,
} from "@/models/ProgressModel";
import { validatePayload } from "@/utils/payload";
import {
  type SupabaseClient,
  createRouteHandlerClient,
} from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

interface GameParams {
  id: string;
}

const updateProgress = async (
  id: string,
  progress: ProgressItem[],
  supabase: SupabaseClient,
): Promise<Response> => {
  const { data: updateData, error: updateError } = await supabase
    .from("games")
    .update({ progress })
    .eq("id", id)
    .select("progress")
    .single();
  if (updateError !== null) {
    console.error("unable to update game progress", id, updateError);
    return Response.json(
      { message: "Unable to update game progress", id },
      { status: 400 },
    );
  }
  return Response.json({
    message: "Game progress successfully updated!",
    progress: updateData.progress,
  });
};

export const POST = async (
  req: Request,
  { params }: Params<GameParams>,
): Promise<Response> => {
  const { id } = params;

  let body: ProgressPayload | null = null;
  try {
    const request: ProgressPayload = await req.json();
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

  if (id === undefined || Array.isArray(id)) {
    console.error("invalid [id] query", id);
    return Response.json({ message: "Invalid [id] query" }, { status: 400 });
  }

  const { payload } = body;
  if (payload == null || !Array.isArray(payload) || payload.length === 0) {
    console.error("invalid payload", payload);
    return Response.json({ message: "Invalid payload" }, { status: 400 });
  }

  const supabase = createRouteHandlerClient({ cookies });
  const { data, error } = await supabase
    .from("games")
    .select("progress")
    .eq("id", id)
    .single<{ progress: ProgressItem[] | null }>();

  if (error !== null) {
    console.error("unable to get game progress", id, error);
    return Response.json(
      { message: "Unable to get game progress", id },
      { status: 400 },
    );
  }

  if (data.progress === null) {
    return await updateProgress(id, payload, supabase);
  }

  const map = new Map<number, ProgressItem>();
  const combined = data.progress.concat(payload);
  for (let n = 0; n < combined.length; n++) {
    const el = combined[n];
    map.set(el.id, { ...map.get(el.id), ...el });
  }
  const merged = Array.from(map.values());

  return await updateProgress(id, merged, supabase);
};
