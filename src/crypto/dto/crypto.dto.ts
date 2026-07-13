import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class EncryptRequestDto {
  @ApiProperty({ example: 'My payload', description: '0 - 2000 characters payload' })
  @IsString()
  @IsNotEmpty()
  @Length(1, 2000)
  payload: string;
}

export class DecryptRequestDto {
  @ApiProperty({ example: 'encrypted data 1' })
  @IsString()
  @IsNotEmpty()
  data1: string;

  @ApiProperty({ example: 'encrypted data 2' })
  @IsString()
  @IsNotEmpty()
  data2: string;
}
