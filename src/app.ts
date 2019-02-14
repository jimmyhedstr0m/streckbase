import express, { Express } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import path from "path";

dotenv.load({ path: ".env" });

import router from "./routes";

const app: Express = express();

app.set("port", process.env.PORT || 8080);
app.set("json spaces", 2);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use((err: express.Router, _req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack)

  if (res.headersSent) {
    return next(err)
  }

  res.status(500).json({
    error: true
  });
});

app.use("/api", router);
app.use("/api/static", express.static(path.join(__dirname, "public")));


export default app;