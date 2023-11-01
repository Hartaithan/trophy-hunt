import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const GET = async (): Promise<Response> => {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError !== null || user === null) {
    console.error("unable to get user", userError);
    return Response.json({ message: "Unable to get user" }, { status: 400 });
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();
  if (profileError !== null) {
    console.error("unable to get profile", profileError);
    return Response.json({ message: "Unable to get profile" }, { status: 400 });
  }

  return Response.json({ profile });
};
