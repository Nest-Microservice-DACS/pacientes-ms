import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PacientesService } from './pacientes.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { ChangePacienteStatusDto, PacientePaginationDto } from './dto';


@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @MessagePattern({cmd: 'create_paciente'})
  create(@Payload() createPacienteDto: CreatePacienteDto) {
    return this.pacientesService.create(createPacienteDto);
  }

  @MessagePattern({cmd: 'find_all_pacientes'})
  findAll(@Payload() pacientePaginationDto: PacientePaginationDto) {
    return this.pacientesService.findAll(pacientePaginationDto);
  }

  @MessagePattern({cmd: 'get_paciente_by_id'})
  findById(@Payload() id: number){
    return this.pacientesService.findById(id);
  }

  @MessagePattern({cmd: 'update_paciente'})
  update(@Payload() updatePacienteDto: UpdatePacienteDto) {
    return this.pacientesService.update(
      updatePacienteDto.id,
      updatePacienteDto,
    );
  }

  @MessagePattern({cmd: 'change_paciente_status'})
  changeStatus(@Payload() statusDto: ChangePacienteStatusDto) {
    return this.pacientesService.changeStatus(statusDto);
  }
}
