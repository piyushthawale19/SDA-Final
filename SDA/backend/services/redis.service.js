import Redis from "ioredis";

// In-memory fallback store for when Redis is unavailable
const fallbackStore = new Map();

// Check if Redis configuration exists
const hasRedisConfig = Boolean(
  process.env.REDIS_HOST && process.env.REDIS_PORT,
);

// Fallback client that uses in-memory storage
const fallbackClient = {
  async get(key) {
    return fallbackStore.get(key) ?? null;
  },
  async set(key, value, mode, ttlSeconds) {
    fallbackStore.set(key, value);
    if (mode === "EX" && ttlSeconds) {
      setTimeout(() => fallbackStore.delete(key), ttlSeconds * 1000);
    }
    return "OK";
  },
};

let activeClient = fallbackClient; // Start with fallback

if (hasRedisConfig) {
  const redisClient = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD || undefined,
    connectTimeout: 5000,
    lazyConnect: true,
    maxRetriesPerRequest: 0, // Don't retry failed requests
    retryDelayOnFailover: 100,
    enableOfflineQueue: false, // Don't queue commands when offline
    maxRetriesPerRequest: null, // Disable command retries
  });

  let connectionAttempted = false;

  redisClient.on("connect", () => {
    console.log("Redis Connected");
    activeClient = redisClient;
  });

  redisClient.on("error", (err) => {
    if (!connectionAttempted) {
      console.error("Redis connection failed:", err.message);
      console.warn("Using in-memory fallback for token storage");
      connectionAttempted = true;
    }
    // Ensure we stay on fallback
    activeClient = fallbackClient;
    // Disconnect to prevent further retry attempts
    redisClient.disconnect();
  });

  // Single connection attempt
  redisClient.connect().catch(() => {
    if (!connectionAttempted) {
      console.warn("Redis connection failed, using in-memory fallback");
      connectionAttempted = true;
    }
  });
} else {
  console.warn("Redis not configured, using in-memory token storage");
}

// Export a wrapper that delegates to the active client
const clientWrapper = {
  async get(key) {
    try {
      return await activeClient.get(key);
    } catch (error) {
      console.error("Redis operation failed:", error.message);
      return null;
    }
  },
  async set(key, value, mode, ttlSeconds) {
    try {
      return await activeClient.set(key, value, mode, ttlSeconds);
    } catch (error) {
      console.error("Redis operation failed:", error.message);
      return "OK";
    }
  },
};

export default clientWrapper;
