import { z } from "zod";

export const CreateTodoSchema = z.object({
  title: z.string().min(1, "Please enter a todo"),
});
