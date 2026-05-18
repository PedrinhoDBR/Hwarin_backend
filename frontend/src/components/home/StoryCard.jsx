import React from 'react';
import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';

export default function StoryCard({ story, size = 'medium' }) {
  const sizeClasses = {
    small: 'w-28 h-40',
    medium: 'w-36 h-52',
    large: 'w-44 h-64',
  };

  return (
    <Link to={`/historia/${story.id}`} className="group flex-shrink-0">
      <div className={`${sizeClasses[size]} relative rounded-xl overflow-hidden border border-border/30 transition-all duration-300 group-hover:border-primary/50 group-hover:shadow-lg group-hover:shadow-primary/10 group-hover:scale-105`}>
        {story.cover_url ? (
          <img
            src={story.cover_url}
            alt={story.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
            <span className="text-2xl">📖</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
          <div className="flex items-center gap-2">
            <Play className="w-4 h-4 text-primary" />
            <span className="text-xs text-white font-medium">Ler</span>
          </div>
        </div>
      </div>
      <p className="mt-2 text-xs font-medium text-foreground/80 truncate max-w-[theme(width.36)]">
        {story.title}
      </p>
    </Link>
  );
}