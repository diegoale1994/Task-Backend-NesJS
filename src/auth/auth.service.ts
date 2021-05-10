import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthCredentialSignInDto } from './dto/auth-credentials.signin.dto';
import { AuthCredentialSignUpDto } from './dto/auth-credentials.signup.dto';
import { JwtPayload } from './jwt-payload.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository,
        private jwtService: JwtService
    ) { }

    async signUp(authCredentialSignUpDto: AuthCredentialSignUpDto): Promise<void> {
        return this.userRepository.signUp(authCredentialSignUpDto);
    }

    async signIn(authCredentialSignInDto: AuthCredentialSignInDto): Promise<{ accessToken: string }> {

        const username = await this.userRepository.validateUserPassword(authCredentialSignInDto);
        if (!username) {
            throw new UnauthorizedException('Invalid Credentials');
        }
        const payload: JwtPayload = { username };
        const accessToken = await this.jwtService.sign(payload);
        return { accessToken };

    }

}