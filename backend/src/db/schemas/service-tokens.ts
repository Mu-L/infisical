// Code generated by automation script, DO NOT EDIT.
// Automated by pulling database and generating zod schema
// To update. Just run npm run generate:schema
// Written by akhilmhdh.

import { z } from "zod";

import { TImmutableDBKeys } from "./models";

export const ServiceTokensSchema = z.object({
  id: z.string(),
  name: z.string(),
  scopes: z.unknown(),
  permissions: z.string().array(),
  lastUsed: z.date().nullable().optional(),
  expiresAt: z.date().nullable().optional(),
  secretHash: z.string(),
  encryptedKey: z.string().nullable().optional(),
  iv: z.string().nullable().optional(),
  tag: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  createdBy: z.string(),
  projectId: z.string()
});

export type TServiceTokens = z.infer<typeof ServiceTokensSchema>;
export type TServiceTokensInsert = Omit<z.input<typeof ServiceTokensSchema>, TImmutableDBKeys>;
export type TServiceTokensUpdate = Partial<Omit<z.input<typeof ServiceTokensSchema>, TImmutableDBKeys>>;
