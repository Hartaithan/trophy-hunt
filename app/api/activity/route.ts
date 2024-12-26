import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const email = process.env.NEXT_PUBLIC_KEEP_ALIVE_USER ?? "";
const password = process.env.NEXT_PUBLIC_KEEP_ALIVE_PASSWORD ?? "";

export const GET = async (): Promise<Response> => {
  try {
    const sb = createClient(cookies());
    const payload = { email, password };
    const { error } = await sb.auth.signInWithPassword(payload);
    const date = new Date().toISOString();
    if (error != null) throw new Error(error.message);
    return Response.json(`Success! ${date}`);
  } catch (error) {
    const message = (error as Error).message ?? "An error occurred.";
    return Response.json(message, { status: 400 });
  }
};
