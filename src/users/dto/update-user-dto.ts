import { IsString, IsOptional, IsDate, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsOptional()
  @IsNotEmpty()
  lastName: string;

  @IsDate()
  @IsOptional()
  @IsNotEmpty()
  dateOfBirth: Date;
}
