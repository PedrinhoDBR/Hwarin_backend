import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Play } from 'lucide-react';

export default function StoryCard({ story, size = 'medium' }) {
  const cover = story.cover || story.cover_url;
  const sizeClasses = {
    small: 'w-28 h-40',
    medium: 'w-36 h-52',
    large: 'w-44 h-64',
  };

  return (
    <Link to={`/historia/${story.id}`} className="group flex-shrink-0">
      <div className={`${sizeClasses[size]} relative overflow-hidden rounded-xl border border-border/30 transition-all duration-300 group-hover:scale-105 group-hover:border-primary/50 group-hover:shadow-lg group-hover:shadow-primary/10`}>
        {cover ? (
          <img
            src={cover}
            alt={story.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/30 to-accent/30">
            <BookOpen className="h-7 w-7 text-foreground/70" />
          </div>
        )}

        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/80 via-transparent to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
          <div className="flex items-center gap-2">
            <Play className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-white">Ler</span>
          </div>
        </div>
      </div>

      <p className="mt-2 max-w-36 truncate text-xs font-medium text-foreground/80">
        {story.title}
      </p>
    </Link>
  );
}
