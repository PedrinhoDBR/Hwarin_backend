import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, UserRound } from 'lucide-react';

import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

export default function StoryHeader({
  story,
  averageRating,
  isFollowing,
  onFollow,
}) {
  const statusLabels = {
    em_andamento: 'Em andamento',
    concluida: 'Concluida',
    pausada: 'Pausada',
    cancelada: 'Cancelada',
  };
  const author = story.author;

  return (
    <div className="flex flex-col gap-6 rounded-xl border border-border/30 bg-card/50 p-6 md:flex-row">
      <div className="h-56 w-40 flex-shrink-0 overflow-hidden rounded-xl border border-border/20 shadow-xl shadow-primary/10">
        {story.cover ? (
          <img
            src={story.cover}
            alt={story.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-secondary/40">
            <span className="text-sm text-muted-foreground">Sem capa</span>
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <h1 className="font-heading text-2xl font-bold uppercase tracking-wide">
          {story.title}
        </h1>

        {story.subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">
            {story.subtitle}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {author ? (
            <Link
              to={`/autor/${author.id}`}
              className="inline-flex items-center gap-2 rounded-full border border-border/40 bg-secondary/30 px-3 py-1 text-xs text-foreground transition-colors hover:border-primary/50 hover:text-primary"
            >
              {author.avatar_url ? (
                <img
                  src={author.avatar_url}
                  alt={author.username}
                  className="h-5 w-5 rounded-full object-cover"
                />
              ) : (
                <UserRound className="h-3.5 w-3.5" />
              )}
              {author.username}
            </Link>
          ) : (
            <span className="text-xs text-muted-foreground">
              Autor nao informado
            </span>
          )}

          {story.tags?.length > 0 && (
            <span className="text-xs text-muted-foreground">
              Tags:{' '}
              {story.tags.map((tag, index) => (
                <span key={tag} className="text-primary">
                  {tag}
                  {index < story.tags.length - 1 ? ', ' : ''}
                </span>
              ))}
            </span>
          )}
        </div>

        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-foreground/80">
          {story.synopsis || 'Sem sinopse cadastrada.'}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {story.genres?.map((genre) => (
            <Badge
              key={genre}
              variant="secondary"
              className="border-primary/20 bg-primary/10 text-xs text-primary"
            >
              {genre}
            </Badge>
          ))}

          {story.status && (
            <Badge variant="outline" className="text-xs">
              {statusLabels[story.status] || story.status}
            </Badge>
          )}
        </div>

        <div className="mt-5 flex items-center gap-3">
          <Button
            size="sm"
            onClick={onFollow}
            className={`gap-2 rounded-full text-xs ${
              isFollowing
                ? 'bg-primary text-primary-foreground'
                : 'border border-primary/30 bg-primary/20 text-primary hover:bg-primary/30'
            }`}
          >
            <Heart
              className={`h-3 w-3 ${isFollowing ? 'fill-current' : ''}`}
            />
            {isFollowing ? 'Seguindo historia' : 'Seguir historia'}
          </Button>

          {averageRating > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
              <span>{averageRating.toFixed(1)}/5.0</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
