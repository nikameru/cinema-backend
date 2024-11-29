import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    signIn(req: Request){
        const user = (req as any).user; 
        return this.authService.signIn(user.username, user.password);
    }
}
