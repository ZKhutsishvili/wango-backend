import { IsNotEmpty, IsNumber } from 'class-validator';

export class ParkingInitInput {
  @IsNumber()
  @IsNotEmpty()
  parkingAreaId: number;

  startTime: Date
}

export class ParkingFinishInput {
  endTime: Date
}
