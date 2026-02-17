import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { HolidayService } from './holiday.service';
import { CreateHolidayDto } from '@my-family/shared-dto';
import { AdminAuthGuard } from '../auth/admin-auth.guard';

@ApiTags('Holidays')
@ApiBearerAuth()
@UseGuards(AdminAuthGuard)
@Controller('holidays')
export class HolidayController {
  constructor(private readonly holidayService: HolidayService) {}

  @Get()
  async findAll() {
    return this.holidayService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.holidayService.findById(id);
  }

  @Post()
  async create(@Body() dto: CreateHolidayDto) {
    return this.holidayService.create(dto);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: Partial<CreateHolidayDto>) {
    return this.holidayService.update(id, dto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.holidayService.remove(id);
  }
}
