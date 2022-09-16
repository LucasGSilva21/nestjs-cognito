import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthConfig } from './auth.config';
import { AuthController } from './auth.controller';

@Module({
  providers: [AuthService, AuthConfig],
  controllers: [AuthController],
})
export class AuthModule {}
