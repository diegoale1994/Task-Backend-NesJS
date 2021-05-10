import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialSignInDto } from './dto/auth-credentials.signin.dto';
import { AuthCredentialSignUpDto } from './dto/auth-credentials.signup.dto';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService) { }

    @Post('/signUp')
    @UsePipes(ValidationPipe)
    signUp(@Body() authCredentialSignUpDto: AuthCredentialSignUpDto): Promise<void> {
        return this.authService.signUp(authCredentialSignUpDto);
    }


    @Post('/signIn')
    @UsePipes(ValidationPipe)
    signIn(@Body() authCredentialSignInDto: AuthCredentialSignInDto): Promise<{ accessToken: string }> {
        return this.authService.signIn(authCredentialSignInDto);
    }
}
