import { cookies, headers } from "next/headers";

export const getRefreshedCookies = (): string => {
  let refreshed: string = cookies().toString() ?? "";
  if (refreshed.includes("psn-access-token")) {
    return refreshed;
  }
  const responseCookies = headers().get("set-cookie");
  if (responseCookies !== undefined) {
    refreshed = `${refreshed}; ${responseCookies}`;
  }
  return refreshed;
};
