import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const GET = async (req: Request): Promise<void> => {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next");
  let redirectUrl = requestUrl.origin;

  if (code != null) {
    const supabase = createClient(cookies());
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error == null) {
      redirectUrl = redirectUrl + "?success=true";
    }
  }

  if (next != null) {
    redirect(next);
  }

  redirect(redirectUrl);
};
