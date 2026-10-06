import { Module } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UsersModule } from './users/users.module.js';
import { AssociationController } from './association/association.controller.js';
import { AssociationService } from './association/association.service.js';
import { AssociationModule } from './association/association.module.js';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'projet',
    }),
    UsersModule,
    AssociationModule,
  ],
  controllers: [AppController, AssociationController],
  providers: [AppService, AssociationService],
})
export class AppModule {}
