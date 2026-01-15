import { Module } from '@nestjs/common';
import { PacientesModule } from './pacientes/patient.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [PacientesModule, ConfigModule.forRoot({isGlobal: true})],
  controllers: [],
  providers: [],
})
export class AppModule {}
