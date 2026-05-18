import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

export default function RecentUpdates({ stories }) {
  const recent = stories.slice(0, 3);

  return (
    <div className="rounded-2xl border border-border/30 bg-card/50 p-5 h-full">
      <h2 className="font-heading font-bold text-sm uppercase tracking-wider mb-4">
        Atualizações Recentes
      </h2>
      {recent.length === 0 ? (
        <p className="text-xs text-muted-foreground">Nenhuma atualização ainda.</p>
      ) : (
        <div className="space-y-3">
          {recent.map((story) => (
            <Link key={story.id} to={`/historia/${story.id}`} className="flex items-center gap-3 group">
              <div className="w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-border/20">
                {story.cover_url ? (
                  <img src={story.cover_url} alt={story.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center text-sm">📖</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate group-hover:text-primary transition-colors">{story.title}</p>
                <p className="text-xs text-muted-foreground">Continue lendo</p>
              </div>
              <Play className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}