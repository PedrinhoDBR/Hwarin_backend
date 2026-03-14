import {Entity,PrimaryGeneratedColumn,Column,ManyToOne,JoinColumn} from 'typeorm';
import { Story } from './Story';

@Entity('story_infos')
export class StoryInfos {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  story_id!: number;

  @Column({ type: 'varchar', nullable: true })
  about!: string;

  @Column({ type: 'varchar', nullable: true })
  description!: string;

  @ManyToOne(() => Story, (story) => story.infos)
  @JoinColumn({ name: 'story_id' })
  story!: Story;
}
