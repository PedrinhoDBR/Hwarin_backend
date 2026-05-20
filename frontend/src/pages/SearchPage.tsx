import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

import PageHeader from '../components/PageHeader';
import StoryCard from '../components/home/StoryCard';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

import { authFetch } from '../services/api';
import type { Story } from './Home';

const STATUS_FILTERS = [
  { value: 'em_andamento', label: 'Em andamento' },
  { value: 'concluida', label: 'Concluida' },
  { value: 'pausada', label: 'Pausada' },
];

const LANGUAGE_FILTERS = [
  'Portugues',
  'English',
  'Espanol',
];

const GENRE_FILTERS = [
  'Fantasia', 'Romance', 'Ficcao Cientifica', 'Terror', 'Aventura',
  'Drama', 'Misterio', 'Comedia', 'Acao', 'Suspense',
  'Fanfic', 'Slice of Life', 'Sobrenatural', 'Historico', 'Outro',
];

type SearchFilters = {
  query: string;
  status: string;
  language: string;
  genre: string;
  tag: string;
};

async function getStories({
  query,
  status,
  language,
  genre,
  tag,
}: SearchFilters): Promise<Story[]> {
  const params = new URLSearchParams();

  if (query) params.set('q', query);
  if (status) params.set('status', status);
  if (language) params.set('language', language);
  if (genre) params.set('genre', genre);
  if (tag) params.set('tag', tag);

  const queryString = params.toString();
  const endpoint = queryString
    ? `/api/stories?${queryString}`
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
  const [status, setStatus] = useState(
    searchParams.get('status') ?? ''
  );
  const [language, setLanguage] = useState(
    searchParams.get('language') ?? ''
  );
  const [genre, setGenre] = useState(
    searchParams.get('genre') ?? ''
  );
  const [tag, setTag] = useState(
    searchParams.get('tag') ?? ''
  );
  const normalizedQuery = query.trim();
  const normalizedTag = tag.trim();
  const filters: SearchFilters = {
    query: normalizedQuery,
    status,
    language,
    genre,
    tag: normalizedTag,
  };
  const hasFilters =
    Boolean(status) ||
    Boolean(language) ||
    Boolean(genre) ||
    Boolean(normalizedTag);

  const {
    data: stories = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['stories-search', filters],
    queryFn: () => getStories(filters),
  });

  function updateUrl(
    nextFilters: SearchFilters
  ) {
    const params = new URLSearchParams();

    if (nextFilters.query) {
      params.set('q', nextFilters.query);
    }

    if (nextFilters.status) {
      params.set('status', nextFilters.status);
    }

    if (nextFilters.language) {
      params.set('language', nextFilters.language);
    }

    if (nextFilters.genre) {
      params.set('genre', nextFilters.genre);
    }

    if (nextFilters.tag) {
      params.set('tag', nextFilters.tag);
    }

    setSearchParams(params);
  }

  function handleSearch(value: string) {
    const nextQuery = value.trim();

    setQuery(value);
    updateUrl({
      ...filters,
      query: nextQuery,
    });
  }

  function handleFilterChange(
    field: keyof Omit<SearchFilters, 'query'>,
    value: string
  ) {
    const nextValue =
      value === 'all' ? '' : value;
    const nextFilters = {
      ...filters,
      [field]:
        field === 'tag'
          ? nextValue.trim()
          : nextValue,
    };

    if (field === 'status') setStatus(nextValue);
    if (field === 'language') setLanguage(nextValue);
    if (field === 'genre') setGenre(nextValue);
    if (field === 'tag') setTag(nextValue);

    updateUrl(nextFilters);
  }

  function clearFilters() {
    setStatus('');
    setLanguage('');
    setGenre('');
    setTag('');

    updateUrl({
      query: normalizedQuery,
      status: '',
      language: '',
      genre: '',
      tag: '',
    });
  }

  return (
    <div className="min-h-screen">
      <PageHeader
        title="Buscar"
        onSearch={handleSearch}
        searchValue={query}
      />

      <div className="p-6">
        <div className="mb-5 border-b border-white/10 pb-5">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-foreground">
              <SlidersHorizontal className="h-4 w-4 text-primary" />
              Filtros
            </div>

            {hasFilters && (
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={clearFilters}
                className="gap-2 text-xs"
              >
                <X className="h-3.5 w-3.5" />
                Limpar
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Select
              value={status || 'all'}
              onValueChange={(value) =>
                handleFilterChange('status', value)
              }
            >
              <SelectTrigger className="bg-secondary/30 border-border/30">
                <SelectValue placeholder="Status" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                {STATUS_FILTERS.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={option.value}
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={language || 'all'}
              onValueChange={(value) =>
                handleFilterChange('language', value)
              }
            >
              <SelectTrigger className="bg-secondary/30 border-border/30">
                <SelectValue placeholder="Idioma" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">Todos os idiomas</SelectItem>
                {LANGUAGE_FILTERS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={genre || 'all'}
              onValueChange={(value) =>
                handleFilterChange('genre', value)
              }
            >
              <SelectTrigger className="bg-secondary/30 border-border/30">
                <SelectValue placeholder="Genero" />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="all">Todos os generos</SelectItem>
                {GENRE_FILTERS.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              value={tag}
              onChange={(event) =>
                handleFilterChange('tag', event.target.value)
              }
              placeholder="Filtrar por tag"
              className="bg-secondary/30 border-border/30"
            />
          </div>
        </div>

        {(normalizedQuery || hasFilters) && (
          <p className="mb-4 text-sm text-muted-foreground">
            {stories.length} historia(s) encontrada(s)
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
