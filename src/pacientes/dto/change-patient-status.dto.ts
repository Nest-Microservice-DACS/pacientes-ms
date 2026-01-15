import { IsEnum, IsNumber, IsPositive } from 'class-validator';
import { PatientStatusList } from '../enum/patient.enum';
import { PatientStatus } from 'generated/prisma/enums';

export class PatientStatusDto {
  @IsEnum(PatientStatusList, {
    message: 'Status must be one of ACTIVE, INACTIVE, SUSPENDED',
  })
  status: PatientStatus;
}
