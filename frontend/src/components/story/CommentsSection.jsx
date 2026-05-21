import React, { useEffect, useMemo, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { MessageSquare, Send, Star } from 'lucide-react';

import { Avatar, AvatarFallback } from '../ui/avatar';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { authFetch } from '../../services/api';

function RatingStars({ value, onChange, disabled = false, size = 'md' }) {
  const iconSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-5 w-5';

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const active = star <= value;

        return (
          <button
            key={star}
            type="button"
            disabled={disabled || !onChange}
            onClick={() => onChange?.(star)}
            title={`${star} estrela${star > 1 ? 's' : ''}`}
            className="rounded-sm text-yellow-500 transition-transform enabled:hover:scale-110 disabled:cursor-default"
          >
            <Star
              className={`${iconSize} ${active ? 'fill-yellow-500' : 'fill-transparent text-muted-foreground'}`}
            />
          </button>
        );
      })}
    </div>
  );
}

export default function CommentsSection({
  comments = [],
  ratings = [],
  storyId,
  user,
}) {
  const queryClient = useQueryClient();
  const existingRating = useMemo(
    () => ratings.find((rating) => rating.user_id === user?.id),
    [ratings, user?.id]
  );
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (!existingRating) return;

    setRating(existingRating.value || 0);
  }, [existingRating]);

  const saveRating = useMutation({
    mutationFn: async () => {
      const response = await authFetch('/api/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          story_id: Number(storyId),
          value: rating,
          description: content.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Erro ao salvar comentario');
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', storyId] });
      queryClient.invalidateQueries({ queryKey: ['ratings', storyId] });
      setContent('');
    },
  });

  function handleSubmit() {
    if (!user || !content.trim() || rating < 1) return;

    saveRating.mutate();
  }

  return (
    <div className="rounded-xl border border-border/30 bg-card/50 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-4 w-4 text-primary" />
          <h2 className="font-heading text-sm font-bold uppercase tracking-wider">
            Comentarios
          </h2>
        </div>

        {existingRating && (
          <span className="text-xs text-muted-foreground">
            Sua nota: {existingRating.value}/5
          </span>
        )}
      </div>

      <div className="mb-5 space-y-3 rounded-xl border border-border/20 bg-secondary/10 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-sm font-medium text-foreground">
            Avalie esta historia
          </span>
          <RatingStars
            value={rating}
            onChange={setRating}
            disabled={saveRating.isPending || !user}
          />
        </div>

        <div className="flex gap-3">
          <Textarea
            placeholder={
              user
                ? 'Escreva um comentario...'
                : 'Entre na sua conta para comentar.'
            }
            value={content}
            onChange={(event) => setContent(event.target.value)}
            disabled={!user || saveRating.isPending}
            className="h-24 resize-none border-border/30 bg-secondary/30 text-sm"
          />

          <Button
            size="icon"
            onClick={handleSubmit}
            disabled={!content.trim() || rating < 1 || saveRating.isPending}
            className="h-10 w-10 flex-shrink-0 rounded-xl bg-primary/20 text-primary hover:bg-primary/30"
            title="Enviar comentario"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>

        {rating < 1 && (
          <p className="text-xs text-muted-foreground">
            Escolha de 1 a 5 estrelas para enviar seu comentario.
          </p>
        )}

        {saveRating.isError && (
          <p className="text-xs text-destructive">
            Nao foi possivel salvar seu comentario agora.
          </p>
        )}
      </div>

      <div className="space-y-3">
        {comments.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            Nenhum comentario ainda. Seja o primeiro!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id || `${comment.story_id}-${comment.user_id}`}
              className="flex gap-3 rounded-xl bg-secondary/20 p-3"
            >
              <Avatar className="h-8 w-8 flex-shrink-0">
                {comment.author_avatar ? (
                  <img
                    src={comment.author_avatar}
                    alt={comment.author_name || 'Usuario'}
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <AvatarFallback className="bg-primary/20 text-xs text-primary">
                    {(comment.author_name || 'A')[0].toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-medium">
                    {comment.author_name || 'Anonimo'}
                  </span>
                  <RatingStars value={comment.value || 0} size="sm" disabled />
                </div>

                <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                  {comment.content || comment.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
