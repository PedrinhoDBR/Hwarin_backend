import React from 'react';
import StoryCard from './StoryCard';

export default function LibrarySection({ stories }) {
  return (
    <div className="rounded-2xl border border-border/30 bg-card/50 p-5">
      <h2 className="font-heading font-bold text-sm uppercase tracking-wider mb-4">
        Biblioteca
      </h2>
      {stories.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhuma história publicada ainda. Seja o primeiro a criar!</p>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-2">
          {stories.map((story) => (
            <StoryCard key={story.id} story={story} size="medium" />
          ))}
        </div>
      )}
    </div>
  );
}