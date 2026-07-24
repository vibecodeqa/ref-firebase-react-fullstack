import { z } from "zod";

export const ProjectStatusSchema = z.enum(["active", "archived"]);

export const CreateProjectSchema = z.object({
  name: z.string().trim().min(3).max(80)
});

export const ProjectSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(3).max(80),
  ownerUid: z.string().min(1),
  status: ProjectStatusSchema,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime()
});

export const ProblemSchema = z.object({
  error: z.object({
    code: z.string().min(1),
    message: z.string().min(1)
  })
});

export const ProjectListSchema = z.object({
  projects: z.array(ProjectSchema)
});

export type CreateProjectInput = z.infer<typeof CreateProjectSchema>;
export type Project = z.infer<typeof ProjectSchema>;
export type ProjectList = z.infer<typeof ProjectListSchema>;
export type Problem = z.infer<typeof ProblemSchema>;

export function problem(code: string, message: string): Problem {
  return { error: { code, message } };
}

export function isoNow(): string {
  return new Date().toISOString();
}

