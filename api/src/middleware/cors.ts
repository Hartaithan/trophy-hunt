import { CorsOptions, default as lib } from "cors";
import { RequestHandler } from "express";
import { CORS_WHITELIST } from "../constants/environment";

const whitelist = JSON.parse(CORS_WHITELIST);

const messages = {
  notAllowed: "Access denied [C:S]",
};

const corsOptions: Record<string, CorsOptions> = {
  development: { origin: "*" },
  production: {
    origin: (origin, callback) => {
      if (!origin || whitelist.includes(origin || "")) {
        callback(null, true);
      } else {
        callback(new Error(messages.notAllowed));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
};

export const cors: RequestHandler = (req, res, next) => {
  const environment = process.env.NODE_ENV || "development";
  const middleware = lib(corsOptions[environment]);
  middleware(req, res, (err) => {
    if (err) {
      console.error(messages.notAllowed, req.url);
      res.status(403).json({ messages: messages.notAllowed });
      return;
    }
    next();
  });
};
