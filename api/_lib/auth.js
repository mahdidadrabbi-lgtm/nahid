const { timingSafeEqual } = require("node:crypto");
const jwt = require("jsonwebtoken");

function signIn(password) {
  const expected = process.env.ADMIN_PASSWORD;
  const secret = process.env.JWT_SECRET;
  if (!expected || expected.length < 12 || !secret || secret.length < 32) {
    throw new Error("ADMIN_PASSWORD (12+ chars) and JWT_SECRET (32+ chars) must be configured");
  }

  const actualBuffer = Buffer.from(String(password || ""));
  const expectedBuffer = Buffer.from(expected);
  if (actualBuffer.length !== expectedBuffer.length || !timingSafeEqual(actualBuffer, expectedBuffer)) {
    return null;
  }

  return jwt.sign({ role: "admin" }, secret, { expiresIn: "8h" });
}

function isAdminRequest(req) {
  const secret = process.env.JWT_SECRET;
  const match = /^Bearer\s+(.+)$/i.exec(req.headers.authorization || "");
  if (!secret || !match) return false;

  try {
    return jwt.verify(match[1], secret).role === "admin";
  } catch {
    return false;
  }
}

module.exports = { isAdminRequest, signIn };