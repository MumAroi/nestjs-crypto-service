import { Test, TestingModule } from '@nestjs/testing';
import { CryptoController } from './crypto.controller';
import { CryptoService } from './crypto.service';

describe('CryptoController', () => {
  let controller: CryptoController;

  const mockCryptoService = {
    encryptData: jest.fn(),
    decryptData: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CryptoController],
      providers: [
        {
          provide: CryptoService,
          useValue: mockCryptoService,
        },
      ],
    }).compile();

    controller = module.get<CryptoController>(CryptoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('encrypt', () => {
    it('should call encryptData with payload', () => {
      const result = { successful: true, error_code: '', data: { data1: 'd1', data2: 'd2' } };
      mockCryptoService.encryptData.mockReturnValue(result);

      expect(controller.encrypt({ payload: 'test' })).toEqual(result);
      expect(mockCryptoService.encryptData).toHaveBeenCalledWith('test');
      expect(mockCryptoService.encryptData).toHaveBeenCalledTimes(1);
    });

    it('should call encryptData with empty string', () => {
      const result = { successful: true, error_code: '', data: { data1: 'd1', data2: 'd2' } };
      mockCryptoService.encryptData.mockReturnValue(result);

      expect(controller.encrypt({ payload: '' })).toEqual(result);
      expect(mockCryptoService.encryptData).toHaveBeenCalledWith('');
    });

    it('should call encryptData with unicode payload', () => {
      const result = { successful: true, error_code: '', data: { data1: 'd1', data2: 'd2' } };
      mockCryptoService.encryptData.mockReturnValue(result);

      const unicodePayload = 'สวัสดี ปอ 🌍';
      expect(controller.encrypt({ payload: unicodePayload })).toEqual(result);
      expect(mockCryptoService.encryptData).toHaveBeenCalledWith(unicodePayload);
    });
  });

  describe('decrypt', () => {
    it('should call decryptData with data1 and data2', () => {
      const result = { successful: true, error_code: '', data: { payload: 'decrypted' } };
      mockCryptoService.decryptData.mockReturnValue(result);

      expect(controller.decrypt({ data1: 'd1', data2: 'd2' })).toEqual(result);
      expect(mockCryptoService.decryptData).toHaveBeenCalledWith('d1', 'd2');
      expect(mockCryptoService.decryptData).toHaveBeenCalledTimes(1);
    });

    it('should call decryptData with long data strings', () => {
      const result = { successful: true, error_code: '', data: { payload: 'decrypted' } };
      mockCryptoService.decryptData.mockReturnValue(result);

      const longData1 = 'a'.repeat(1000);
      const longData2 = 'b'.repeat(1000);

      expect(controller.decrypt({ data1: longData1, data2: longData2 })).toEqual(result);
      expect(mockCryptoService.decryptData).toHaveBeenCalledWith(longData1, longData2);
    });
  });
});
