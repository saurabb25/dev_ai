import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

console.log("ENV CHECK:");
console.log("HOST:", process.env.REDIS_HOST);
console.log("PORT:", process.env.REDIS_PORT);
console.log("PASSWORD:", process.env.REDIS_PASSWORD);

const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASSWORD,
    tls: {} // 🔥 REQUIRED for Redis Cloud
});

redisClient.on("ready", () => {
    console.log("✅ Redis connected");
});

redisClient.on("error", (err) => {
    console.error("❌ Redis error:", err);
});

export default redisClient;