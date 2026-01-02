import { PacienteStatus } from "@prisma/client";

export const PacienteStatusList = [
  PacienteStatus.ACTIVE,
  PacienteStatus.INACTIVE,
  PacienteStatus.SUSPENDED,
];
