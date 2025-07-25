import { Knex } from "knex";

import { SecretType, TSecretsV2, TSecretsV2Insert, TSecretsV2Update } from "@app/db/schemas";
import { ProjectPermissionSecretActions } from "@app/ee/services/permission/project-permission";
import { OrderByDirection, TProjectPermission } from "@app/lib/types";
import { TProjectDALFactory } from "@app/services/project/project-dal";
import { SecretsOrderBy } from "@app/services/secret/secret-types";
import { TSecretFolderDALFactory } from "@app/services/secret-folder/secret-folder-dal";
import { TSecretTagDALFactory } from "@app/services/secret-tag/secret-tag-dal";

import { TCommitResourceChangeDTO, TFolderCommitServiceFactory } from "../folder-commit/folder-commit-service";
import { TResourceMetadataDALFactory } from "../resource-metadata/resource-metadata-dal";
import { ResourceMetadataDTO } from "../resource-metadata/resource-metadata-schema";
import { TSecretV2BridgeDALFactory } from "./secret-v2-bridge-dal";
import { TSecretVersionV2DALFactory } from "./secret-version-dal";
import { TSecretVersionV2TagDALFactory } from "./secret-version-tag-dal";

type TPartialSecret = Pick<TSecretsV2, "id" | "reminderRepeatDays" | "reminderNote">;

type TPartialInputSecret = Pick<TSecretsV2, "type" | "reminderNote" | "reminderRepeatDays" | "id">;

export type TSecretReferenceDTO = {
  environment: string;
  secretPath: string;
  secretKey: string;
};

export enum SecretUpdateMode {
  Ignore = "ignore",
  Upsert = "upsert",
  FailOnNotFound = "failOnNotFound"
}

export type TGetSecretsDTO = {
  expandSecretReferences?: boolean;
  path: string;
  environment: string;
  includeImports?: boolean;
  recursive?: boolean;
  tagSlugs?: string[];
  viewSecretValue: boolean;
  throwOnMissingReadValuePermission?: boolean;
  metadataFilter?: {
    key?: string;
    value?: string;
  }[];
  orderBy?: SecretsOrderBy;
  orderDirection?: OrderByDirection;
  offset?: number;
  limit?: number;
  search?: string;
  keys?: string[];
} & TProjectPermission;

export type TGetSecretsMissingReadValuePermissionDTO = Omit<
  TGetSecretsDTO,
  "viewSecretValue" | "recursive" | "expandSecretReferences"
>;

export type TGetASecretDTO = {
  secretName: string;
  path: string;
  environment: string;
  expandSecretReferences?: boolean;
  type: "shared" | "personal";
  includeImports?: boolean;
  version?: number;
  projectId: string;
  viewSecretValue: boolean;
} & Omit<TProjectPermission, "projectId">;

export type TCreateSecretDTO = TProjectPermission & {
  secretName: string;
  secretPath: string;
  environment: string;
  secretValue: string;
  type: SecretType;
  tagIds?: string[];
  secretComment?: string;
  skipMultilineEncoding?: boolean;
  secretReminderRepeatDays?: number | null;
  secretReminderNote?: string | null;
  secretMetadata?: ResourceMetadataDTO;
};

export type TUpdateSecretDTO = TProjectPermission & {
  secretPath: string;
  environment: string;
  secretName: string;
  secretValue?: string;
  newSecretName?: string;
  secretComment?: string;
  type: SecretType;
  tagIds?: string[];
  skipMultilineEncoding?: boolean;
  secretReminderRepeatDays?: number | null;
  secretReminderNote?: string | null;
  secretReminderRecipients?: string[] | null;
  metadata?: {
    source?: string;
  };
  secretMetadata?: ResourceMetadataDTO;
};

export type TDeleteSecretDTO = TProjectPermission & {
  secretPath: string;
  environment: string;
  secretName: string;
  type: SecretType;
};

export type TCreateManySecretDTO = Omit<TProjectPermission, "projectId"> & {
  secretPath: string;
  projectId: string;
  environment: string;
  secrets: {
    secretKey: string;
    secretValue: string;
    secretComment?: string;
    skipMultilineEncoding?: boolean;
    tagIds?: string[];
    secretMetadata?: ResourceMetadataDTO;
    metadata?: {
      source?: string;
    };
  }[];
};

