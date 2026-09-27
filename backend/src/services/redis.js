"use strict";
const Redis = require("ioredis");
const { CACHE_KEY_PREFIX, namespacedKey } = require("../utils/cacheKeys");

const url = process.env.REDIS_URL || "redis://localhost:6379";

const client = new Redis(url, {
  lazyConnect: true,
  enableOfflineQueue: false,
  maxRetriesPerRequest: 0,
});

client.on("error", () => {
  // Redis connection errors are non-fatal; cache is bypassed on failure
});

const connectionPromise = client.connect().catch(() => {
  // Non-fatal: server runs without cache if Redis is unavailable
});

async function getConnectedClient() {
  if (client.status !== "ready" && connectionPromise) {
    await connectionPromise;
  }
  if (client.status !== "ready") {
    throw new Error("Redis unavailable");
  }
  return client;
}

// NOTE: `sendCommand` is a raw escape hatch and is deliberately NOT
// namespaced — it forwards whatever the caller passes. Its only in-tree
// consumer is `middleware/rateLimiter.js`, where `rate-limit-redis` applies
// its own `greenpay:rate-limit:` prefix to the keys it builds. Namespacing
// here as well would produce `greenpay:greenpay:rate-limit:...` keys.
async function sendCommand(command, ...args) {
  const c = await getConnectedClient();
  return c.call(command, ...args);
}

async function get(key) {
  try {
    const c = await getConnectedClient();
    const value = await c.get(namespacedKey(key));
    return value ? JSON.parse(value) : null;
  } catch {
    return null;
  }
}

async function set(key, value, ttlSeconds) {
  try {
    const c = await getConnectedClient();
    await c.set(namespacedKey(key), JSON.stringify(value), "EX", ttlSeconds);
  } catch {
    // Cache write failure is non-fatal
  }
}

async function deletePattern(pattern) {
  try {
    const c = await getConnectedClient();
    // Scoped to the `greenpay:` namespace so invalidation can never delete
    // keys owned by another service sharing the same Redis instance.
    const keys = await c.keys(namespacedKey(pattern));
    if (keys.length > 0) {
      await c.del(...keys);
    }
  } catch {
    // Cache invalidation failure is non-fatal
  }
}

async function ping() {
  const c = await getConnectedClient();
  const result = await c.ping();
  if (result !== "PONG") {
    throw new Error("Redis ping failed");
  }
  return result;
}

async function quit() {
  if (client.status === "ready") {
    await client.quit();
  }
}

module.exports = { client, get, set, deletePattern, ping, sendCommand, quit, CACHE_KEY_PREFIX };
