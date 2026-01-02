import { Module } from '@nestjs/common';
import { PacientesModule } from './pacientes/pacientes.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ ConfigModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
