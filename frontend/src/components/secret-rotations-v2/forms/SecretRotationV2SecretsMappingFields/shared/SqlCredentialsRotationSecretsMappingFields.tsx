import { Controller, useFormContext } from "react-hook-form";

import { TSecretRotationV2Form } from "@app/components/secret-rotations-v2/forms/schemas";
import { FormControl, Input } from "@app/components/v2";
import { SecretRotation, useSecretRotationV2Option } from "@app/hooks/api/secretRotationsV2";

import { SecretsMappingTable } from "./SecretsMappingTable";

export const SqlCredentialsRotationSecretsMappingFields = () => {
  const { control, watch } = useFormContext<
    TSecretRotationV2Form & {
      type: SecretRotation.PostgresCredentials | SecretRotation.MsSqlCredentials;
    }
  >();

  const type = watch("type");

  const { rotationOption } = useSecretRotationV2Option(type);

  const items = [
    {
      name: "Username",
      input: (
        <Controller
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <FormControl isError={Boolean(error)} errorText={error?.message}>
              <Input
                value={value}
                onChange={onChange}
                placeholder={rotationOption?.template.secretsMapping.username}
              />
            </FormControl>
          )}
          control={control}
          name="secretsMapping.username"
        />
      )
    },
    {
      name: "Password",
      input: (
        <Controller
          render={({ field: { value, onChange }, fieldState: { error } }) => (
            <FormControl isError={Boolean(error)} errorText={error?.message}>
              <Input
                value={value}
                onChange={onChange}
                placeholder={rotationOption?.template.secretsMapping.password}
              />
            </FormControl>
          )}
          control={control}
          name="secretsMapping.password"
        />
      )
    }
  ];

  return <SecretsMappingTable items={items} />;
};
