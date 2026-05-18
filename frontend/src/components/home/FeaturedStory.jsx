import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { Play } from 'lucide-react';

export default function FeaturedStory({ story }) {
  if (!story) return null;

  return (
    <Link to={`/historia/${story.id}`} className="block group">
      <div className="relative rounded-2xl overflow-hidden border border-border/30 bg-card/50 p-5 flex gap-5 items-center transition-all hover:border-primary/40">
        <div className="w-32 h-44 rounded-xl overflow-hidden flex-shrink-0 border border-border/20 shadow-xl shadow-primary/5">
          {story.cover_url ? (
            <img src={story.cover_url} alt={story.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/40 to-accent/40 flex items-center justify-center">
              <span className="text-4xl">📖</span>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-bold text-sm uppercase tracking-wide text-foreground/60 mb-1">
            Nome do Título
          </h3>
          <p className="text-lg font-heading font-bold text-foreground truncate">
            {story.title}
          </p>
          <p className="text-xs text-muted-foreground mt-1">Continue lendo</p>
          <div className="flex items-center gap-2 mt-3">
            <Play className="w-3 h-3 text-primary" />
            <Button size="sm" className="h-7 text-xs bg-primary/20 text-primary hover:bg-primary/30 border border-primary/30 rounded-full px-4">
              Ler mais
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}