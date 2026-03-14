import {Entity,PrimaryGeneratedColumn,Column,ManyToOne,JoinColumn} from 'typeorm';
import { User } from './User';
import { Story } from './Story';

@Entity('user_story')
export class UserStory {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  user_id!: number;

  @Column()
  story_id!: number;

  @Column({ type: 'varchar' })
  role!: string; // autor, editor, leitor, tradutor...

  @ManyToOne(() => User, (user) => user.userStories)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => Story, (story) => story.userStories)
  @JoinColumn({ name: 'story_id' })
  story!: Story;
}
