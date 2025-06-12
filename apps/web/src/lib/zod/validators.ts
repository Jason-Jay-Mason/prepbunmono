import { z } from "zod";

export const captchaRequestSchema = z
  .string()
  .min(1, { message: "reCAPTCHA verification is required" });

export const loginFormSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least two charecters",
    })
    .max(50, {
      message: "This username is too long",
    }),
  password: z.string(),
});
export type LoginFormFields = z.infer<typeof loginFormSchema>;

export const signUpFormSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: "Name is too short" })
      .max(40, { message: "Name is too long" }),
    lastName: z
      .string()
      .min(2, { message: "Name is too short" })
      .max(40, { message: "Name is too long" }),
    email: z
      .string()
      .min(5, {
        message: "Please enter a valid email.",
      })
      .email({ message: "Please enter a valid email." })
      .max(50, {
        message: "Email is too long.",
      }),
    password: z
      .string()
      .min(8, { message: "Password is too short" })
      .max(50, { message: "Password is too long" })
      .refine(
        (password) => {
          const hasLetter = /[a-zA-Z]/.test(password);
          const hasNumber = /\d/.test(password);
          const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

          const typeCount = [hasLetter, hasNumber, hasSpecial].filter(
            Boolean,
          ).length;
          return typeCount >= 2;
        },
        {
          message:
            "Password must contain at least two types of characters (letters, numbers, or special characters)",
        },
      ),
    passwordConfirmation: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });
export type SignUpFormFields = z.infer<typeof signUpFormSchema>;

export const signupFormRequestSchema = z.object({
  form: signUpFormSchema,
  recaptcha: captchaRequestSchema,
});
export type SignupFormRequestFields = z.infer<typeof signupFormRequestSchema>;

export const verifyAccountSchema = z.string().min(6).max(6);
export const verifyAccountRequestSchema = z.object({
  confirmationToken: verifyAccountSchema,
});
