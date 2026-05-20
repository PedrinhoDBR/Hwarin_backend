import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BookOpen, Heart, Loader2, UserRound } from 'lucide-react';
import { useParams } from 'react-router-dom';

import PageHeader from '../components/PageHeader';
import StoryCard from '../components/home/StoryCard';
import { Button } from '../components/ui/button';
import { useAuth } from '../hooks/UseAuth';
import { authFetch } from '../services/api';
import type { Story } from './Home';

type Author = {
  id: number;
  username: string;
  email?: string;
  role?: string;
  avatar_url?: string | null;
  bio?: string | null;
};

type FollowStatus = {
  is_following: boolean;
  followers_count: number;
};

async function getAuthor(id: string): Promise<Author> {
  const response = await authFetch(`/api/users/${id}`);

  if (!response.ok) {
    throw new Error('Erro ao buscar autor');
  }

  return response.json();
}

async function getAuthorStories(id: string): Promise<Story[]> {
  const response = await authFetch(`/api/stories/author/${id}`);

  if (!response.ok) {
    throw new Error('Erro ao buscar historias do autor');
  }

  return response.json();
}

async function getFollowStatus(id: string): Promise<FollowStatus> {
  const response = await authFetch(`/api/users/${id}/follow-status`);

  if (!response.ok) {
    throw new Error('Erro ao buscar status');
  }

  return response.json();
}

export default function AuthorPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const authorId = id ?? '';
  const isOwnProfile = Number(authorId) === user?.id;

  const {
    data: author,
    isLoading: loadingAuthor,
    isError: authorError,
  } = useQuery({
    queryKey: ['author', authorId],
    enabled: Boolean(authorId),
    queryFn: () => getAuthor(authorId),
  });

  const { data: stories = [], isLoading: loadingStories } = useQuery({
    queryKey: ['author-stories', authorId],
    enabled: Boolean(authorId),
    queryFn: () => getAuthorStories(authorId),
  });

  const { data: followStatus } = useQuery({
    queryKey: ['author-follow-status', authorId],
    enabled: Boolean(authorId) && !isOwnProfile,
    queryFn: () => getFollowStatus(authorId),
  });

  const followMutation = useMutation({
    mutationFn: async () => {
      const method = followStatus?.is_following ? 'DELETE' : 'POST';
      const response = await authFetch(`/api/users/${authorId}/follow`, {
        method,
      });

      if (!response.ok) {
        throw new Error('Erro ao atualizar autor seguido');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['author-follow-status', authorId],
      });
      queryClient.invalidateQueries({
        queryKey: ['authors-library-following'],
      });
    },
  });

  if (loadingAuthor) {
    return (
      <div className="min-h-screen">
        <PageHeader title="Autor" />
        <div className="flex min-h-80 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (authorError || !author) {
    return (
      <div className="min-h-screen">
        <PageHeader title="Autor" />
        <div className="flex min-h-80 items-center justify-center text-sm text-muted-foreground">
          Autor nao encontrado.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <PageHeader title={author.username} />

      <section className="space-y-6 p-6">
        <div className="flex flex-col gap-5 rounded-xl border border-border/30 bg-card/50 p-6 md:flex-row md:items-center">
          {author.avatar_url ? (
            <img
              src={author.avatar_url}
              alt={author.username}
              className="h-24 w-24 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-secondary/60">
              <UserRound className="h-10 w-10 text-muted-foreground" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            <h2 className="text-2xl font-semibold text-foreground">
              {author.username}
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {author.bio || 'Este autor ainda nao adicionou uma descricao.'}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <span>{stories.length} historia(s)</span>
              {!isOwnProfile && (
                <span>
                  {followStatus?.followers_count ?? 0} seguidor(es)
                </span>
              )}
            </div>
          </div>

          {!isOwnProfile && (
            <Button
              type="button"
              onClick={() => followMutation.mutate()}
              disabled={followMutation.isPending}
              className="gap-2 rounded-full"
            >
              <Heart
                className={`h-4 w-4 ${
                  followStatus?.is_following ? 'fill-current' : ''
                }`}
              />
              {followStatus?.is_following ? 'Seguindo' : 'Seguir autor'}
            </Button>
          )}
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Historias do autor
          </h3>

          {loadingStories ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
              {Array.from({ length: 6 }, (_, index) => (
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
                Nenhuma historia publicada por este autor.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
              {stories.map((story) => (
                <StoryCard key={story.id} story={story} size="large" />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
