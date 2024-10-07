import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class PrismaClientService {
  private readonly extendedPrismaClient;
  constructor(private prisma: PrismaService) {
    this.extendedPrismaClient = this.prisma;
  }

  getClient() {
    return this.extendedPrismaClient;
  }
}
