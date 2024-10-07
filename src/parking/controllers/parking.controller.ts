import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ParkingService } from '../services/parking.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CurrentUser } from 'src/core/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { ParkingFinishInput, ParkingInitInput } from '../models/parking.dto';

@Controller('api/parking')
export class ParkingController {
  constructor(private parkingService: ParkingService) {}

  @Get('')
  @UseGuards(JwtAuthGuard)
  async getAllParkings(@CurrentUser() user: User): Promise<any> {
    return await this.parkingService.getAllParkings(user.id);
  }

  @Get('cities')
  @UseGuards(JwtAuthGuard)
  async getAllCities(): Promise<any> {
    return await this.parkingService.getAllCities();
  }

  @Post('')
  @UseGuards(JwtAuthGuard)
  async createParking(
    @Body() parkingInitInput: ParkingInitInput,
    @CurrentUser() user: User,
  ): Promise<any> {
    return await this.parkingService.startParking(parkingInitInput, user.id);
  }

  @Put(':parkingId')
  async updateParking(
    @Param('parkingId', new ParseIntPipe()) parkingId, 
    @Body() parkingFinishInput: ParkingFinishInput,
  ): Promise<any> {
    return await this.parkingService.finishParking(parkingId, parkingFinishInput);
  }
}
