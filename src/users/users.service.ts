import { Injectable, NotFoundException , HttpException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity.js';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    getAll() : Promise<User[] | null> {
        return this.usersRepository.find();
    }

    async getById(id: number) : Promise<User | null> {
        const user = await this.usersRepository.findOneBy({ id });
        if (!user) {
            throw new HttpException('User not found', 404);
        }
        return user;
    }

    create(lastname: string , firstname: string, age: number) : Promise<User> {
        const newUser = this.usersRepository.create({ lastname, firstname, age });
        return this.usersRepository.save(newUser);
    }

    async update(id: number, lastname: string , firstname: string, age: number) : Promise<User> {
        const user = await this.usersRepository.findOneBy({ id });
        if (!user) {
            throw new HttpException('User not found', 404);
        }
        user.lastname = lastname ?  lastname : user.lastname;
        user.firstname = firstname ? firstname : user.firstname;
        user.age = age ? age : user.age;

        return this.usersRepository.save(user);
    }

    async delete(id: number) {
        const result = await this.usersRepository.delete({ id });
        if (result.affected === 0) {
            throw new HttpException('User not found', 404);
        }
        return result;
    }


}
