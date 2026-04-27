import { IsString, IsNotEmpty } from 'class-validator';

export class RefreshAuthDto {
  @IsString()
  @IsNotEmpty()
  refresh_token: string;
}
