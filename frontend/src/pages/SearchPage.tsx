import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

import PageHeader from '../components/PageHeader';
import StoryCard from '../components/home/StoryCard';

import { authFetch } from '../services/api';
import type { Story } from './Home';

async function getStories(
  query: string
): Promise<Story[]> {
  const endpoint = query
    ? `/api/stories?q=${encodeURIComponent(query)}`
    : '/api/stories';

  const response = await authFetch(endpoint);

  if (!response.ok) {
    throw new Error('Erro ao buscar historias');
  }

  return response.json();
}

export default function SearchPage() {
  const [searchParams, setSearchParams] =
    useSearchParams();
  const [query, setQuery] = useState(
    searchParams.get('q') ?? ''
  );
  const normalizedQuery = query.trim();

  const {
    data: stories = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['stories-search', normalizedQuery],
    queryFn: () => getStories(normalizedQuery),
  });

  function handleSearch(value: string) {
    setQuery(value);

    const nextQuery = value.trim();
    if (nextQuery) {
      setSearchParams({ q: nextQuery });
    } else {
      setSearchParams({});
    }
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Buscar"
        onSearch={handleSearch}
        searchValue={query}
      />

      <div className="p-6">
        {normalizedQuery && (
          <p className="mb-4 text-sm text-muted-foreground">
            {stories.length} resultado(s) para "{normalizedQuery}"
          </p>
        )}

        {isError && (
          <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            Nao foi possivel buscar historias agora.
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
            {Array.from({ length: 12 }, (_, index) => (
              <div
                key={index}
                className="aspect-[2/3] rounded-2xl border border-border/30 bg-card/50 animate-pulse"
              />
            ))}
          </div>
        ) : stories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Search className="mb-3 h-10 w-10 opacity-30" />

            <p className="text-sm">
              Nenhuma historia encontrada.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
            {stories.map((story) => (
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
