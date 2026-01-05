import { IsEnum, IsNumber, IsPositive } from 'class-validator';
import { PacienteStatusList } from '../enum/pacientes.enum';
import { PacienteStatus } from 'generated/prisma/enums';

export class ChangePacienteStatusDto {
  @IsNumber()
  @IsPositive()
  id: number;

  @IsEnum(PacienteStatusList, {
    message: 'Status must be one of ACTIVE, INACTIVE, SUSPENDED',
  })
  status: PacienteStatus;
}
