import type { ReactElement } from 'react';
import HomePage from '../pages/Home';
import SearchPage from '../pages/SearchPage';
import UserPage from '../pages/User';
import CreateStory from '../pages/CreateStory';
import MyStories from '../pages/MyStory';
import StoryDetails from '../pages/StoryDetail';
import ChapterReader from '../pages/ChapterReader';
import Library from '../pages/Library';
import AuthorPage from '../pages/Author';

export interface PrivateRouteDefinition {
  path: string;
  element: ReactElement;
}

export const privateRoutes: PrivateRouteDefinition[] = [
  { path: '/', element: <HomePage /> },
  { path: '/user', element: <UserPage /> },
  { path: '/story/:id', element: <CreateStory /> },
  { path: '/search', element: <SearchPage /> },
  { path: '/library', element: <Library /> },
  { path: '/autor/:id', element: <AuthorPage /> },
  { path: '/story/new', element: <CreateStory /> },
  { path: '/stories', element: <MyStories /> },
  { path: '/historia/:id', element: <StoryDetails /> },
  {
    path: '/historia/:id/capitulo/:chapterId',
    element: <ChapterReader />,
  },
];
