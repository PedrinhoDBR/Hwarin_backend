import { useQuery } from '@tanstack/react-query';

import PageHeader from '../components/PageHeader';
import FeaturedStory from '../components/home/FeaturedStory';
import CommunitySection from '../components/home/CommunitySection';
import RecentUpdates from '../components/home/RecentUpdates';
import LibrarySection from '../components/home/LibrarySection';

import { authFetch } from '../services/api';

export interface Story {
  id: number;
  title?: string | null;
  subtitle?: string | null;
  synopsis?: string | null;
  status?: string | null;
  language?: string | null;
  cover?: string | null;
  cover_url?: string | null;
  tags?: string[];
  genres?: string[];
  author?: {
    id: number;
    username: string;
    avatar_url?: string | null;
    bio?: string | null;
  } | null;
}

async function getStories(): Promise<Story[]> {
  const response = await authFetch('/api/stories');

  if (!response.ok) {
    throw new Error('Erro ao buscar historias');
  }

  return response.json();
}

export default function Home() {
  const {
    data: stories = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['stories'],
    queryFn: getStories,
  });

  const featured = stories[0];

  return (
    <div className="min-h-screen">
      <PageHeader title="Inicio" />

      <div className="space-y-6 p-6">
        {isError && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            Nao foi possivel carregar as historias agora.
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="h-52 rounded-2xl border border-border/30 bg-card/50 animate-pulse" />
            ) : (
              <FeaturedStory story={featured} />
            )}
          </div>

          <div className="lg:col-span-5">
            <CommunitySection />
          </div>

          <div className="lg:col-span-4">
            <RecentUpdates stories={stories} />
          </div>
        </div>

        {isLoading ? (
          <div className="h-64 rounded-2xl border border-border/30 bg-card/50 animate-pulse" />
        ) : (
          <LibrarySection stories={stories} />
        )}

        <div className="relative h-40 overflow-hidden rounded-2xl border border-border/20 bg-gradient-to-b from-primary/5 via-accent/5 to-background">
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-sm text-muted-foreground font-heading">
              Explore o universo de historias
            </p>
          </div>

          {Array.from({ length: 20 }, (_, index) => (
            <div
              key={index}
              className="absolute h-1 w-1 rounded-full bg-primary/40 animate-pulse"
              style={{
                left: `${(index * 37) % 100}%`,
                top: `${(index * 53) % 100}%`,
                animationDelay: `${(index % 5) * 0.45}s`,
                animationDuration: `${2 + (index % 4) * 0.5}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
