import { Controller, Get } from '@nestjs/common';

@Controller('vehicles')
export class VehiclesController {
  @Get()
  getVehicles(): string {
    return '[]';
  }
}
