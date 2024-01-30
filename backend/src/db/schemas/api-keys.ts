// Code generated by automation script, DO NOT EDIT.
// Automated by pulling database and generating zod schema
// To update. Just run npm run generate:schema
// Written by akhilmhdh.

import { z } from "zod";

import { TImmutableDBKeys } from "./models";

export const ApiKeysSchema = z.object({
  id: z.string(),
  name: z.string(),
  lastUsed: z.date().nullable().optional(),
  expiresAt: z.date().nullable().optional(),
  secretHash: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string().uuid()
});

export type TApiKeys = z.infer<typeof ApiKeysSchema>;
export type TApiKeysInsert = Omit<TApiKeys, TImmutableDBKeys>;
export type TApiKeysUpdate = Partial<Omit<TApiKeys, TImmutableDBKeys>>;