export type TUpdateManySecretDTO = Omit<TProjectPermission, "projectId"> & {
  secretPath: string;
  projectId: string;
  environment: string;
  mode: SecretUpdateMode;
  secrets: {
    secretKey: string;
    newSecretName?: string;
    secretValue?: string;
    secretComment?: string;
    skipMultilineEncoding?: boolean;
    tagIds?: string[];
    secretReminderRepeatDays?: number | null;
    secretReminderNote?: string | null;
    secretMetadata?: ResourceMetadataDTO;
    secretPath?: string;
  }[];
};

export type TDeleteManySecretDTO = Omit<TProjectPermission, "projectId"> & {
  secretPath: string;
  projectId: string;
  environment: string;
  secrets: {
    secretKey: string;
    type?: SecretType;
  }[];
};

export type TGetSecretVersionsDTO = Omit<TProjectPermission, "projectId"> & {
  limit?: number;
  offset?: number;
  secretId: string;
};

export type TSecretReference = { environment: string; secretPath: string; secretKey: string };

export type TFnSecretBulkInsert = {
  folderId: string;
  orgId: string;
  tx?: Knex;
  commitChanges?: TCommitResourceChangeDTO[];
  inputSecrets: Array<
    Omit<TSecretsV2Insert, "folderId"> & {
      tagIds?: string[];
      references: TSecretReference[];
      secretMetadata?: ResourceMetadataDTO;
    }
  >;
  resourceMetadataDAL: Pick<TResourceMetadataDALFactory, "insertMany">;
  secretDAL: Pick<TSecretV2BridgeDALFactory, "insertMany" | "upsertSecretReferences" | "find">;
  secretVersionDAL: Pick<TSecretVersionV2DALFactory, "insertMany">;
  secretTagDAL: Pick<TSecretTagDALFactory, "saveTagsToSecretV2" | "find">;
  secretVersionTagDAL: Pick<TSecretVersionV2TagDALFactory, "insertMany">;
  folderCommitService: Pick<TFolderCommitServiceFactory, "createCommit">;
  actor?: {
    type: string;
    actorId?: string;
  };
};

type TRequireReferenceIfValue =
  | (Omit<TSecretsV2Update, "encryptedValue"> & {
      encryptedValue: Buffer | null;
      references: TSecretReference[];
    })
  | (Omit<TSecretsV2Update, "encryptedValue"> & {
      encryptedValue?: never;
      references?: never;
    });

export type TFnSecretBulkUpdate = {
  folderId: string;
  orgId: string;
  inputSecrets: {
    filter: Partial<TSecretsV2>;
    data: TRequireReferenceIfValue & { tags?: string[]; secretMetadata?: ResourceMetadataDTO };
  }[];
  resourceMetadataDAL: Pick<TResourceMetadataDALFactory, "insertMany" | "delete">;
  secretDAL: Pick<TSecretV2BridgeDALFactory, "bulkUpdate" | "upsertSecretReferences" | "find">;
  secretVersionDAL: Pick<TSecretVersionV2DALFactory, "insertMany">;
  secretTagDAL: Pick<TSecretTagDALFactory, "saveTagsToSecretV2" | "deleteTagsToSecretV2" | "find">;
  secretVersionTagDAL: Pick<TSecretVersionV2TagDALFactory, "insertMany">;
  folderCommitService: Pick<TFolderCommitServiceFactory, "createCommit">;
  actor?: {
    type: string;
    actorId?: string;
  };
  tx?: Knex;
  commitChanges?: TCommitResourceChangeDTO[];
};

export type TFnSecretBulkDelete = {
  folderId: string;
  projectId: string;
  inputSecrets: Array<{ type: SecretType; secretKey: string }>;
  actorId: string;
  actorType?: string;
  tx?: Knex;
  commitChanges?: TCommitResourceChangeDTO[];
  secretDAL: Pick<TSecretV2BridgeDALFactory, "deleteMany">;
  secretQueueService: {
    removeSecretReminder: (data: TRemoveSecretReminderDTO, tx?: Knex) => Promise<void>;
  };
  folderCommitService: Pick<TFolderCommitServiceFactory, "createCommit">;
  secretVersionDAL: Pick<TSecretVersionV2DALFactory, "findLatestVersionMany">;
};

