import {
  Injectable,
  Logger,
  OnModuleInit,
  OnModuleDestroy,
} from '@nestjs/common';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { PrismaClient } from 'generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { connect } from 'http2';
import { Pool } from 'pg';

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
    return this.paciente.create({ data });
  }

  async findAll() {
    return this.paciente.findMany();
  }

  async findOne(id: number) {
    return this.paciente.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdatePacienteDto) {
    return this.paciente.update({
      where: { id },
      data,
    });
  }

  async remove(id: number) {
    return this.paciente.delete({ where: { id } });
  }
}
