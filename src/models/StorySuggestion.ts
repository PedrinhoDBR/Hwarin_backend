import {Entity,PrimaryGeneratedColumn,Column,ManyToOne,JoinColumn} from 'typeorm';
import { Story } from './Story';

@Entity('story_suggestion')
export class StorySuggestion {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  story_id!: number;

  @Column({ type: 'varchar', nullable: true })
  about!: string;

  @Column({ type: 'text', nullable: true })
  suggestion!: string;

  @ManyToOne(() => Story, (story) => story.suggestions)
  @JoinColumn({ name: 'story_id' })
  story!: Story;
}
