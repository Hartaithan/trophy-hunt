import { type NextApiHandler } from "next";

const getNote: NextApiHandler = async (req, res) => {
  return res.status(200).json({ message: "Hello World!" });
};

const updateNote: NextApiHandler = async (req, res) => {
  return res.status(200).json({ message: "Hello World!" });
};

const deleteNote: NextApiHandler = async (req, res) => {
  return res.status(200).json({ message: "Hello World!" });
};

const handler: NextApiHandler = async (req, res) => {
  const { method = "[Not Found]" } = req;
  switch (method) {
    case "GET":
      return getNote(req, res);
    case "PUT":
      return updateNote(req, res);
    case "DELETE":
      return deleteNote(req, res);
    default:
      res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
