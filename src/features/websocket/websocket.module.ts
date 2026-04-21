import { Module } from '@nestjs/common';
import { StakeGoodGateway } from './stakegood.gateway';

@Module({
  providers: [StakeGoodGateway],
  exports: [StakeGoodGateway],
})
export class WebsocketModule {}
