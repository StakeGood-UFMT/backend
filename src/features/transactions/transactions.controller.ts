import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransactionsService } from './transactions.service';
import { BuildPredictionDto } from './dto/build-prediction.dto';

@Controller('transactions')
@UseGuards(AuthGuard('jwt'))
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('build-prediction')
  buildPrediction(@Body() dto: BuildPredictionDto, @Request() req: any) {
    return this.transactionsService.buildPrediction(dto, req.user);
  }
}
