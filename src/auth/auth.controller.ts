import { Controller, Post, Body } from '@nestjs/common';
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
}
