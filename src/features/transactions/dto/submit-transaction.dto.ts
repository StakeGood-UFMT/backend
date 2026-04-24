import { IsString } from 'class-validator';

export class SubmitTransactionDto {
  @IsString()
  signedXdr: string;
}
