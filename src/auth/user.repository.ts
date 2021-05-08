import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import { DatabaseError } from "src/shared/database-errors.enum";
import { EntityRepository, Repository } from "typeorm";
import { AuthCredentialDto } from "./dto/auth-credentials.dto";
import { User } from "./user.entity";
import * as bcrypt from 'bcrypt';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async signUp(authCredentialDto: AuthCredentialDto): Promise<void> {

        const { username, password } = authCredentialDto;
        const salt = await bcrypt.genSalt();
        const user = new User();
        user.username = username;
        user.password = await this.hashPassword(password, salt);
        user.salt = salt;

        try {
            await user.save();
        } catch (error) {
            if (error.code === DatabaseError.NOTUNIQUE) {
                throw new ConflictException('Username Already Exist')
            } else {
                throw new InternalServerErrorException();
            }
        }

    }

    async validateUserPassword(authCredentialDto: AuthCredentialDto): Promise<string> {
        const { username, password } = authCredentialDto;
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