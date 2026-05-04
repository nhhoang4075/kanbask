import jwt from "jsonwebtoken";

const generateToken = (payload, secretKey, tokenLife) => {
  try {
    return jwt.sign(payload, secretKey, {
      algorithm: "HS256",
      expiresIn: tokenLife
    });
  } catch (error) {
    throw new Error(error);
  }
};

const verifyToken = (token, secretKey) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    throw new Error(error);
  }
};

export default { generateToken, verifyToken };
