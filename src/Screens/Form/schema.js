import { z } from "zod";

const schema = z.object({
  name: z
    .string()
    .min(5, "Name must be at least 5 characters")
    .min(1, "Name is required"),
  email: z
    .string()
    .email("Invalid email")
    .min(1, "Email is required"),
  password: z
    .string()
    .min(3, "Password must be at least 3 characters")
    .refine((value) => value === "00000", {
      message: "Not matched. Please try again!",
    }),
  newPassword: z
    .string()
    .min(5, "Password must be at least 5 characters")
    .refine((newPassword, ctx) => {
      console.log(ctx.data); // Debugging: Check if ctx.data contains sibling values
      return newPassword !== ctx.data.password;
    }, {
      message: "Password must not match the old password",
    }),
  confirmPassword: z
    .string()
    .refine((confirmPassword, ctx) => confirmPassword === ctx.data.newPassword, {
      message: "Passwords must match",
    }),
});

export default schema;
