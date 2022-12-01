import express, { Express } from "express";
import database from "./database";
import { mountUserRoute } from "./features/user/routes";

import cors from "cors";

import dotenv from "dotenv";
import { RedisSessionStore } from "./features/user/services/session/connectSession";
import { hostname } from "os";

import { insertFakeUserIntoDB } from "../scripts/populateFakeUsers";

dotenv.config();

const app: Express = express();
const PORT = 4000;

const sequalize = database;
(async () => {
  try {
    // enfore synchronization with the models define in app
    const result = await sequalize.sync(
      process.env.POPULATE_FAKE_USER ? { force: true } : { alter: true }
    );
    console.log("🌟 db connected and sync");
    console.log(process.env.POPULATE_FAKE_USER);
    console.log("process.env", process.env);
    if (process.env.POPULATE_FAKE_USER) {
      console.log("insert fake data");
      await insertFakeUserIntoDB();
      console.log("Insertion of fake users completed");
    }
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
