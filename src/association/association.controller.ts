import { Controller,Get,Body,Param, Put,Post, Delete } from '@nestjs/common';
import { AssociationService } from './association.service.js';
import { Association } from './association.entity.js';
import { ApiCreatedResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AssociationInput } from './associationInput.js';
import { User } from '../users/user.entity.js';


@ApiTags('associations')
@Controller('associations')
export class AssociationController {
  constructor( private service: AssociationService ) {}

    @ApiOkResponse({ 
        description: 'Returns all associations.',
        type: Association,
        isArray: true 
    })
    @Get()
    getAllAssociations() {
        return this.service.getAll();
    }

    @ApiOkResponse({ 
        description: 'Returns the association with the specified ID.', 
        type: Association 
    })
    @ApiNotFoundResponse({ 
        description: 'Association not found.' 
    })
    @Get (':id')
    getById(@Param('id') id: string){   
        return this.service.getById(parseInt(id));
    }

    @ApiCreatedResponse({
        description: 'The association has been successfully created.',
        type: Association,
    })
    @Post()
    createAssociation(@Body() input: AssociationInput) : Promise<Association> {
        const idUsers = this.transformStringArrayToNumberArray(input.idUsers.map(String));
        return this.service.create(input.name, idUsers);
    }

    @ApiOkResponse({ 
        description: 'Returns the updated association.', 
        type: Association 
    })
    @ApiNotFoundResponse({ 
        description: 'Association not found.' 
    })
    @Put (':id')
    public async updateAssociation(@Param('id') id: string, @Body() input: AssociationInput) : Promise<Association> {
        const idUsers = this.transformStringArrayToNumberArray(input.idUsers.map(String));
        return this.service.update(parseInt(id), input.name, idUsers);
    }

    @ApiOkResponse({
        description: 'Returns the TypeORM delete result, including raw and affected.',
    })
    @ApiNotFoundResponse({ 
        description: 'Association not found.' 
    })
    @Delete (':id')
    deleteAssociation(@Param('id') id: string  ) {
        return this.service.delete(parseInt(id));
    }

    @ApiOkResponse({
        description: 'Returns the users belonging to the association.',
        type: User,
        isArray: true,
    })
    @ApiNotFoundResponse({ 
        description: 'Association not found.' 
    })
    @Get(':id/members')
    getMembers(@Param('id') id: string) {
        return this.service.getMembers(parseInt(id));
    }

    private transformStringArrayToNumberArray(input: string[]): number[] {
        const result: number[] = [];
        for (const element of input) {
            result.push(Number(element));
        }
        return result;
    }
}
