import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '../ui/badge';
import { ChevronRight } from 'lucide-react';

export default function ChapterList({ chapters, storyId }) {
  const published = chapters
    .filter(c => c.status === 'publicado')
    .sort((a, b) => a.chapter_number - b.chapter_number);

  return (
    <div className="rounded-2xl border border-border/30 bg-card/50 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-heading font-bold text-sm uppercase tracking-wider">Capítulos</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">capítulo {published.length}/{chapters.length}</span>
          <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
            {chapters.filter(c => c.status === 'publicado').length > 0 ? 'Publicado' : 'Rascunho'}
          </Badge>
        </div>
      </div>

      <div className="space-y-1">
        {published.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">Nenhum capítulo publicado ainda.</p>
        ) : (
          published.map((chapter) => (
            <Link
              key={chapter.id}
              to={`/historia/${storyId}/capitulo/${chapter.id}`}
              className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-secondary/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground font-mono w-8">
                  Cap {chapter.chapter_number}
                </span>
                <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors">
                  {chapter.title}
                </span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}