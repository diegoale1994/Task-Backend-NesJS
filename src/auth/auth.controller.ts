import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post('/signUp')
    @UsePipes(ValidationPipe)
    signUp(@Body() authCredentialDto: AuthCredentialDto): Promise<void> {
        return this.authService.signUp(authCredentialDto);
    }


    @Post('/signIn')
    @UsePipes(ValidationPipe)
    signIn(@Body() authCredentialDto: AuthCredentialDto): Promise<string> {
        return this.authService.signIn(authCredentialDto);
    }
}
