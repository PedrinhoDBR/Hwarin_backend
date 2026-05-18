import type { ReactElement } from 'react';
import HomePage from '../pages/Home';
import SearchPage from '../pages/SearchPage.tsx';
import UserPage from '../pages/User';
import CreateStory from '../pages/CreateStory';
import MyStories from '../pages/MyStory';
import StoryDetails from '../pages/StoryDetail';
import ChapterReader from '../pages/ChapterReader';

export interface PrivateRouteDefinition {
  path: string;
  title: string;
  element: ReactElement;
}

export const privateRoutes: PrivateRouteDefinition[] = [
  { path: '/', title: 'Home Page', element: <HomePage /> },
  { path: '/user', title: 'Perfil', element: <UserPage /> },
  { path: '/story/:id', title: 'História', element: <CreateStory /> },
  { path: '/search', title: 'Buscar', element: <SearchPage /> },
  { path: '/library', title: 'Biblioteca', element: <div>Biblioteca</div> },
  { path: '/story/new', title: 'Nova História', element: <CreateStory />  },
  { path: '/stories', title: 'Minhas Histórias', element: <MyStories /> },
  { path: '/historia/:id', title: 'Detalhes da História', element: <StoryDetails /> },
  { path: '/historia/:id/capitulo/:chapterId', title: 'Capítulo', element: <ChapterReader /> }
];
