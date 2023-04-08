import { type NextApiHandler } from "next";

const reorderGames: NextApiHandler = async (req, res) => {
  return res.status(200).json({ message: "Hello world!" });
};

const handler: NextApiHandler = async (req, res) => {
  const { method = "[Not Found]" } = req;
  switch (method) {
    case "POST":
      return reorderGames(req, res);
    default:
      res.setHeader("Allow", ["POST"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
