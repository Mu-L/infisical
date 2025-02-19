// Code generated by automation script, DO NOT EDIT.
// Automated by pulling database and generating zod schema
// To update. Just run npm run generate:schema
// Written by akhilmhdh.

import { z } from "zod";

import { TImmutableDBKeys } from "./models";

export const ProjectBotsSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  isActive: z.boolean().default(false),
  encryptedPrivateKey: z.string(),
  publicKey: z.string(),
  iv: z.string(),
  tag: z.string(),
  algorithm: z.string(),
  keyEncoding: z.string(),
  encryptedProjectKey: z.string().nullable().optional(),
  encryptedProjectKeyNonce: z.string().nullable().optional(),
  projectId: z.string(),
  senderId: z.string().uuid().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type TProjectBots = z.infer<typeof ProjectBotsSchema>;
export type TProjectBotsInsert = Omit<z.input<typeof ProjectBotsSchema>, TImmutableDBKeys>;
export type TProjectBotsUpdate = Partial<Omit<z.input<typeof ProjectBotsSchema>, TImmutableDBKeys>>;
