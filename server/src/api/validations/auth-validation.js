import { z } from "zod";

import { handleValidationError } from "../../utils/helper.js";

const validateRegister = async (req, res, next) => {
  try {
    const schema = z
      .object({
        email: z.string().email().max(100),
        password: z.string().min(8).max(255),
        first_name: z.string().min(1).max(100),
        last_name: z.string().min(1).max(100)
      })
      .strict();

    await schema.parseAsync(req.body);
    next();
  } catch (error) {
    next(handleValidationError(error));
  }
};

const validateLogin = async (req, res, next) => {
  try {
    const schema = z
      .object({
        email: z.string().email().max(100),
        password: z.string().min(8).max(255)
      })
      .strict();

    await schema.parseAsync(req.body);
    next();
  } catch (error) {
    next(handleValidationError(error));
  }
};

const validateEmail = async (req, res, next) => {
  try {
    const schema = z
      .object({
        email: z.string().email().max(100)
      })
      .strict();

    await schema.parseAsync(req.body);
    next();
  } catch (error) {
    next(handleValidationError(error));
  }
};

const validateVerification = async (req, res, next) => {
  try {
    const schema = z
      .object({
        email: z.string().email().max(100),
        verification_code: z.string().length(6)
      })
      .strict();

    await schema.parseAsync(req.body);
    next();
  } catch (error) {
    next(handleValidationError(error));
  }
};

const validatePasswordReset = async (req, res, next) => {
  try {
    const schema = z
      .object({
        code: z.string(),
        new_password: z.string().min(8).max(255)
      })
      .strict();

    await schema.parseAsync(req.body);
    next();
  } catch (error) {
    next(handleValidationError(error));
  }
};

export default {
  validateRegister,
  validateLogin,
  validateEmail,
  validateVerification,
  validatePasswordReset
};
