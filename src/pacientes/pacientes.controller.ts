import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PacientesService } from './pacientes.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { PacientePaginationDto } from './dto/pacientes-pagination.dto';

@Controller('pacientes')
export class PacientesController {
  constructor(private readonly pacientesService: PacientesService) {}

  @MessagePattern('createPaciente')
  create(@Payload() createPacienteDto: CreatePacienteDto) {
    return this.pacientesService.create(createPacienteDto);
  }

  @MessagePattern('findAllPacientes')
  findAll(@Payload() pacientePaginationDto: PacientePaginationDto) {
    return this.pacientesService.findAll(pacientePaginationDto);
  }

  @MessagePattern('findOnePaciente')
  findOne(@Payload() id: number) {
    return this.pacientesService.findOne(id);
  }

  @MessagePattern('updatePaciente')
  update(@Payload() updatePacienteDto: UpdatePacienteDto) {
    return this.pacientesService.update(
      updatePacienteDto.id,
      updatePacienteDto,
    );
  }

  @MessagePattern('removePaciente')
  remove(@Payload() id: number) {
    return this.pacientesService.remove(id);
  }
}
