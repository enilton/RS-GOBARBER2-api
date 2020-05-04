import { getRepository } from  'typeorm';
import { hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import User from '../models/User'
import authConfig from '../config/auth';


interface RequestAuthUser {
    email:string,
    password: string,
}

interface ResponseAuthUser {
    user:User,
    token:string,
}

 export default class AuthenticateUserService{
    public async execute({ email, password }: RequestAuthUser): Promise<ResponseAuthUser> {
        const usersRepository = getRepository(User);
        const user = await usersRepository.findOne({
            where: { email }
        });

        if (!user){
            throw new Error('Incorrect email/password combination');
        }

        const passwordMatched = await compare(password, user.password);

        if (!passwordMatched){
            throw new Error('Incorrect email/password combination');
        }

        const token = sign({},authConfig.jwt.secret,{
            subject: user.id,
            expiresIn:authConfig.jwt.expiresIn,
        });

        return { user, token };
    }
}