export type THandleReminderDTO = {
  newSecret: TPartialInputSecret;
  oldSecret: TPartialSecret;
  projectId: string;
};

export type TCreateSecretReminderDTO = {
  oldSecret: TPartialSecret;
  newSecret: TPartialSecret;
  projectId: string;
};

export type TRemoveSecretReminderDTO = {
  secretId: string;
  repeatDays: number;
  projectId: string;
};

export type TBackFillSecretReferencesDTO = TProjectPermission;

export type TCreateManySecretsFnFactory = {
  projectDAL: TProjectDALFactory;
  secretDAL: TSecretV2BridgeDALFactory;
  secretVersionDAL: TSecretVersionV2DALFactory;
  secretTagDAL: TSecretTagDALFactory;
  secretVersionTagDAL: TSecretVersionV2TagDALFactory;
  folderDAL: TSecretFolderDALFactory;
};

export type TCreateManySecretsFn = {
  projectId: string;
  environment: string;
  path: string;
  secrets: {
    secretName: string;
    secretValue: string;
    type: SecretType;
    secretComment?: string;
    skipMultilineEncoding?: boolean;
    tags?: string[];
    metadata?: {
      source?: string;
    };
  }[];
  userId?: string; // only relevant for personal secret(s)
};

export type TUpdateManySecretsFnFactory = {
  projectDAL: TProjectDALFactory;
  secretDAL: TSecretV2BridgeDALFactory;
  secretVersionDAL: TSecretVersionV2DALFactory;
  secretTagDAL: TSecretTagDALFactory;
  secretVersionTagDAL: TSecretVersionV2TagDALFactory;
  folderDAL: TSecretFolderDALFactory;
};

export type TFindByFolderIdDALDTO = {
  folderId: string;
  userId?: string;
  tx?: Knex;
  projectId: string;
};

export type TUpdateManySecretsFn = {
  projectId: string;
  environment: string;
  path: string;
  secrets: {
    secretName: string;
    newSecretName?: string;
    secretValue: string;
    type: SecretType;
    secretComment?: string;
    skipMultilineEncoding?: boolean;
    secretReminderRepeatDays?: number | null;
    secretReminderNote?: string | null;
    tags?: string[];
    metadata?: {
      source?: string;
    };
  }[];
  userId?: string;
};

export enum SecretOperations {
  Create = "create",
  Update = "update",
  Delete = "delete"
}

export type TMoveSecretsDTO = {
  projectId: string;
  sourceEnvironment: string;
  sourceSecretPath: string;
  destinationEnvironment: string;
  destinationSecretPath: string;
  secretIds: string[];
  shouldOverwrite: boolean;
} & Omit<TProjectPermission, "projectId">;

export type TAttachSecretTagsDTO = {
  projectId: string;
  secretName: string;
  tagSlugs: string[];
  environment: string;
  secretPath: string;
  type: SecretType;
} & Omit<TProjectPermission, "projectId">;

export type TGetSecretReferencesTreeDTO = {
  projectId: string;
  secretName: string;
  environment: string;
  secretPath: string;
} & Omit<TProjectPermission, "projectId">;

export type TFindSecretsByFolderIdsFilter = {
  limit?: number;
  offset?: number;
  orderBy?: SecretsOrderBy;
  orderDirection?: OrderByDirection;
  search?: string;
  tagSlugs?: string[];
  metadataFilter?: { key?: string; value?: string }[];
  includeTagsInSearch?: boolean;
  includeMetadataInSearch?: boolean;
  keys?: string[];
};

export type TGetSecretsRawByFolderMappingsDTO = {
  projectId: string;
  folderMappings: { folderId: string; path: string; environment: string }[];
  userId: string;
  filters: TFindSecretsByFolderIdsFilter;
  filterByAction?: ProjectPermissionSecretActions.DescribeSecret | ProjectPermissionSecretActions.ReadValue;
};

export type TGetAccessibleSecretsDTO = {
  environment: string;
  projectId: string;
  secretPath: string;
  recursive?: boolean;
  filterByAction: ProjectPermissionSecretActions.DescribeSecret | ProjectPermissionSecretActions.ReadValue;
} & TProjectPermission;
