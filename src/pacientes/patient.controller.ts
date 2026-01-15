import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { PatientStatusDto, CreatePatientDto, PatientPaginationDto, UpdatePatientDto } from './dto';
import { PatientService } from './patient.service';


@Controller()
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @MessagePattern({cmd: 'create_patient'})
  create(@Payload() createPatientDto: CreatePatientDto) {
    return this.patientService.create(createPatientDto);
  }

  @MessagePattern({cmd: 'get_all_patients'})
  findAll(@Payload() patientPaginationDto: PatientPaginationDto) {
    return this.patientService.findAll(patientPaginationDto);
  }

  @MessagePattern({cmd: 'get_patient_by_id'})
  findById(@Payload() id: number){
    return this.patientService.findById(id);
  }

  @MessagePattern({cmd: 'update_patient'})   // VERIFICAR ESTO
  update(@Payload() {updatePatientDto, patientId}: {updatePatientDto: UpdatePatientDto, patientId: number}) {
    return this.patientService.update(
      patientId,
      updatePatientDto,
    );
  }
  
  @MessagePattern({cmd: 'change_status_paciente'})
  changeStatus(@Payload() {statusDto, id}: {statusDto: PatientStatusDto, id: number}  ) {
    return this.patientService.changeStatus(statusDto, id);
  }
}
