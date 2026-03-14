import { DataSource } from 'typeorm';
import dotenv from "dotenv";

import { User } from '../models/User';
import { Story } from '../models/Story';
import { UserFollow } from '../models/UserFollow';
import { UserStory } from '../models/UserStory';
import { StoryFilter } from '../models/StoryFilter';
import { StoryRating } from '../models/StoryRating';
import { StorySuggestion } from '../models/StorySuggestion';
import { StoryInfos } from '../models/StoryInfos';
import { Music } from '../models/Music';

const models = [
  User,
  Story,
  UserFollow,
  UserStory,
  StoryFilter,
  StoryRating,
  StorySuggestion,
  StoryInfos,
  Music,
];

dotenv.config();

const getEnv = (key: string, defaultValue: string = ""): string => {
  const value = process.env[key];
    return value ?? defaultValue ?? "";
}

const AppDataSource = new DataSource({
  type: "sqlite",
  database: getEnv("DB_NAME", "database.sqlite"),
  logging: false,
  subscribers: [],
  entities: models,
  dropSchema: getEnv("ENVIRONMENT") === "DEVELOPMENT",
  name: "sqlite",
  synchronize: getEnv("ENVIRONMENT") === "DEVELOPMENT",
}); 

export { AppDataSource };