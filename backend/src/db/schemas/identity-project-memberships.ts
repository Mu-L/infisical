// Code generated by automation script, DO NOT EDIT.
// Automated by pulling database and generating zod schema
// To update. Just run npm run generate:schema
// Written by akhilmhdh.

import { z } from "zod";

import { TImmutableDBKeys } from "./models";

export const IdentityProjectMembershipsSchema = z.object({
  id: z.string().uuid(),
  role: z.string(),
  roleId: z.string().uuid().nullable().optional(),
  projectId: z.string(),
  identityId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export type TIdentityProjectMemberships = z.infer<typeof IdentityProjectMembershipsSchema>;
export type TIdentityProjectMembershipsInsert = Omit<TIdentityProjectMemberships, TImmutableDBKeys>;
export type TIdentityProjectMembershipsUpdate = Partial<
  Omit<TIdentityProjectMemberships, TImmutableDBKeys>
>;
