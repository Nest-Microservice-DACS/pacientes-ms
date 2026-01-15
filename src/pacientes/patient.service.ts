import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
  HttpStatus,
} from '@nestjs/common';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { PrismaClient } from 'generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { RpcException } from '@nestjs/microservices';
import { PatientPaginationDto } from './dto/patient-pagination.dto';
import { PatientStatusDto } from './dto';

@Injectable()
export class PatientService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private pool: Pool;
  private adapter: PrismaPg;

  constructor() {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
    const adapter = new PrismaPg(pool);
    super({ adapter });
    this.pool = pool;
    this.adapter = adapter;
  }

  private readonly logger = new Logger(PatientService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Prisma connected to the database');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Prisma disconnected from the database');
  }

  async create(data: CreatePatientDto) {
    try {
      return await this.patient.create({ data });
    } catch (error) {
      this.logger.error('Error creating paciente', error);
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error creating paciente',
        error,
      });
    }
  }

  async findAll(patientPaginationDto: PatientPaginationDto) {
    try {
      const totalPages = await this.patient.count({
        where: {
          status: patientPaginationDto.status,
        },
      });

      const currentPage = patientPaginationDto.page;
      const pageSize = patientPaginationDto.size;

      return {
        data: await this.patient.findMany({
          skip: (currentPage - 1) * pageSize,
          take: pageSize,
          where: {
            status: patientPaginationDto.status,
          },
        }),
        meta: {
          total: totalPages,
          page: currentPage,
          lastPage: Math.ceil(totalPages / pageSize),
        },
      };
    } catch (error) {
      this.logger.error('Error finding patients', error);
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error finding patients',
        error,
      });
    }
  }

  async findById(id: number) {
    const patient = await this.patient.findUnique({ where: { id } });

    if (!patient) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Patient with ID ${id} not found`,
      });
    }

    return patient;
  }

  async update(id: number, data: UpdatePatientDto) {
    try {
      return await this.patient.update({
        where: { id },
        data,
      });
    } catch (error) {
      this.logger.error(`Error updating patient with ID ${id}`, error);
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error updating patient with ID ${id}`,
        error,
      });
    }
  }

  async changeStatus(changePacienteStatusDto: PatientStatusDto, id: number) {
    const { status } = changePacienteStatusDto;
    try {
      const patient = await this.patient.findUnique({ where: { id } });

      if (!patient) {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: `Patient with ID ${id} not found`,
        });
      }
      if (patient.status === status) {
        return patient;
      }

      return await this.patient.update({ where: { id }, data: { status: status } });
    } catch (error) {
      this.logger.error(`Error changing status for patient with ID ${id}`, error);
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error changing status for patient with ID ${id}`,
        error,
      });
    }
  }
}
