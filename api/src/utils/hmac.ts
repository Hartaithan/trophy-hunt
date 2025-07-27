import { Request } from "express";
import { createHmac } from "node:crypto";
import { SECRET } from "../constants/environment";

type Body = Record<string, unknown> | string | FormData;

export const parseBody = (value: Body | null | undefined, empty?: string) => {
  if (!value) return empty;
  if (typeof value === "string") return value;
  if (Object.keys(value).length === 0) return empty;
  return JSON.stringify(value);
};

export const generateSignature = (req: Request, timestamp: string) => {
  const { method, body, originalUrl } = req;

  const urlParts = originalUrl.split("?");
  const path = urlParts[0];
  const query = originalUrl.includes("?") ? urlParts[1] : "";
  const parsed = parseBody(body);

  const data = { method, path, query, body: parsed, timestamp };
  const signature = createHmac("sha256", SECRET)
    .update(JSON.stringify(data))
    .digest("hex");

  return signature;
};
