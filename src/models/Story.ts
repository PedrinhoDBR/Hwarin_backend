import {Entity,PrimaryGeneratedColumn,Column,ManyToOne,OneToMany,JoinColumn} from 'typeorm';
import { UserStory } from './UserStory';
import { StoryFilter } from './StoryFilter';
import { StoryRating } from './StoryRating';
import { StoryInfos } from './StoryInfos';
import { StorySuggestion } from './StorySuggestion';

@Entity('story')
export class Story {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', nullable: true })
  title!: string;

  @Column({ type: 'varchar', nullable: true })
  subtitle!: string;

  @Column({ type: 'text', nullable: true })
  text!: string;

  @Column({ type: 'varchar', nullable: true })
  status!: string; // finalizada, cancelada, em andamento...

  @Column({ type: 'int', nullable: true })
  master_story_id!: number | null;

  @Column({ type: 'varchar', nullable: true })
  language!: string;

  @Column({ type: 'varchar', nullable: true })
  cover!: string;

  @ManyToOne(() => Story, (story) => story.translations, { nullable: true })
  @JoinColumn({ name: 'master_story_id' })
  masterStory!: Story | null;

  @OneToMany(() => Story, (story) => story.masterStory)
  translations!: Story[];

  @OneToMany(() => UserStory, (userStory) => userStory.story)
  userStories!: UserStory[];

  @OneToMany(() => StoryFilter, (filter) => filter.story)
  filters!: StoryFilter[];

  @OneToMany(() => StoryRating, (rating) => rating.story)
  ratings!: StoryRating[];

  @OneToMany(() => StoryInfos, (info) => info.story)
  infos!: StoryInfos[];

  @OneToMany(() => StorySuggestion, (suggestion) => suggestion.story)
  suggestions!: StorySuggestion[];
}
