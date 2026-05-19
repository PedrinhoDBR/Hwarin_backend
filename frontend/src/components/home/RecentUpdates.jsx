import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Play } from 'lucide-react';

export default function RecentUpdates({ stories }) {
  const recent = stories.slice(0, 3);

  return (
    <div className="h-full rounded-2xl border border-border/30 bg-card/50 p-5">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wider font-heading">
        Atualizacoes recentes
      </h2>

      {recent.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          Nenhuma atualizacao ainda.
        </p>
      ) : (
        <div className="space-y-3">
          {recent.map((story) => {
            const cover = story.cover || story.cover_url;

            return (
              <Link
                key={story.id}
                to={`/historia/${story.id}`}
                className="group flex items-center gap-3"
              >
                <div className="h-16 w-12 flex-shrink-0 overflow-hidden rounded-lg border border-border/20">
                  {cover ? (
                    <img
                      src={cover}
                      alt={story.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/30 to-accent/30">
                      <BookOpen className="h-4 w-4 text-foreground/70" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium transition-colors group-hover:text-primary">
                    {story.title}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Continue lendo
                  </p>
                </div>

                <Play className="h-3 w-3 flex-shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
