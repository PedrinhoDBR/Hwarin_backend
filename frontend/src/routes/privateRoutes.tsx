import type { ReactElement } from 'react';
import HomePage from '../pages/Home';
import StoryPage from '../pages/StoryPage';
import UserPage from '../pages/User';
import CreateStory from '../pages/CreateStory';
import MyStories from '../pages/MyStory';

export interface PrivateRouteDefinition {
  path: string;
  title: string;
  element: ReactElement;
}

export const privateRoutes: PrivateRouteDefinition[] = [
  { path: '/', title: 'Home Page', element: <HomePage /> },
  { path: '/user', title: 'Perfil', element: <UserPage /> },
  { path: '/story/:id', title: 'História', element: <CreateStory /> },
  { path: '/search', title: 'Buscar', element: <StoryPage /> },
  { path: '/library', title: 'Biblioteca', element: <div>Biblioteca</div> },
  { path: '/downloads', title: 'Downloads', element: <div>Downloads</div> },
  { path: '/story/new', title: 'Nova História', element: <CreateStory />  },
  { path: '/stories', title: 'Minhas Histórias', element: <MyStories /> },
];
