import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index,
} from 'typeorm';

@Entity('vote_allocations')
export class VoteAllocationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column({ name: 'vote_id' })
  voteId: string;

  @Column({ name: 'ngo_id' })
  ngoId: string;

  @Column({ name: 'allocated_votes', type: 'int' })
  allocatedVotes: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
