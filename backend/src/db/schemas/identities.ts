// Code generated by automation script, DO NOT EDIT.
// Automated by pulling database and generating zod schema
// To update. Just run npm run generate:schema
// Written by akhilmhdh.

import { z } from "zod";

import { TImmutableDBKeys } from "./models";

export const IdentitiesSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  authMethod: z.string().nullable().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type TIdentities = z.infer<typeof IdentitiesSchema>;
export type TIdentitiesInsert = Omit<TIdentities, TImmutableDBKeys>;
export type TIdentitiesUpdate = Partial<Omit<TIdentities, TImmutableDBKeys>>;
