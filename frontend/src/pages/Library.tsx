import { useQuery } from '@tanstack/react-query';
import PageHeader from '../components/PageHeader';
import StoryCard from '../components/home/StoryCard';
import { authFetch } from '../services/api';
import type { Story } from './Home';

async function getStories(): Promise<Story[]> {
  const response = await authFetch('/api/stories');

  if (!response.ok) {
    throw new Error('Erro ao buscar historias');
  }

  return response.json();
}

export default function Library() {
  const {
    data: stories = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['stories-library'],
    queryFn: getStories,
  });

  return (
    <div className="min-h-screen">
      <PageHeader title="Biblioteca" />

      <section className="p-6">
        {isError && (
          <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            Nao foi possivel carregar a biblioteca agora.
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
            {Array.from({ length: 12 }, (_, index) => (
              <div
                key={index}
                className="aspect-[2/3] rounded-2xl border border-border/30 bg-card/50 animate-pulse"
              />
            ))}
          </div>
        ) : stories.length === 0 ? (
          <div className="rounded-2xl border border-border/30 bg-card/50 p-8 text-center text-sm text-muted-foreground">
            Nenhuma historia publicada ainda.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
            {stories.map((story) => (
              <StoryCard
                key={story.id}
                story={story}
                size="large"
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
