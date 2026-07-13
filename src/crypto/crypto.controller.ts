import { Controller, Post, Body } from '@nestjs/common';
import { CryptoService } from './crypto.service';
import { EncryptRequestDto, DecryptRequestDto } from './dto/crypto.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Cryptography')
@Controller()
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  @Post('get-encrypt-data')
  @ApiOperation({ summary: 'Encrypt payload using Hybrid AES/RSA Encryption' })
  @ApiResponse({ status: 201, description: 'Successfully encrypted' })
  encrypt(@Body() body: EncryptRequestDto) {
    return this.cryptoService.encryptData(body.payload);
  }

  @Post('get-decrypt-data')
  @ApiOperation({ summary: 'Decrypt data using Hybrid AES/RSA Decryption' })
  @ApiResponse({ status: 201, description: 'Successfully decrypted' })
  decrypt(@Body() body: DecryptRequestDto) {
    return this.cryptoService.decryptData(body.data1, body.data2);
  }
}
