import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

export const GET = async (): Promise<Response> => {
  try {
    const supabase = createClient(cookies());
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (session == null) {
      return Response.json(
        { message: "You've already sign out!" },
        { status: 400 },
      );
    }

    const allCookies = cookies().getAll();
    for (let i = 0; i < allCookies.length; i++) {
      const cookie = allCookies[i];
      cookies().delete(cookie.name);
    }

    return Response.json({ message: "Successful sign out!" });
  } catch (error) {
    console.error("unable to sign out", error);
    return Response.json({ message: "Unable to sign out" }, { status: 400 });
  }
};
