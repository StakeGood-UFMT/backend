import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';
import { NgoEntity } from '../src/database/entities/ngo.entity';
import { ImpactLedgerEntryEntity } from '../src/database/entities/impact-ledger-entry.entity';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const dataSource = app.get(DataSource);
  
  const ngos = await dataSource.getRepository(NgoEntity).find();
  const entries = await dataSource.getRepository(ImpactLedgerEntryEntity).find();
  
  for (const ngo of ngos) {
    const ngoEntries = entries.filter(e => e.ngoId === ngo.id || e.ngoId === String(ngo.onChainId));
    const total = ngoEntries.reduce((sum, e) => sum + Number(e.amount), 0);
    ngo.totalFundsReceived = total;
    await dataSource.getRepository(NgoEntity).save(ngo);
    console.log(`Updated NGO ${ngo.name} with total ${total}`);
  }
  
  await app.close();
}

bootstrap();
