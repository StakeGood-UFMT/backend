import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Query,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { NgosService } from './ngos.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateNgoDto } from './dto/create-ngo.dto';

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

  @Get(':idOrSlug')
  getByIdOrSlug(@Param('idOrSlug') idOrSlug: string) {
    if (
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        idOrSlug,
      )
    ) {
      return this.ngosService.findOne(idOrSlug);
    }
    return this.ngosService.findBySlug(idOrSlug);
  }

  @Get(':id/timeline')
  getTimeline(@Param('id') id: string) {
    return this.ngosService.getTimeline(id);
  }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  create(@Body() data: CreateNgoDto) {
    return this.ngosService.create(data);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  update(@Param('id') id: string, @Body() data: Partial<CreateNgoDto>) {
    return this.ngosService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  remove(@Param('id') id: string) {
    return this.ngosService.remove(id);
  }
}
