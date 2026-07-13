import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { BadRequestException } from '@nestjs/common';
import * as path from 'path';
import { CryptoService } from './crypto.service';

describe('CryptoService', () => {
  let service: CryptoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CryptoService,
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: (key: string) => {
              const map: Record<string, string> = {
                RSA_PRIVATE_KEY_PATH: path.resolve(__dirname, '../../private.key'),
                RSA_PUBLIC_KEY_PATH: path.resolve(__dirname, '../../public.key'),
              };
              return map[key];
            },
          },
        },
      ],
    }).compile();

    service = module.get<CryptoService>(CryptoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('encryptData', () => {
    it('should encrypt and decrypt data correctly', () => {
      const payload = 'I am Por';
      const encrypted = service.encryptData(payload);

      expect(encrypted.successful).toBe(true);
      expect(encrypted.error_code).toBe('');
      expect(encrypted.data.data1).toBeDefined();
      expect(encrypted.data.data2).toBeDefined();
      expect(typeof encrypted.data.data1).toBe('string');
      expect(typeof encrypted.data.data2).toBe('string');
    });

    it('should encrypt and decrypt empty string', () => {
      const payload = '';
      const encrypted = service.encryptData(payload);
      const decrypted = service.decryptData(encrypted.data.data1, encrypted.data.data2);

      expect(decrypted.data.payload).toBe(payload);
    });

    it('should encrypt and decrypt unicode characters', () => {
      const payload = 'สวัสดี ปอ 🌍';
      const encrypted = service.encryptData(payload);
      const decrypted = service.decryptData(encrypted.data.data1, encrypted.data.data2);

      expect(decrypted.data.payload).toBe(payload);
    });

    it('should encrypt and decrypt long string', () => {
      const payload = 'a'.repeat(2000);
      const encrypted = service.encryptData(payload);
      const decrypted = service.decryptData(encrypted.data.data1, encrypted.data.data2);

      expect(decrypted.data.payload).toBe(payload);
    });

    it('should encrypt and decrypt special characters', () => {
      const payload = '!@#$%^&*()_+-=[]{}|;:,.<>?`~"';
      const encrypted = service.encryptData(payload);
      const decrypted = service.decryptData(encrypted.data.data1, encrypted.data.data2);

      expect(decrypted.data.payload).toBe(payload);
    });

    it('should generate different encrypted output for same payload', () => {
      const payload = 'I am Por';
      const encrypted1 = service.encryptData(payload);
      const encrypted2 = service.encryptData(payload);

      expect(encrypted1.data.data1).not.toBe(encrypted2.data.data1);
      expect(encrypted1.data.data2).not.toBe(encrypted2.data.data2);
    });
  });

  describe('decryptData', () => {
    it('should throw BadRequestException when data1 is invalid', () => {
      expect(() => service.decryptData('invalid_data1', 'invalid_data2'))
        .toThrow(BadRequestException);
    });

    it('should throw BadRequestException when data2 format is wrong', () => {
      const payload = 'I am Por';
      const encrypted = service.encryptData(payload);

      expect(() => service.decryptData(encrypted.data.data1, 'no_colon_separator'))
        .toThrow(BadRequestException);
    });

    it('should throw BadRequestException when data is tampered', () => {
      const payload = 'I am Por';
      const encrypted = service.encryptData(payload);

      const tamperedData2 = encrypted.data.data2.slice(0, -5) + 'XXxxx';

      expect(() => service.decryptData(encrypted.data.data1, tamperedData2))
        .toThrow(BadRequestException);
    });

    it('should throw BadRequestException when data1 is empty', () => {
      expect(() => service.decryptData('', 'some_data'))
        .toThrow(BadRequestException);
    });

    it('should throw BadRequestException when data2 is empty', () => {
      expect(() => service.decryptData('some_data', ''))
        .toThrow(BadRequestException);
    });

    it('should throw BadRequestException with correct error_code', () => {
      try {
        service.decryptData('invalid', 'invalid');
        fail('Should have thrown BadRequestException');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        const response = error.getResponse();
        expect(response.successful).toBe(false);
        expect(response.error_code).toBe('DECRYPTION_FAILED');
        expect(response.data).toBeNull();
      }
    });
  });
});
