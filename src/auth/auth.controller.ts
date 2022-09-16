import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(
    @Body() registerRequest: { name: string; password: string; email: string },
  ) {
    return await this.authService.registerUser(registerRequest);
  }

  @Post('confirm')
  async confirm(@Body() confirmRequest: { email: string; code: string }) {
    try {
      return await this.authService.confirmUser(confirmRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }

  @Post('login')
  async login(
    @Body() authenticateRequest: { email: string; password: string },
  ) {
    try {
      return await this.authService.authenticateUser(authenticateRequest);
    } catch (e) {
      throw new BadRequestException(e.message);
    }
  }
}
