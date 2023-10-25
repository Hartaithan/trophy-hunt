import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse, type NextMiddleware } from "next/server";

export const middleware: NextMiddleware = async (req) => {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  await supabase.auth.getSession();
  return res;
};
