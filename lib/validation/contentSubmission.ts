import { z } from 'zod'

export const contentSubmissionSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Title must be at least 3 characters')
    .max(120, 'Title must be 120 characters or less'),

  body: z
    .string()
    .trim()
    .min(10, 'Content must be at least 10 characters')
    .max(5000, 'Content must be 5000 characters or less'),

  contentType: z.enum(['text', 'link']),
})

export type ContentSubmissionInput = z.infer<typeof contentSubmissionSchema>