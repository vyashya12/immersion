import { z } from "zod";

export const addImageSchema = z.object({
  description: z.string().min(3),
  files: z.any().array().nonempty(),
});

// use input to infer with optionals and input schemas (although we may not have one rn)
export type AddImageInput = z.input<typeof addImageSchema>;
