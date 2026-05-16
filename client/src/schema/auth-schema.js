// import { z } from "zod";

// const loginFormSchema = z
//   .object({
//     email: z
//       .string({ required_error: "Email is required" })
//       .min(1, "Email is required")
//       .email("Invalid email")
//       .trim(),
//     password: z
//       .string({ required_error: "Password is required" })
//       .min(1, "Password is required")
//       .min(8, "Password must be more than 8 characters")
//       .trim(),
//   })
//   .strict();

// const registerFormSchema = z
//   .object({
//     name: z
//       .string({ required_error: "Name is required" })
//       .min(1, {
//         message: "Name is required",
//       })
//       .trim(),
//     email: z
//       .string({ required_error: "Email is required" })
//       .min(1, "Email is required")
//       .email("Invalid email")
//       .trim(),
//     password: z
//       .string({ required_error: "Password is required" })
//       .min(1, "Password is required")
//       .min(8, "Password must be more than 8 characters")
//       .max(32, "Password must be less than 32 characters")
//       .trim(),
//     confirmPassword: z.string().trim(),
//   })
//   .strict()
//   .refine((data) => data.password === data.confirmPassword, {
//     message: "Passwords do not match",
//     path: ["confirmPassword"],
//   });

// const verifyFormSchema = z
//   .object({
//     verificationCode: z
//       .string({ required_error: "Verification code can not be empty" })
//       .min(6, "Verification code must be 6 characters"),
//   })
//   .strict();

// const resetPasswordEmailSchema = z
//   .object({
//     email: z
//       .string({ required_error: "Email is required" })
//       .min(1, "Email is required")
//       .email("Invalid email")
//       .trim(),
//   })
//   .strict();

// const resetPasswordFormSchema = z
//   .object({
//     newPassword: z
//       .string({ required_error: "Password is required" })
//       .min(1, "Password is required")
//       .min(8, "Password must be more than 8 characters")
//       .max(32, "Password must be less than 32 characters")
//       .trim(),
//     confirmPassword: z.string().trim(),
//   })
//   .strict()
//   .refine((data) => data.newPassword === data.confirmPassword, {
//     message: "Passwords do not match",
//     path: ["confirmPassword"],
//   });

// const sessionUserSchema = z
//   .object({
//     name: z.string().trim().optional(),
//     role: z.enum(["user", "admin"]).optional(),
//     is_verified: z.boolean().optional(),
//   })
//   .strict();

// export {
//   loginFormSchema,
//   registerFormSchema,
//   verifyFormSchema,
//   resetPasswordEmailSchema,
//   resetPasswordFormSchema,
//   sessionUserSchema,
// };
