import { PartialType } from '@nestjs/mapped-types';
import { CreatePatientDto } from './create-patient.dto';
import { IsNumber, IsPositive } from 'class-validator';

export class UpdatePatientDto extends PartialType(CreatePatientDto) {

}
