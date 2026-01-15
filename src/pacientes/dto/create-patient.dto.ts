import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { PatientStatusList } from '../enum/patient.enum';
import { PatientStatus } from 'generated/prisma/client';

export class CreatePatientDto {
  @IsString()
  name: string;

  @IsString()
  lastName: string;

  @IsDateString() 
  birthDate: string;

  @IsString()
  address: string;

  @IsString()
  phone: string;

  @IsString()
  email: string;

  @IsOptional()
  @IsEnum(PatientStatusList, { message: `Possible status values are ${Object.values(PatientStatusList).join(", ")}` })
  status: PatientStatus = PatientStatus.ACTIVE;
}
