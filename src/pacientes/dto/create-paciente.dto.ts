import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { PacienteStatusList } from '../enum/pacientes.enum';
import { PacienteStatus } from 'generated/prisma/client';

export class CreatePacienteDto {
  @IsString()
  nombre: string;

  @IsString()
  apellido: string;

  @IsDateString() 
  fechaNac: string;

  @IsString()
  direccion: string;

  @IsString()
  telefono: string;

  @IsString()
  email: string;

  @IsOptional()
  @IsEnum(PacienteStatusList, { message: 'Possible status values are ACTIVE, INACTIVE, SUSPENDED' })
  status: PacienteStatus = PacienteStatus.ACTIVE;
}
