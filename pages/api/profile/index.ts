import { type NextApiHandler } from "next";

const getProfile: NextApiHandler = async (req, res) => {
  return res.status(200).json({ message: "GET: Hello World!" });
};

const updateProfile: NextApiHandler = async (req, res) => {
  return res.status(200).json({ message: "PUT: Hello World!" });
};

const handler: NextApiHandler = async (req, res) => {
  const { method = "[Not Found]" } = req;
  switch (method) {
    case "GET":
      return getProfile(req, res);
    case "PUT":
      return updateProfile(req, res);
    default:
      res.setHeader("Allow", ["GET", "PUT"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
