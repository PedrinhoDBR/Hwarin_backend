import {Entity,PrimaryGeneratedColumn,Column,CreateDateColumn,OneToMany} from 'typeorm';
import { UserFollow } from './UserFollow';
import { UserStory } from './UserStory';
import { StoryRating } from './StoryRating';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar' })
  username!: string;

  @Column({ type: 'varchar', unique: true })
  email!: string;

  @Column({ type: 'varchar' })
  password_hash!: string;

  @Column({ type: 'varchar' })
  role!: string;

  @CreateDateColumn()
  created_at!: Date;

  @OneToMany(() => UserFollow, (follow) => follow.user)
  following!: UserFollow[];

  @OneToMany(() => UserFollow, (follow) => follow.followingUser)
  followers!: UserFollow[];

  @OneToMany(() => UserStory, (userStory) => userStory.user)
  userStories!: UserStory[];

  @OneToMany(() => StoryRating, (rating) => rating.user)
  ratings!: StoryRating[];
}
