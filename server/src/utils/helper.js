import crypto from "crypto";

/**
 * Filters an object to only include allowed fields.
 *
 * Supports passing allowed fields either as an array or as multiple arguments.
 *
 * @param {object} data - The original object to sanitize.
 * @param {...string|string[]} fields - The allowed fields (can be a list or a single array).
 * @returns {object} A new object containing only the allowed fields.
 */
export const sanitizeAllowedFields = (obj, ...fields) => {
  const allowedFields = Array.isArray(fields[0]) ? fields[0] : fields;
  const sanitized = {};

  for (const key of allowedFields) {
    if (key in obj) {
      sanitized[key] = obj[key];
    }
  }

  return sanitized;
};

export const sanitizeUser = (user) => {
  if (!user) return null;

  const sanitized = { ...user };

  // Remove sensitive fields
  delete sanitized.password_hash;
  delete sanitized.verification_code;
  delete sanitized.verification_expires;
  delete sanitized.password_reset_code;
  delete sanitized.password_reset_expires;
  delete sanitized.embedding;

  return sanitized;
};

/**
 * Randomly generate 8 character code
 * @returns {string}  A–Z and 0–9
 */
export const generateTeamCode = () => {
  const length = 8;
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const randomBytes = crypto.randomBytes(length);
  let code = "";
  for (let i = 0; i < length; i++) {
    code += chars[randomBytes[i] % chars.length];
  }

  return code;
};

export const replaceQueryParams = (query, values) => {
  let replacedQuery = query;
  values.forEach((tmpParameter) => {
    if (typeof tmpParameter === "string") {
      replacedQuery = replacedQuery.replace("?", `'${tmpParameter}'`);
    } else {
      replacedQuery = replacedQuery.replace("?", tmpParameter);
    }
  });
  return replacedQuery;
};
