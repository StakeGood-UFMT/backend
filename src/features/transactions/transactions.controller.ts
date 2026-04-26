import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TransactionsService } from './transactions.service';
import { BuildPredictionDto } from './dto/build-prediction.dto';
import { BuildClaimDto } from './dto/build-claim.dto';
import { BuildVoteDto } from './dto/build-vote.dto';
import { SubmitTransactionDto } from './dto/submit-transaction.dto';

@Controller('transactions')
@UseGuards(AuthGuard('jwt'))
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @Post('build-prediction')
  buildPrediction(@Body() dto: BuildPredictionDto, @Request() req: any) {
    return this.transactionsService.buildPrediction(dto, req.user);
  }

  @Post('build-claim')
  buildClaim(@Body() dto: BuildClaimDto, @Request() req: any) {
    return this.transactionsService.buildClaim(dto, req.user);
  }

  @Post('build-vote')
  buildVote(@Body() dto: BuildVoteDto, @Request() req: any) {
    return this.transactionsService.buildVote(dto, req.user);
  }

  @Post('submit')
  submit(@Body() dto: SubmitTransactionDto) {
    return this.transactionsService.submit(dto);
  }
}
