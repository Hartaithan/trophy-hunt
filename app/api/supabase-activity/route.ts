import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const GET = async (): Promise<Response> => {
  try {
    const supabase = createClient(cookies());
    const { data, error } = await supabase
      .from("games")
      .select("created_at")
      .limit(1);
    if (error !== null) throw new Error(error.message);
    return Response.json(data);
  } catch (error) {
    const message = (error as Error).message ?? "An error occurred.";
    return Response.json({ error: message }, { status: 400 });
  }
};
