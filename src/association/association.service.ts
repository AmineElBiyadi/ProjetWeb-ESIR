import { Injectable } from '@nestjs/common';
import { Association } from './association.entity.js';
import { UsersService } from '../users/users.service.js';
import { User } from '../users/user.entity.js';

const associations: Association[] = [
    {
        id: 0,
        name: 'Association A',
        idUsers: [0]
    }
]

@Injectable()
export class AssociationService {
    constructor(private service: UsersService) {}

    getAll(){
        return associations;
    }

    getById(id: string){
        const association = associations.find(u => u.id === parseInt(id));
        return association;
    }

    create(name: string, idUsers: number[]): Association {
        const newAssociation = new Association (associations.length, name, idUsers);

        associations.push(newAssociation);
        return newAssociation;
    
    }

    update(id: string, name: string , idUsers: number[]) {
        const association = associations.find(u=> u.id === parseInt(id));
        if (association){
            if(name !== undefined ){
                association.name = name;
            }
            if(idUsers !== undefined ){
                association.idUsers = idUsers;
            }
        }
        return association;
    }

    delete(id: string) {
        const association = associations.find(u=> u.id === parseInt(id));
        if (association){
            const index = associations.indexOf(association);
            associations.splice(index, 1);
            return true ; 
        }
        return false;
    }

    getMembers(association : Association): User[] | undefined {
        const users: User[] = [];
        for (const userId of association.idUsers) {
            const user = this.service.getById(userId.toString());
            if (user) {
                users.push(user);
            }
        }
        return users;
    }
}
