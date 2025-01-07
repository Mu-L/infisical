// Code generated by automation script, DO NOT EDIT.
// Automated by pulling database and generating zod schema
// To update. Just run npm run generate:schema
// Written by akhilmhdh.

import { z } from "zod";

import { TImmutableDBKeys } from "./models";

export const SshCertificateTemplatesSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  sshCaId: z.string().uuid(),
  status: z.string(),
  name: z.string(),
  ttl: z.string(),
  maxTTL: z.string(),
  allowedUsers: z.string().array(),
  allowedHosts: z.string().array(),
  allowUserCertificates: z.boolean(),
  allowHostCertificates: z.boolean(),
  allowCustomKeyIds: z.boolean()
});

export type TSshCertificateTemplates = z.infer<typeof SshCertificateTemplatesSchema>;
export type TSshCertificateTemplatesInsert = Omit<z.input<typeof SshCertificateTemplatesSchema>, TImmutableDBKeys>;
export type TSshCertificateTemplatesUpdate = Partial<
  Omit<z.input<typeof SshCertificateTemplatesSchema>, TImmutableDBKeys>
>;