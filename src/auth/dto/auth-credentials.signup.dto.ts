import { IsEmail, IsNotEmpty, IsString, Matches, matches, MaxLength, MinLength } from "class-validator";

export class AuthCredentialSignUpDto {

    @IsNotEmpty()
    @IsString()
    @MinLength(6)
    @MaxLength(10)
    username: string;

    @IsNotEmpty()
    @MinLength(6)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, { message: 'Password too weak' })
    password: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

}