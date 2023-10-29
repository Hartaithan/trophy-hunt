import { cookies } from "next/headers";

export const GET = async (): Promise<Response> => {
  try {
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
