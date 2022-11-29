import express, { Express } from "express";
import database from "./database";
import { mountUserRoute } from "./features/user/routes";

import cors from "cors";

import dotenv from "dotenv";
import { RedisSessionStore } from "./features/user/services/session/connectSession";
import { hostname } from "os";
dotenv.config();

const app: Express = express();
const PORT = 4000;

const sequalize = database;
(async () => {
  try {
    // enfore synchronization with the models define in app
    const result = await sequalize.sync({ alter: true });
    console.log("db connected and sync");
  } catch (error) {
    console.error("unable to connect to db:", error);
  }
})();

// middlewares
app.use(express.static("public/upload"));
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000",
  })
);

// setting up session
RedisSessionStore.connectAndMountSessionMiddlewareWithRedisStore(app);

app.get("/", (req, res) => {
  res.status(200).send(hostname());
});

// mount routes
mountUserRoute(app);

app.listen(PORT, () => {
  console.log(`app listening on port http://localhost:${PORT}`);
});
