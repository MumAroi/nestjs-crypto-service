import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class CryptoService {
    private readonly privateKey: string;
    private readonly publicKey: string;

    constructor(private configService: ConfigService) {
        const privateKeyPath = this.configService.getOrThrow<string>('RSA_PRIVATE_KEY_PATH');
        const publicKeyPath = this.configService.getOrThrow<string>('RSA_PUBLIC_KEY_PATH');
        this.privateKey = fs.readFileSync(path.resolve(privateKeyPath), 'utf8');
        this.publicKey = fs.readFileSync(path.resolve(publicKeyPath), 'utf8');
    }

  encryptData(payload: string) {
    try {
      const aesKey = crypto.randomBytes(32);
      const iv = crypto.randomBytes(16);

      const cipher = crypto.createCipheriv('aes-256-cbc', aesKey, iv);
      let encryptedPayload = cipher.update(payload, 'utf8', 'base64');
      encryptedPayload += cipher.final('base64');

      const data2 = `${iv.toString('base64')}:${encryptedPayload}`;

      const secretToEncrypt = aesKey.toString('base64');
      const encryptedKeyBuffer = crypto.privateEncrypt(
        {
          key: this.privateKey,
          padding: crypto.constants.RSA_PKCS1_PADDING,
        },
        Buffer.from(secretToEncrypt)
      );
      const data1 = encryptedKeyBuffer.toString('base64');

      return {
        successful: true,
        error_code: '',
        data: { data1, data2 }
      };
    } catch (error) {
      throw new BadRequestException({ successful: false, error_code: 'ENCRYPTION_FAILED', data: null });
    }
  }

  decryptData(data1: string, data2: string) {
    try {
      const decryptedKeyBuffer = crypto.publicDecrypt(
        {
          key: this.publicKey,
          padding: crypto.constants.RSA_PKCS1_PADDING,
        },
        Buffer.from(data1, 'base64')
      );
      const aesKeyString = decryptedKeyBuffer.toString('utf8');
      const aesKey = Buffer.from(aesKeyString, 'base64');

      const [ivBase64, encryptedPayload] = data2.split(':');
      const iv = Buffer.from(ivBase64, 'base64');

      const decipher = crypto.createDecipheriv('aes-256-cbc', aesKey, iv);
      let decryptedPayload = decipher.update(encryptedPayload, 'base64', 'utf8');
      decryptedPayload += decipher.final('utf8');

      return {
        successful: true,
        error_code: '',
        data: { payload: decryptedPayload }
      };
    } catch (error) {
      throw new BadRequestException({ successful: false, error_code: 'DECRYPTION_FAILED', data: null });
    }
  }
}
