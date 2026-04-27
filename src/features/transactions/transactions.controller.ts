import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransactionsService } from './transactions.service';
import { BuildPredictionDto } from './dto/build-prediction.dto';
import { SubmitTransactionDto } from './dto/submit-transaction.dto';
import type { Request as ExpressRequest } from 'express';

@Controller('transactions')
@UseGuards(AuthGuard('jwt'))
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('build-prediction')
  buildPrediction(
    @Body() dto: BuildPredictionDto,
    @Request() req: ExpressRequest & { user?: { [key: string]: any } },
  ) {
    return this.transactionsService.buildPrediction(dto, req.user);
  }

  @Post('submit')
  submit(@Body() dto: SubmitTransactionDto) {
    return this.transactionsService.submit(dto);
  }
}
