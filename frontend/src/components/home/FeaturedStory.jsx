import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Play } from 'lucide-react';
import { Button } from '../ui/button';

export default function FeaturedStory({ story }) {
  if (!story) {
    return (
      <div className="flex h-full min-h-52 items-center justify-center rounded-2xl border border-border/30 bg-card/50 p-5 text-sm text-muted-foreground">
        Nenhuma historia publicada ainda.
      </div>
    );
  }

  const cover = story.cover || story.cover_url;

  return (
    <Link to={`/historia/${story.id}`} className="group block">
      <div className="relative flex items-center gap-5 overflow-hidden rounded-2xl border border-border/30 bg-card/50 p-5 transition-all hover:border-primary/40">
        <div className="h-44 w-32 flex-shrink-0 overflow-hidden rounded-xl border border-border/20 shadow-xl shadow-primary/5">
          {cover ? (
            <img
              src={cover}
              alt={story.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/40 to-accent/40">
              <BookOpen className="h-9 w-9 text-foreground/70" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="mb-1 text-sm font-bold uppercase tracking-wide text-foreground/60 font-heading">
            Destaque
          </h3>
          <p className="truncate text-lg font-bold text-foreground font-heading">
            {story.title}
          </p>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {story.synopsis || 'Continue lendo'}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <Play className="h-3 w-3 text-primary" />
            <Button
              size="sm"
              className="h-7 rounded-full border border-primary/30 bg-primary/20 px-4 text-xs text-primary hover:bg-primary/30"
            >
              Ler mais
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
