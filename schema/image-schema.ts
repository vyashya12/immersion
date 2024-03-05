import { z } from "zod";

const MAX_FILE_SIZE = 5000000;
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const addImageSchema = z.object({
  description: z.string().min(3),
  files: z.any(),
});

// use input to infer with optionals and input schemas (although we may not have one rn)
export type AddImageInput = z.input<typeof addImageSchema>;
