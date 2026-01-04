import { IsEnum, IsOptional } from "class-validator";
import { PaginationDto } from "src/common";
import { PacienteStatusList } from "../enum/pacientes.enum";
import { PacienteStatus } from "generated/prisma/enums";

export class PacientePaginationDto extends PaginationDto {
    @IsOptional()
    @IsEnum(PacienteStatusList, {
        message: `Possible status values are ${PacienteStatusList.join(", ")}`,
    })
    status?: PacienteStatus;
}
