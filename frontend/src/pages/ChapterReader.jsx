import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ChevronLeft, Star, Download, Share2, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { authFetch } from '../services/api';

export default function ChapterReader() {
  const pathParts = window.location.pathname.split('/');
  const storyId = pathParts[2];
  const chapterId = pathParts[4];

  const { data: chapter, isLoading } = useQuery({
    queryKey: ['chapter', chapterId],
    enabled: !!chapterId,
    queryFn: async () => {
      const res = await authFetch(`/api/chapters/${chapterId}`);
      if (!res.ok) throw new Error();
      return res.json();
    },
  });

  const { data: story } = useQuery({
    queryKey: ['story-for-chapter', storyId],
    enabled: !!storyId,
    queryFn: async () => {
      const res = await authFetch(`/api/stories/${storyId}`);
      if (!res.ok) throw new Error();
      return res.json();
    },
  });

  const { data: allChapters = [] } = useQuery({
    queryKey: ['all-chapters', storyId],
    enabled: !!storyId,
    queryFn: async () => {
      const res = await authFetch(`/api/chapters/story/${storyId}`)
      if (!res.ok) throw new Error();
      return res.json();
    },
  });

  const publishedChapters = allChapters
    .filter(c => c.status === 'publicado')
    .sort((a, b) => a.chapter_number - b.chapter_number);

  const currentIndex = publishedChapters.findIndex(c => String(c.id) === String(chapterId));

  const prevChapter =
    currentIndex > 0 ? publishedChapters[currentIndex - 1] : null;

  const nextChapter =
    currentIndex < publishedChapters.length - 1
      ? publishedChapters[currentIndex + 1]
      : null;

    function decodeHtml(html) {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
    }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Capítulo não encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/50">
        <Link
          to={`/historia/${storyId}`}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="text-sm">Voltar</span>
        </Link>

        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" className="w-8 h-8">
            <Star className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost" className="w-8 h-8">
            <Download className="w-4 h-4" />
          </Button>
          <Button size="icon" variant="ghost" className="w-8 h-8">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* Chapter header */}
        <div className="mb-8">
          <p className="text-xs text-primary font-heading uppercase tracking-widest mb-2">
            Capítulo {chapter.chapter_number}
          </p>

          <h1 className="text-2xl font-heading font-bold">
            {chapter.title}
          </h1>

          {story && (
            <p className="text-sm text-muted-foreground mt-1">
              de {story.title}
            </p>
          )}
        </div>

        {/* Chapter content */}
        <div
        className="prose prose-invert prose-sm max-w-none text-foreground/85 leading-relaxed"
        dangerouslySetInnerHTML={{
            __html: decodeHtml(chapter.text || chapter.content),
        }}
        />

        {/* Navigation */}
        <div className="flex items-center justify-between mt-12 pt-6 border-t border-border/30">
          
          {prevChapter ? (
            <Link
              to={`/historia/${storyId}/capitulo/${prevChapter.id}`}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              ← Cap. {prevChapter.chapter_number}: {prevChapter.title}
            </Link>
          ) : <div />}

          {nextChapter ? (
            <Link
              to={`/historia/${storyId}/capitulo/${nextChapter.id}`}
              className="text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Cap. {nextChapter.chapter_number}: {nextChapter.title} →
            </Link>
          ) : <div />}

        </div>
      </div>
    </div>
  );
}