import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

interface Data {
  id: number;
  value: string;
}

const table = "keep-alive";

export const GET = async (): Promise<Response> => {
  try {
    const sb = createClient(cookies());
    const { data, error } = await sb.from(table).select("id").single<Data>();
    if (error !== null) throw new Error(error.message);
    const payload = { value: new Date().toISOString() };
    const remove = await sb.from(table).update(payload).eq("id", data.id);
    if (remove.error !== null) throw new Error(remove.error.message);
    return Response.json(`Success! ${payload.value}`);
  } catch (error) {
    const message = (error as Error).message ?? "An error occurred.";
    return Response.json(message, { status: 400 });
  }
};
