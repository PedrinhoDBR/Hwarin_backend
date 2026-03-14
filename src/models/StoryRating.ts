import {Entity,Column,ManyToOne,JoinColumn,PrimaryColumn,} from 'typeorm';
import { User } from './User';
import { Story } from './Story';

@Entity('story_rating')
export class StoryRating {
  @PrimaryColumn()
  user_id!: number;

  @PrimaryColumn()
  story_id!: number;

  @Column({ type: 'int' })
  value!: number;

  @Column({ type: 'varchar', nullable: true })
  description!: string;

  @ManyToOne(() => User, (user) => user.ratings)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Story, (story) => story.ratings)
  @JoinColumn({ name: 'story_id' })
  story!: Story;
}
