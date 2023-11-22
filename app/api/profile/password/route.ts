import {
  type SetPasswordBody,
  type UpdatePasswordBody,
} from "@/models/AuthModel";
import { createClient } from "@/utils/supabase/server";
import { validatePayload } from "@/utils/payload";
import { cookies } from "next/headers";

export const POST = async (req: Request): Promise<Response> => {
  let body: Partial<SetPasswordBody> | null = null;
  try {
    const request: Partial<SetPasswordBody> = await req.json();
    body = request;
  } catch (error) {
    console.error("request body not found", error);
    return Response.json(
      { message: "Request body not found" },
      { status: 400 },
    );
  }
  const { password } = body;

  const results = validatePayload(body, ["password"]);
  if (results !== null) {
    console.error("invalid payload", results.errors);
    return Response.json(results, { status: 400 });
  }

  const supabase = createClient(cookies());
  const { error } = await supabase.auth.updateUser({ password });

  if (error !== null) {
    console.error("unable to set password", error);
    return Response.json(
      { message: "Unable to set password" },
      { status: 400 },
    );
  }

  return Response.json({ message: "Password successfully set!" });
};

export const PUT = async (req: Request): Promise<Response> => {
  let body: Partial<UpdatePasswordBody> | null = null;
  try {
    const request: Partial<UpdatePasswordBody> = await req.json();
    body = request;
  } catch (error) {
    console.error("request body not found", error);
    return Response.json(
      { message: "Request body not found" },
      { status: 400 },
    );
  }

  const results = validatePayload(body, ["current_password", "new_password"]);
  if (results !== null) {
    console.error("invalid payload", results.errors);
    return Response.json(results, { status: 400 });
  }

  const supabase = createClient(cookies());
  const { error } = await supabase.rpc("change_password", body);

  if (error?.message != null) {
    console.error("password change is failed", error);
    return Response.json({ message: error.message }, { status: 400 });
  }

  if (error !== null && error.message == null) {
    console.error("unable to change password", error);
    return Response.json(
      { message: "Unable to change password" },
      { status: 400 },
    );
  }

  return Response.json({ message: "Password successfully updated!" });
};
