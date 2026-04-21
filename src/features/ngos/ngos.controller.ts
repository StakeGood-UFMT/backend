import { Controller, Get, Query } from '@nestjs/common';
import { NgosService } from './ngos.service';

@Controller('ngos')
export class NgosController {
  constructor(private readonly ngosService: NgosService) {}

  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('verified') verified?: string,
    @Query('limit') limit = 20,
    @Query('offset') offset = 0,
    @Query('sort') sort = 'trending',
  ) {
    return this.ngosService.findAll({
      category,
      verified: verified !== undefined ? verified === 'true' : undefined,
      limit: +limit,
      offset: +offset,
      sort,
    });
  }
}
