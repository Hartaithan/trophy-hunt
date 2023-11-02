import { type ReorderPayload } from "@/models/GameModel";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export const POST = async (req: Request): Promise<Response> => {
  let body: ReorderPayload | null = null;
  try {
    const request: ReorderPayload = await req.json();
    body = request;
  } catch (error) {
    console.error("request body not found", error);
    return Response.json(
      { message: "Request body not found" },
      { status: 400 },
    );
  }

  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  const { items } = body;
  if (items == null || items.length === 0) {
    console.error("invalid payload", items);
    return Response.json({ message: "Invalid payload" }, { status: 400 });
  }

  const { error } = await supabase.rpc("reorder", { payload: items });
  if (error !== null) {
    console.error("unable to reorder games", error);
    return Response.json(
      { message: "Unable to reorder games" },
      { status: 400 },
    );
  }

  return Response.json({ message: "Games successfully reordered!" });
};
