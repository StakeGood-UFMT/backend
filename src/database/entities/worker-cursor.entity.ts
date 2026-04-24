import {
  Entity, PrimaryColumn, Column, UpdateDateColumn,
} from 'typeorm';

@Entity('worker_cursors')
export class WorkerCursorEntity {
  @PrimaryColumn({ length: 50 })
  id: string;

  @Column({ name: 'last_ledger_id', type: 'bigint', default: 0 })
  lastLedgerId: string;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
