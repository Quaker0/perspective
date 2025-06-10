import { Expose } from 'class-transformer';
import { IsEmail, IsEnum, IsString } from 'class-validator';
import Validator from './Validator';

export class CreateUserInput extends Validator {
    @Expose()
    @IsString({ message: 'Invalid name' })
    name: string;

    @Expose()
    @IsEmail(undefined, { message: 'Invalid email format' })
    email: string;
}

export class GetUsersInput extends Validator {
    @Expose()
    @IsEnum({ message: 'Invalid sort direction' })
    created: 'asc' | 'desc';
}
