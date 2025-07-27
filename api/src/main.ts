import "dotenv/config";
import express from "express";
import open from "./routers/open";
import restricted from "./routers/restricted";

const app = express();

const port = (process.env.PORT || 4000) as number;
const host = process.env.HOST || "localhost";

app.use(express.json());
app.use(open);
app.use(restricted);

app.listen(port, host, async () => {
  console.info(`The server is running at http://${host}:${port}`);
});
