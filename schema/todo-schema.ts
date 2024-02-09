import { z } from "zod";

export const addTodoSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(3),
});

// use input to infer with optionals and input schemas (although we may not have one rn)
export type AddTodoInput = z.input<typeof addTodoSchema>;
