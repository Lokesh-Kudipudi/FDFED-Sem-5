const { Redis } = require("@upstash/redis");

// Initialize Upstash Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

// Test connection
redis
  .ping()
  .then(() => {
    console.log(" Upstash Redis connected");
  })
  .catch((error) => {
    console.error("Redis connection error:", error);
  });

// Store OTP with expiration (5 minutes = 300 seconds)
const storeOTP = async (email, otp, expirationMinutes = 5) => {
  try {
    const key = `otp:${email}`;
    const expirationSeconds = expirationMinutes * 60;
    await redis.set(key, otp, { ex: expirationSeconds });
    console.log(`💾 OTP Stored: key="${key}", otp="${otp}", expiry=${expirationSeconds}s`);
    return { success: true };
  } catch (error) {
    console.error("Error storing OTP:", error);
    return { success: false };
  }
};

// Get OTP from Redis
const getOTP = async (email) => {
  try {
    const key = `otp:${email}`;
    const otp = await redis.get(key);
    console.log(`🔍 OTP Retrieved: key="${key}", otp="${otp}"`);
    return otp;
  } catch (error) {
    console.error("Error retrieving OTP:", error);
    return null;
  }
};

// Delete OTP (after verification - one-time use)
const deleteOTP = async (email) => {
  try {
    const key = `otp:${email}`;
    await redis.del(key);
    return { success: true };
  } catch (error) {
    console.error("Error deleting OTP:", error);
    return { success: false };
  }
};

module.exports = { redis, storeOTP, getOTP, deleteOTP };
