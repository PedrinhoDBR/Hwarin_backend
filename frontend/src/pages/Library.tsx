import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, UserRound } from 'lucide-react';

import PageHeader from '../components/PageHeader';
import StoryCard from '../components/home/StoryCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { authFetch } from '../services/api';
import type { Story } from './Home';

type Author = {
  id: number;
  username: string;
  avatar_url?: string | null;
  bio?: string | null;
};

async function getFollowedStories(): Promise<Story[]> {
  const response = await authFetch('/api/stories/following');

  if (!response.ok) {
    throw new Error('Erro ao buscar historias seguidas');
  }

  return response.json();
}

async function getFollowedAuthors(): Promise<Author[]> {
  const response = await authFetch('/api/users/following');

  if (!response.ok) {
    throw new Error('Erro ao buscar autores seguidos');
  }

  return response.json();
}

export default function Library() {
  const {
    data: stories = [],
    isLoading: loadingStories,
    isError: storiesError,
  } = useQuery({
    queryKey: ['stories-library-following'],
    queryFn: getFollowedStories,
  });

  const {
    data: authors = [],
    isLoading: loadingAuthors,
    isError: authorsError,
  } = useQuery({
    queryKey: ['authors-library-following'],
    queryFn: getFollowedAuthors,
  });

  return (
    <div className="min-h-screen">
      <PageHeader title="Biblioteca" />

      <section className="p-6">
        <Tabs defaultValue="stories" className="space-y-5">
          <TabsList className="border border-border/30 bg-secondary/30">
            <TabsTrigger value="stories">Historias seguidas</TabsTrigger>
            <TabsTrigger value="authors">Autores seguidos</TabsTrigger>
          </TabsList>

          <TabsContent value="stories">
            {storiesError && (
              <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                Nao foi possivel carregar suas historias seguidas.
              </div>
            )}

            {loadingStories ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
                {Array.from({ length: 8 }, (_, index) => (
                  <div
                    key={index}
                    className="aspect-[2/3] animate-pulse rounded-xl border border-border/30 bg-card/50"
                  />
                ))}
              </div>
            ) : stories.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-border/30 bg-card/50 p-10 text-center">
                <BookOpen className="mb-3 h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  As historias que voce seguir aparecem aqui.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
                {stories.map((story) => (
                  <StoryCard key={story.id} story={story} size="large" />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="authors">
            {authorsError && (
              <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
                Nao foi possivel carregar seus autores seguidos.
              </div>
            )}

            {loadingAuthors ? (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }, (_, index) => (
                  <div
                    key={index}
                    className="h-24 animate-pulse rounded-xl border border-border/30 bg-card/50"
                  />
                ))}
              </div>
            ) : authors.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-xl border border-border/30 bg-card/50 p-10 text-center">
                <UserRound className="mb-3 h-10 w-10 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">
                  Os autores que voce seguir aparecem aqui.
                </p>
              </div>
            ) : (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {authors.map((author) => (
                  <Link
                    key={author.id}
                    to={`/autor/${author.id}`}
                    className="flex items-center gap-4 rounded-xl border border-border/30 bg-card/50 p-4 transition-colors hover:border-primary/40 hover:bg-card/70"
                  >
                    {author.avatar_url ? (
                      <img
                        src={author.avatar_url}
                        alt={author.username}
                        className="h-14 w-14 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary/60">
                        <UserRound className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <h3 className="truncate font-semibold text-foreground">
                        {author.username}
                      </h3>
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {author.bio || 'Sem descricao cadastrada.'}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
