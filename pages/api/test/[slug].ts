import { type NextApiHandler } from "next";

const handler: NextApiHandler = async (req, res) => {
  return res.status(200).json({ data: req.query });
};

export default handler;
