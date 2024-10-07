import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ParkingFinishInput, ParkingInitInput } from '../models/parking.dto';

@Injectable()
export class ParkingService {
  constructor(private prisma: PrismaService) {}

  async getAllParkings(userId: number) {
    return await this.prisma.parking.findMany({
      where: {
        userId: userId,
      },
      include: {
        parkingArea: {
          include: {
            city: true
          },
        },
      },
    });
  }

  async getAllCities() {
    return await this.prisma.city.findMany({
      include: {
        parkingAreas: true
      }
    });
  }

  async startParking(parkingInitInput: ParkingInitInput, userId: number) {
    return await this.prisma.parking.create({
      data: {
        userId,
        parkingAreaId: parkingInitInput.parkingAreaId,
        startTime: parkingInitInput.startTime
      },
    });
  }

  async finishParking(parkingId: number, parkingFinishInput: ParkingFinishInput) {
    const endTime = new Date()
    console.log(endTime)
    const parking = await this.prisma.parking.findUnique({
      where: {
        id: parkingId,
      },
      include: {
        parkingArea: {
          include: {
            city: {
              include: {
                parkingPeriods: true,
              },
            },
          },
        },
      },
    });

    const price = await this.calculatePrice(
      parking?.startTime,
      endTime,
      parking?.parkingArea?.city,
    );

    return await this.prisma.parking.update({
      where: {
        id: parkingId,
      },
      data: {
        finalPrice: price,
        endTime: endTime,
      },
      include: {
        parkingArea: {
          include: {
            city: true,
          },
        },
      },
    });
  }

  private async calculatePrice(startTime: Date, endTime: Date, city) {
    let finalPrice = 0;
    let currentHour = startTime.getHours();
    const parkingPeriods = city.parkingPeriods.sort((a, b) => a.startTime - b.startTime);
    console.log("currenti", currentHour)
    console.log("endttime:" + endTime.getHours())
    while (currentHour < endTime.getHours() || startTime.getDate() !== endTime.getDate()) {
      console.log("<<<<<<>>>>>>>")
      const applicablePeriod = parkingPeriods.find(
        (period) => currentHour >= period.startTime && currentHour < period.endTime
      );
  
      if (!applicablePeriod) {
        // If no applicable period found, use city's default price
        finalPrice += city.defaultPrice;
      } else {
        finalPrice += applicablePeriod.price;
      }
  
      currentHour++;
      if (currentHour === 24) {
        currentHour = 0;
      }
    }
  
    return finalPrice;
  }
}
