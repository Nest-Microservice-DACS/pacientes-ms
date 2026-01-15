import { IsEnum, IsOptional } from "class-validator";
import { PaginationDto } from "src/common";
import { PatientStatusList } from "../enum/patient.enum";
import {  PatientStatus } from "generated/prisma/enums";

export class PatientPaginationDto extends PaginationDto {
    @IsOptional()
    @IsEnum(PatientStatusList, {
        message: `Possible status values are ${PatientStatusList.join(", ")}`,
    })
    status: PatientStatus;
}
