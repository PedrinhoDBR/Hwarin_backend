import React from 'react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Star, Heart, Bookmark } from 'lucide-react';

export default function StoryHeader({ story, averageRating, isFollowing, onFollow }) {
  const statusLabels = {
    em_andamento: 'Em andamento',
    concluida: 'Concluída',
    pausada: 'Pausada',
    cancelada: 'Cancelada',
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 rounded-2xl border border-border/30 bg-card/50">
      <div className="w-40 h-56 rounded-xl overflow-hidden flex-shrink-0 border border-border/20 shadow-xl shadow-primary/10">
        {story.cover ? (
          <img
            src={story.cover}
            alt={story.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
            <span className="text-4xl">📖</span>
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h1 className="text-2xl font-heading font-bold uppercase tracking-wide">{story.title}</h1>
        {story.subtitle && (
          <p className="text-sm text-muted-foreground mt-1">{story.subtitle}</p>
        )}
        <p className="text-sm text-foreground/80 mt-3 leading-relaxed line-clamp-4">
          {story.synopsis}
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          <span className="text-xs text-muted-foreground">
            Autor: <span className="text-foreground">{story.author_name || story.created_by}</span>
          </span>
          {story.tags?.length > 0 && (
            <span className="text-xs text-muted-foreground">
              • Tags: {story.tags.map((t, i) => (
                <span key={i} className="text-primary">{t}{i < story.tags.length - 1 ? ', ' : ''}</span>
              ))}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 mt-3">
          {story.genres?.map((g, i) => (
            <Badge key={i} variant="secondary" className="text-xs bg-primary/10 text-primary border-primary/20">
              {g}
            </Badge>
          ))}
          <Badge variant="outline" className="text-xs">
            {statusLabels[story.status] || story.status}
          </Badge>
        </div>

        <div className="flex items-center gap-3 mt-4">
          <Button
            size="sm"
            onClick={onFollow}
            className={`rounded-full text-xs gap-2 ${isFollowing ? 'bg-primary text-primary-foreground' : 'bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30'}`}
          >
            {isFollowing ? <Heart className="w-3 h-3 fill-current" /> : <Heart className="w-3 h-3" />}
            {isFollowing ? 'Seguindo' : 'Seguir'}
          </Button>
          <Button size="sm" variant="outline" className="rounded-full text-xs gap-2 border-border/50">
            <Bookmark className="w-3 h-3" />
            Salvar
          </Button>
          {averageRating > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span>{averageRating.toFixed(1)}/5.0</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}