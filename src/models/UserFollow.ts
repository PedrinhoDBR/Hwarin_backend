import {Entity,ManyToOne,JoinColumn,CreateDateColumn,PrimaryColumn} from 'typeorm';
import { User } from './User';

@Entity('user_follow')
export class UserFollow {
  @PrimaryColumn()
  user_id!: number;

  @PrimaryColumn()
  following_user_id!: number;

  @CreateDateColumn()
  followed_at!: Date;

  @ManyToOne(() => User, (user) => user.following)
  @JoinColumn({ name: 'user_id' })
  user!: User;

  @ManyToOne(() => User, (user) => user.followers)
  @JoinColumn({ name: 'following_user_id' })
  followingUser!: User;
}
