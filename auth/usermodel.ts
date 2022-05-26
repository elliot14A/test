import { object, string } from "zod";

export const userModel = object({
  body: object({
    name: string({ required_error: "name is required" }),
    password: string({ required_error: "password is required" }).length(3, {
      message: "min of 3 chars",
    }),
  }),
});
