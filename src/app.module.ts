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
import { ScheduleModule } from '@nestjs/schedule';
import { KeeperModule } from './features/keeper/keeper.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const url = process.env.DATABASE_URL || config.get<string>('DATABASE_URL');

        if (url) {
          console.log('📦 Database: Connecting via DATABASE_URL');
        } else {
          console.log(`🏠 Database: Connecting via Host: ${config.get('DB_HOST', 'localhost')}`);
        }

        const dbConfig: any = {
          type: 'postgres',
          entities: [__dirname + '/database/entities/*.entity{.ts,.js}'],
          migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
          synchronize:
            config.get('DB_SYNCHRONIZE') === 'true' ||
            config.get('NODE_ENV') !== 'production',
          logging: config.get('NODE_ENV') === 'development',
          ssl:
            config.get('NODE_ENV') === 'production'
              ? { rejectUnauthorized: false }
              : false,
        };

        if (url) {
          dbConfig.url = url;
        } else {
          dbConfig.host = config.get('DB_HOST', 'localhost');
          dbConfig.port = config.get<number>('DB_PORT', 5432);
          dbConfig.username = config.get('DB_USER', 'stakegood');
          dbConfig.password = config.get('DB_PASSWORD', 'stakegood_pass');
          dbConfig.database = config.get('DB_NAME', 'stakegood_dev');
        }

        return dbConfig;
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
    KeeperModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
