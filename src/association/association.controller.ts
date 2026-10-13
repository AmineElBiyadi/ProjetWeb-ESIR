import { Controller,Get,Body,Param, Put,Post, Delete, HttpException } from '@nestjs/common';
import { AssociationService } from './association.service.js';
import { Association } from './association.entity.js';
import { User } from '../users/user.entity.js';


@Controller('associations')
export class AssociationController {
  constructor( private service: AssociationService ) {}

    @Get()
    getAllAssociations() {
        return this.service.getAll();
    }

    @Get (':id')
    getById(@Param('id') id: string){   
        return this.service.getById(parseInt(id));
    }

    @Post()
    createAssociation(@Body() input: any) {
        const idUsers = [];
        for (const id of input.idUsers) {
            idUsers.push(parseInt(id));
        }
        return this.service.create(input.name, idUsers);
    }

    @Put (':id')
    updateAssociation(@Param('id') id: string, @Body() input: any) {
        const idUsers = [];
        for (const id of input.idUsers) {
            idUsers.push(parseInt(id));
        }
        return this.service.update(parseInt(id), input.name, idUsers);
    }

    @Delete (':id')
    deleteAssociation(@Param('id') id: string  ) {
        return this.service.delete(parseInt(id));
    }

    @Get(':id/members')
    getMembers(@Param('id') id: string) {
        return this.service.getMembers(parseInt(id));
    }
}
