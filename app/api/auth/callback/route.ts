import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const GET = async (req: Request): Promise<void> => {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get("code");

  if (code != null) {
    const supabase = createClient(cookies());
    await supabase.auth.exchangeCodeForSession(code);
  }

  redirect(requestUrl.origin);
};
