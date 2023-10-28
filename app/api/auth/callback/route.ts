import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const GET = async (req: Request): Promise<void> => {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get("code");

  if (code != null) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    await supabase.auth.exchangeCodeForSession(code);
  }

  redirect(requestUrl.origin);
};
