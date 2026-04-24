import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './features/auth/auth.module';
import { MarketsModule } from './features/markets/markets.module';
import { TransactionsModule } from './features/transactions/transactions.module';
import { NgosModule } from './features/ngos/ngos.module';
import { ImpactModule } from './features/impact/impact.module';
import { WorkerModule } from './features/worker/worker.module';
import { WebsocketModule } from './features/websocket/websocket.module';
import { AdminModule } from './features/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const url = config.get<string>('DATABASE_URL');
        return {
          type: 'postgres',
          url,
          host: url ? undefined : config.get('DB_HOST', 'localhost'),
          port: url ? undefined : config.get<number>('DB_PORT', 5432),
          username: url ? undefined : config.get('DB_USER', 'stakegood'),
          password: url ? undefined : config.get('DB_PASSWORD', 'stakegood_pass'),
          database: url ? undefined : config.get('DB_NAME', 'stakegood_dev'),
          entities: [__dirname + '/database/entities/*.entity{.ts,.js}'],
          migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
          synchronize: config.get('NODE_ENV') !== 'production',
          logging: config.get('NODE_ENV') === 'development',
          ssl: config.get('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
        };
      },
    }),

    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>('THROTTLE_TTL', 60) * 1000,
          limit: config.get<number>('THROTTLE_LIMIT', 5),
        },
      ],
    }),

    AuthModule,
    MarketsModule,
    TransactionsModule,
    NgosModule,
    ImpactModule,
    WorkerModule,
    WebsocketModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
