import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientService } from '../prisma/prisma-client.service';
import { ParkingController } from './controllers/parking.controller';
import { ParkingService } from './services/parking.service';

@Module({
  controllers: [ParkingController],
  providers: [ParkingService, PrismaService, PrismaClientService],
})
export class ParkingModule {}
