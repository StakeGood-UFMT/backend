import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
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
import { NotificationsModule } from './features/notifications/notifications.module';
import { BullModule } from '@nestjs/bullmq';
import { ProposalModule } from './features/proposals/proposals.module';
import { SettingsModule } from './features/settings/settings.module';
import { LeaderboardModule } from './features/leaderboard/leaderboard.module';
import { LegalModule } from './features/legal/legal.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),

    ...(process.env.ENABLE_REDIS === 'true'
      ? [
          BullModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
              connection: {
                host: config.get('REDIS_HOST', 'localhost'),
                port: config.get<number>('REDIS_PORT', 6379),
              },
            }),
          }),
        ]
      : []),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const useCloudSql =
          (process.env.USE_CLOUDSQL ?? config.get<string>('USE_CLOUDSQL')) ===
          'true';

        const url = useCloudSql
          ? process.env.DATABASE_URL || config.get<string>('DATABASE_URL')
          : undefined;

        if (useCloudSql) {
          console.log('📦 Database: Connecting via DATABASE_URL');
        } else {
          console.log(
            `🏠 Database: Connecting via Host: ${config.get('DB_HOST', 'localhost')}`,
          );
        }

        const synchronize =
          config.get<string>('DB_SYNCHRONIZE') === 'true' ||
          config.get<string>('NODE_ENV') !== 'production';
        const logging = config.get<string>('NODE_ENV') === 'development';
        const ssl = useCloudSql
          ? { rejectUnauthorized: false }
          : config.get<string>('NODE_ENV') === 'production'
            ? { rejectUnauthorized: false }
            : false;

        const baseConfig = {
          type: 'postgres' as const,
          entities: [__dirname + '/database/entities/*.entity{.ts,.js}'],
          migrations: [__dirname + '/database/migrations/*{.ts,.js}'],
          autoLoadEntities: true,
          synchronize,
          logging,
          ssl,
        };

        if (url) {
          return {
            ...baseConfig,
            url,
          };
        } else {
          return {
            ...baseConfig,
            host: config.get<string>('DB_HOST', 'localhost'),
            port: Number(config.get<string>('DB_PORT', '5432')),
            username: config.get<string>('DB_USER', 'stakegood'),
            password: config.get<string>('DB_PASSWORD', 'stakegood_pass'),
            database: config.get<string>('DB_NAME', 'stakegood_dev'),
          };
        }
      },
    }),

    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        throttlers: [
          {
            ttl: config.get<number>('THROTTLE_TTL', 60) * 1000,
            limit: config.get<number>('THROTTLE_LIMIT', 10),
          },
        ],
      }),
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
    NotificationsModule,
    ProposalModule,
    SettingsModule,
    LeaderboardModule,
    LegalModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
