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

  return sanitized;
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
