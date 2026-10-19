import { HttpException, Injectable } from '@nestjs/common';
import { Association } from './association.entity.js';
import { UsersService } from '../users/users.service.js';
import { User } from '../users/user.entity.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';


@Injectable()
export class AssociationService {
    constructor(private service: UsersService , 
        @InjectRepository(Association)
        private associationsRepository: Repository<Association>,
    ) {}

    getAll() : Promise<Association[] | null> {
        return this.associationsRepository.find();
    }

    async getById(id: number) : Promise<Association | null> {
        const association = await this.associationsRepository.findOneBy({ id });
        if (!association) {
            throw new HttpException('Association not found', 404);
        }
        return association;
    }

    async create(name: string, idUsers: number[] = []): Promise<Association> {
        const users : User[] = await this.findUsers(idUsers);

        const newAssociation = this.associationsRepository.create({ name, users });
        return this.associationsRepository.save(newAssociation);
    }

    async update(id: number, name: string , idUsers: number[]) {
        const association = await this.associationsRepository.findOneBy({ id });
        if (!association) {
            throw new HttpException('Association not found', 404);
        }
        const users : User[] = await this.findUsers(idUsers);
        association.name = name ? name : association.name;
        association.users = idUsers.length > 0 ? users : association.users;
    
        return this.associationsRepository.save(association);
    }

    async delete(id: number) {
       const result = await this.associationsRepository.delete({ id });
       if (result.affected === 0) {
            throw new HttpException('Association not found', 404);
        }
        return result;
    }

    async getMembers(id : number): Promise<User[] | undefined> {
        const association = await this.getById(id);
        if (!association) {
            throw new HttpException('Association not found', 404);
        }
        return association.users;
    }

    private async findUsers(ids: number[]): Promise<User[]> {
        const users: User[] = [];
        for (const userId of ids) {
        const user = await this.service.getById(userId);
        if (user) users.push(user);
        }
        return users;
    }
}
