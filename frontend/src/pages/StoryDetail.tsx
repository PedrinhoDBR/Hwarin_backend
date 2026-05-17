import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';

import StoryHeader from '../components/story/StoryHeader';
import ChapterList from '../components/story/ChapterList';
import CommentsSection from '../components/story/CommentsSection';
import { authFetch } from '../services/api';

export default function StoryDetails() {
  const storyId = window.location.pathname.split('/historia/')[1]?.split('/')[0];

  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    authFetch('/api/auth/me')
      .then(r => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then(setUser)
      .catch(() => setUser(null));
  }, []);

  const { data: story, isLoading: loadingStory } = useQuery({
    queryKey: ['story', storyId],
    enabled: !!storyId,
    queryFn: async () => {
      const res = await authFetch(`/api/stories/${storyId}`);
      if (!res.ok) throw new Error('Erro ao buscar história');
      return res.json();
    },
  });

  const { data: chapters = [] } = useQuery({
    queryKey: ['chapters', storyId],
    enabled: !!storyId,
    queryFn: async () => {
      const res = await authFetch(`/api/chapters/story/${storyId}`);
      if (!res.ok) throw new Error();
      return res.json();
    },
  });

  const { data: comments = [] } = useQuery({
    queryKey: ['comments', storyId],
    enabled: !!storyId,
    queryFn: async () => {
      const res = await authFetch(
        `/api/ratings/comments?story_id=${storyId}`
      );

      if (!res.ok) {
        throw new Error();
      }

      return res.json();
    },
  });

  const { data: ratings = [] } = useQuery({
    queryKey: ['ratings', storyId],
    enabled: !!storyId,
    queryFn: async () => {
      const res = await authFetch(
        `/api/ratings?story_id=${storyId}`
      );

      if (!res.ok) {
        throw new Error();
      }

      return res.json();
    },
  });

  const { data: follows = [] } = useQuery({
    queryKey: ['follows', storyId],
    enabled: !!storyId,
    queryFn: async () => {
      const res = await authFetch(`/api/follows?story_id=${storyId}`);
      if (!res.ok) throw new Error();
      return res.json();
    },
  });

  const isFollowing =
    user && follows.some(f => f.user_id === user.id);

  const followMutation = useMutation({
    mutationFn: async () => {
      if (isFollowing) {
        await authFetch(`/api/follows/${storyId}`, {
          method: 'DELETE',
        });
      } else {
        await authFetch(`/api/follows?story_id=${storyId}`, {
          method: 'POST',
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['follows', storyId] });
    },
  });

  const averageRating =
    ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length
      : 0;

  if (loadingStory) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!story) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">História não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">


      <div className="p-6 space-y-6 max-w-6xl">
        <StoryHeader
          story={story}
          averageRating={averageRating}
          isFollowing={isFollowing}
          onFollow={() => followMutation.mutate()}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <ChapterList chapters={chapters} storyId={storyId} />
            <CommentsSection comments={comments} storyId={storyId} user={user} />
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl border border-border/30 bg-card/50 p-5">
              <h3 className="font-heading font-bold text-sm uppercase tracking-wider mb-3">
                Suas Estatísticas
              </h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Seguidores</span>
                  <span className="font-medium">{follows.length}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Capítulos</span>
                  <span className="font-medium">
                    {chapters.filter(c => c.status === 'publicado').length}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Nota</span>
                  <span className="font-medium">
                    {averageRating > 0 ? `${averageRating.toFixed(1)}/5.0` : 'N/A'}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Comentários</span>
                  <span className="font-medium">{comments.length}</span>
                </div>
              </div>
            </div>

            {story.genres?.length > 0 && (
              <div className="rounded-2xl border border-border/30 bg-card/50 p-5">
                <h3 className="font-heading font-bold text-sm uppercase tracking-wider mb-3">
                  Gêneros
                </h3>

                <div className="flex flex-wrap gap-2">
                  {story.genres.map((g, i) => (
                    <span
                      key={i}
                      className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full border border-primary/20"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}