import { cookies } from "next/headers";
import { getProfileFromUserName, type AuthorizationPayload } from "psn-api";

export const GET = async (): Promise<Response> => {
  const access_token = cookies().get("psn-access-token")?.value;

  if (typeof access_token !== "string") {
    console.error("psn-access-token not found", access_token);
    return Response.json(
      { message: "Unable to get access token" },
      { status: 400 },
    );
  }

  const authorization: AuthorizationPayload = { accessToken: access_token };
  try {
    const { profile } = await getProfileFromUserName(authorization, "me");
    return Response.json({ profile });
  } catch (error) {
    console.error("unable to get profile", error);
    return Response.json({ message: "Unable to get profile" }, { status: 400 });
  }
};
