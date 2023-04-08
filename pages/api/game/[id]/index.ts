import { type NextApiHandler } from "next";

const getGameById: NextApiHandler = async (req, res) => {
  return res.status(200).json({ message: "Hello world!" });
};

const deleteGameById: NextApiHandler = async (req, res) => {
  return res.status(200).json({ message: "Hello world!" });
};

const handler: NextApiHandler = async (req, res) => {
  const { method = "[Not Found]" } = req;
  switch (method) {
    case "GET":
      return getGameById(req, res);
    case "DELETE":
      return deleteGameById(req, res);
    default:
      res.setHeader("Allow", ["GET", "DELETE"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
