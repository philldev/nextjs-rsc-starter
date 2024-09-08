import { z } from "zod";

export const CreateTodoSchema = z.object({
  title: z.string().min(1, "Please enter a todo"),
});

export const UpdateTodoSchema = z.object({
  title: z.string().min(1, "Please enter a todo"),
  id: z.string().uuid(),
});
