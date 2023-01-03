import { plainToClass, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, IsUrl, validateSync } from 'class-validator';

export enum EnvironmenteEnum {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  SERVER_PORT: number;

  // @IsNotEmpty()
  // @IsString()
  // @IsUrl({ require_tld: false })
  // SERVER_URL: string;
}

export function validateEnv(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) throw new Error(errors.toString());

  return validatedConfig;
}
