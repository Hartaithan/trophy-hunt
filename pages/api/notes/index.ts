import { type NextApiHandler } from "next";

const getNoteByGame: NextApiHandler = async (req, res) => {
  return res.status(200).json({ message: "Hello World!" });
};

const addNote: NextApiHandler = async (req, res) => {
  return res.status(200).json({ message: "Hello World!" });
};

const handler: NextApiHandler = async (req, res) => {
  const { method = "[Not Found]" } = req;
  switch (method) {
    case "GET":
      return getNoteByGame(req, res);
    case "POST":
      return addNote(req, res);
    default:
      res.setHeader("Allow", ["POST", "GET"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
