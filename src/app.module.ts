import { Module } from '@nestjs/common';
import { CryptoModule } from './crypto/crypto.module';
import { ConfigModule } from '@nestjs/config';

@Module({
imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CryptoModule,
  ],
})
export class AppModule {}
