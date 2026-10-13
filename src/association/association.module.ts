import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module.js';
import { Association } from './association.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssociationController } from './association.controller.js';
import { AssociationService } from './association.service.js';
import { UsersService } from '../users/users.service.js';


@Module({
    imports: [TypeOrmModule.forFeature([Association]),UsersModule],
    controllers: [AssociationController],
    providers: [AssociationService],
    exports: [AssociationService ]
})
export class AssociationModule {}
