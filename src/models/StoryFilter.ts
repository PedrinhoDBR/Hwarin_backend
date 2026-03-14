import {Entity,PrimaryGeneratedColumn,Column,ManyToOne,JoinColumn,} from 'typeorm';
import { Story } from './Story';

@Entity('story_filter')
export class StoryFilter {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  story_id!: number;

  @Column({ type: 'varchar' })
  type!: string; // personagens, generos, tags

  @Column({ type: 'varchar', nullable: true })
  description!: string;

  @ManyToOne(() => Story, (story) => story.filters)
  @JoinColumn({ name: 'story_id' })
  story!: Story;
}
