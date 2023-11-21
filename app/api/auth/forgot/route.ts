import { type ForgotBody } from "@/models/AuthModel";
import { REDIRECT_URL } from "@/utils/api";
import { validatePayload } from "@/utils/payload";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const POST = async (req: Request): Promise<Response> => {
  try {
    let body: ForgotBody | null = null;
    try {
      const request: ForgotBody = await req.json();
      body = request;
    } catch (error) {
      console.error("request body not found", error);
      return Response.json(
        { message: "Request body not found" },
        { status: 400 },
      );
    }
    const { email } = body;

    const results = validatePayload(body, ["email"]);
    if (results !== null) {
      console.error("invalid payload", results.errors);
      return Response.json(results, { status: 400 });
    }

    const supabase = createClient(cookies());
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      {
        redirectTo: REDIRECT_URL + "?next=/update-password",
      },
    );
    if (resetError !== null) {
      console.error("unable to request reset", resetError);
      return Response.json(
        { message: "Unable to request password reset" },
        { status: 400 },
      );
    }

    return Response.json({ message: "Successful request!" });
  } catch (error) {
    console.error("unable to reset password", error);
    return Response.json(
      { message: "Unable to reset password" },
      { status: 400 },
    );
  }
};
