// payment-page.dto.ts
import { IsString, IsOptional, IsNotEmpty } from 'class-validator';

export class PaymentPageDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  returnUrl?: string;
}
