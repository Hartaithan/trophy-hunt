import { type Profile } from "@/models/AuthModel";
import { validatePayload } from "@/utils/payload";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const GET = async (): Promise<Response> => {
  const supabase = createRouteHandlerClient({ cookies });

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

export const PUT = async (req: Request): Promise<Response> => {
  let body: Partial<Profile> | null = null;
  try {
    const request: Partial<Profile> = await req.json();
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

  const supabase = createRouteHandlerClient({ cookies });
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError !== null || user === null) {
    console.error("unable to get user", userError);
    return Response.json({ message: "Unable to get user" }, { status: 400 });
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .update(body)
    .eq("id", user.id)
    .select("*")
    .single();

  if (error !== null) {
    console.error("unable to update profile", error);
    return Response.json(
      { message: "Unable to update profile" },
      { status: 400 },
    );
  }

  return Response.json({ message: "Profile successfully updated!", profile });
};
