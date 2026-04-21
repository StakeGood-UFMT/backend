import { IsString, IsObject } from 'class-validator';

export class KycWebhookDto {
  @IsString()
  externalUserId: string;

  @IsObject()
  review: { reviewStatus: string; createdAt?: string };

  @IsObject()
  applicant?: { id: string; email?: string };
}
