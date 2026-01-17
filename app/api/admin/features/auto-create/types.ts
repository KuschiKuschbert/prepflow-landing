import { z } from 'zod';

export const autoCreateSchema = z.object({
  flags: z.array(
    z.object({
      flag_key: z.string().min(1).max(100),
      type: z.enum(['regular', 'hidden']),
      description: z.string().optional().nullable(),
    }),
  ),
});

export type AutoCreateInput = z.infer<typeof autoCreateSchema>;
export type FeatureFlagInput = AutoCreateInput['flags'][number];

export interface ProcessResult {
  created: number;
  skipped: number;
  createdFlags: string[];
  skippedFlags: string[];
}
