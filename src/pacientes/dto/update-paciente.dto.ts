import { PartialType } from '@nestjs/mapped-types';
import { CreatePacienteDto } from './create-paciente.dto';
import { IsNumber, IsPositive } from 'class-validator';

export class UpdatePacienteDto extends PartialType(CreatePacienteDto) {
  @IsNumber()
  @IsPositive()
  id: number;
}
