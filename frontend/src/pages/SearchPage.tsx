import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';

import PageHeader from '../components/PageHeader';
import StoryCard from '../components/home/StoryCard';

import { authFetch } from '../services/api';

async function getStories() {
  const res = await authFetch('/api/stories');

  if (!res.ok) {
    throw new Error('Erro ao buscar histórias');
  }

  return res.json();
}

export default function SearchPage() {
  const urlParams = new URLSearchParams(window.location.search);

  const [query, setQuery] = useState(
    urlParams.get('q') || ''
  );

  const {
    data: stories = [],
    isLoading,
  } = useQuery({
    queryKey: ['all-stories'],
    queryFn: getStories,
  });

  const filtered = query.trim()
    ? stories.filter((s: any) =>
        s.title
          ?.toLowerCase()
          .includes(query.toLowerCase()) ||

        s.synopsis
          ?.toLowerCase()
          .includes(query.toLowerCase()) ||

        s.tags?.some((t: string) =>
          t
            .toLowerCase()
            .includes(query.toLowerCase())
        ) ||

        s.genres?.some((g: string) =>
          g
            .toLowerCase()
            .includes(query.toLowerCase())
        )
      )
    : stories;

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Buscar"
        onSearch={setQuery}
      />

      <div className="p-6">
        {query && (
          <p className="text-sm text-muted-foreground mb-4">
            {filtered.length} resultado(s)
            para "{query}"
          </p>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="aspect-[2/3] rounded-2xl bg-card/50 border border-border/30 animate-pulse"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Search className="w-10 h-10 mb-3 opacity-30" />

            <p className="text-sm">
              Nenhuma história encontrada.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {filtered.map((story: any) => (
              <StoryCard
                key={story.id}
                story={story}
                size="large"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}