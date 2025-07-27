import { RequestHandler } from "express";
import { generateSignature } from "../utils/hmac";

const TIME_WINDOW = 90;

const messages = {
  missingTimestamp: "Missing timestamp",
  invalidTimestamp: "Invalid timestamp",
  missingSignature: "Missing signature",
  invalidSignature: "Invalid signature",
  expired: "Request expired",
  unknown: "Unable to check signature",
  notAllowed: "Access denied [H:C]",
};

export const checkHMAC: RequestHandler = (req, res, next) => {
  try {
    const timestamp = req.headers["timestamp"];
    if (!timestamp) {
      console.error(messages.missingTimestamp, timestamp);
      res.status(400).json({ message: messages.notAllowed });
      return;
    }
    if (typeof timestamp !== "string") {
      console.error(messages.invalidTimestamp, timestamp);
      res.status(400).json({ message: messages.notAllowed });
      return;
    }

    const clientSignature = req.headers["authorization"];
    if (!clientSignature) {
      console.error(messages.missingSignature, clientSignature);
      res.status(400).json({ message: messages.notAllowed });
      return;
    }

    const time = Math.floor(Date.now() / 1000);
    if (Math.abs(time - Number(timestamp)) > TIME_WINDOW) {
      console.error(messages.expired, timestamp);
      res.status(400).json({ message: messages.notAllowed });
      return;
    }

    const serverSignature = generateSignature(req, timestamp);
    if (clientSignature !== serverSignature) {
      console.error(messages.invalidSignature);
      console.error("signatures", clientSignature, serverSignature);
      res.status(401).json({ message: messages.notAllowed });
      return;
    }

    next();
  } catch (error) {
    console.error(messages.unknown, error);
    res.status(500).json({ message: messages.notAllowed });
  }
};
