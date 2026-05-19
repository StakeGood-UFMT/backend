import { IsString, Length, IsOptional } from 'class-validator';

export class VerifyAuthDto {
  @IsString()
  @Length(56, 56)
  wallet: string;

  @IsString()
  @Length(64, 64)
  nonce: string;

  @IsString()
  signature: string;

  @IsOptional()
  @IsString()
  network?: string;
}
