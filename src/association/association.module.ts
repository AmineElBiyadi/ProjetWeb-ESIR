import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module.js';

@Module({})
export class AssociationModule {
    imports: [UsersModule]
}
