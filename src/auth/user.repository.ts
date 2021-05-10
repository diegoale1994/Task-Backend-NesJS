import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { DatabaseError } from "src/shared/database-errors.enum";
import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialSignUpDto } from "./dto/auth-credentials.signup.dto";
import { User } from "./user.entity";
import * as bcrypt from 'bcrypt';
import { AuthCredentialSignInDto } from "./dto/auth-credentials.signin.dto";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async signUp(authCredentialSignUpDto: AuthCredentialSignUpDto): Promise<void> {

        const { username, password, email } = authCredentialSignUpDto;
        const salt = await bcrypt.genSalt();
        const user = new User();
        user.username = username;
        user.password = await this.hashPassword(password, salt);
        user.salt = salt;
        user.email = email;

        try {
            await user.save();
        } catch (error) {
            console.log(error);
            if (error.code === DatabaseError.NOTUNIQUE) {
                const { detail } = error;
                const column = detail ? detail.substring(detail.indexOf("(") + 1, detail.indexOf(")")) : '';
                throw new ConflictException(`${column} already exists`);
            } else {
                throw new InternalServerErrorException();
            }
        }

    }

    async validateUserPassword(authCredentialSignInDto: AuthCredentialSignInDto): Promise<string> {
        const { username, password } = authCredentialSignInDto;
        const user = await this.findOne({ username });
        if (user && user.validatePassword(password)) {
            return user.username;
        } else {
            return null;
        }
    }

    private async hashPassword(password: string, salt: string): Promise<string> {
        return bcrypt.hash(password, salt);
    }
}