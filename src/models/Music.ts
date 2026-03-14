import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('music')
export class Music {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  link!: string;
}
