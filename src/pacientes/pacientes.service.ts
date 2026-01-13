import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
  HttpStatus,
} from '@nestjs/common';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { PrismaClient } from 'generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { RpcException } from '@nestjs/microservices';
import { PacientePaginationDto } from './dto/pacientes-pagination.dto';
import { ChangePacienteStatusDto } from './dto';

@Injectable()
export class PacientesService
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

  private readonly logger = new Logger(PacientesService.name);

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Prisma conectado a la base de datos');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('Prisma desconectado de la base de datos');
  }

  async create(data: CreatePacienteDto) {
    try {
      return await this.paciente.create({ data });
    } catch (error) {
      this.logger.error('Error creating paciente', error);
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error creating paciente',
        error,
      });
    }
  }

  async findAll(pacientePaginationDto: PacientePaginationDto) {
    try {
      const totalPages = await this.paciente.count({
        where: {
          status: pacientePaginationDto.status,
        },
      });

      const currentPage = pacientePaginationDto.page;
      const pageSize = pacientePaginationDto.size;

      return {
        data: await this.paciente.findMany({
          skip: (currentPage - 1) * pageSize,
          take: pageSize,
          where: {
            status: pacientePaginationDto.status,
          },
        }),
        meta: {
          total: totalPages,
          page: currentPage,
          lastPage: Math.ceil(totalPages / pageSize),
        },
      };
    } catch (error) {
      this.logger.error('Error finding pacientes', error);
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Error finding pacientes',
        error,
      });
    }
  }

  async findById(id: number) {
    const paciente = await this.paciente.findUnique({ where: { id } });

    if (!paciente) {
      throw new RpcException({
        status: HttpStatus.NOT_FOUND,
        message: `Patient with ID ${id} not found`,
      });
    }

    return paciente;
  }

  async update(id: number, data: UpdatePacienteDto) {
    try {
      return await this.paciente.update({
        where: { id },
        data,
      });
    } catch (error) {
      this.logger.error(`Error updating paciente with ID ${id}`, error);
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error updating paciente with ID ${id}`,
        error,
      });
    }
  }

  async changeStatus(changePacienteStatusDto: ChangePacienteStatusDto) {
    const { id, status } = changePacienteStatusDto;
    try {
      const paciente = await this.paciente.findUnique({ where: { id } });

      if (!paciente) {
        throw new RpcException({
          status: HttpStatus.NOT_FOUND,
          message: `Patient with ID ${id} not found`,
        });
      }
      if (paciente.status === status) {
        return paciente;
      }

      return await this.paciente.update({ where: { id }, data: { status: status } });
    } catch (error) {
      this.logger.error(`Error changing status for paciente with ID ${id}`, error);
      throw new RpcException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: `Error changing status for paciente with ID ${id}`,
        error,
      });
    }
  }
}
