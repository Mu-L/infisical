// Code generated by automation script, DO NOT EDIT.
// Automated by pulling database and generating zod schema
// To update. Just run npm run generate:schema
// Written by akhilmhdh.

import { z } from "zod";

import { TImmutableDBKeys } from "./models";

export const TrustedIpsSchema = z.object({
  id: z.string().uuid(),
  ipAddress: z.string(),
  type: z.string(),
  prefix: z.number().nullable().optional(),
  isActive: z.boolean().default(true).nullable().optional(),
  comment: z.string().nullable().optional(),
  projectId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type TTrustedIps = z.infer<typeof TrustedIpsSchema>;
export type TTrustedIpsInsert = Omit<TTrustedIps, TImmutableDBKeys>;
export type TTrustedIpsUpdate = Partial<Omit<TTrustedIps, TImmutableDBKeys>>;
