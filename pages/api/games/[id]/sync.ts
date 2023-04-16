import { type NextApiHandler } from "next";

const syncGameProgress: NextApiHandler = async (req, res) => {
  const {
    query: { id },
  } = req;

  if (id === undefined || Array.isArray(id)) {
    console.error("invalid [id] query", req.query);
    return res.status(400).json({ message: "Invalid [id] query" });
  }

  return res.status(200).json({ message: "Hello world!" });
};

const handler: NextApiHandler = async (req, res) => {
  const { method = "[Not Found]" } = req;
  switch (method) {
    case "GET":
      return syncGameProgress(req, res);
    default:
      res.setHeader("Allow", ["GET"]);
      return res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default handler;
