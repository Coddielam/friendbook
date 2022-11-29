import { Express } from "express";
import session from "express-session";
import { createClient } from "redis";
import connectRedis from "connect-redis";
import { RedisClientType } from "@redis/client";

export class RedisSessionStore {
  private constructor() {}
  private static redisClient: RedisClientType;

  public static get redisClientInstance() {
    if (!RedisSessionStore.redisClient) {
      RedisSessionStore.createRedisClient();
    }

    return RedisSessionStore.redisClient;
  }

  private static createRedisClient() {
    RedisSessionStore.redisClient = createClient({
      legacyMode: true,
      url: "redis://redis",
    });
  }

  public static async connectRedis() {
    try {
      await RedisSessionStore.redisClientInstance.connect();
      console.log("Redis client connected");
    } catch (error) {
      console.error(error);
    }
  }

  public static async connectAndMountSessionMiddlewareWithRedisStore(
    app: Express
  ) {
    RedisSessionStore.connectRedis();
    const RedisStore = connectRedis(session);
    app.use(
      session({
        store: new RedisStore({
          client: RedisSessionStore.redisClientInstance,
        }),
        saveUninitialized: false,
        secret: process.env.SESSION_SECRET!,
        resave: false,
        cookie: {
          secure: false,
          maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
        },
      })
    );
  }
}
