import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { BookOpen, Edit, Plus, Trash2 } from 'lucide-react';

import { PageHeader } from '../components';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { authFetch } from '../services/api';
import type { Story } from './Home';

const statusLabels: Record<string, string> = {
  em_elaboracao: 'Em elaboracao',
  em_andamento: 'Em andamento',
  concluida: 'Concluida',
  pausada: 'Pausada',
  cancelada: 'Cancelada',
};

const statusColors: Record<string, string> = {
  em_elaboracao: 'border-border/40 bg-secondary/40 text-muted-foreground',
  em_andamento: 'border-primary/20 bg-primary/10 text-primary',
  concluida: 'border-green-500/20 bg-green-500/10 text-green-400',
  pausada: 'border-yellow-500/20 bg-yellow-500/10 text-yellow-400',
  cancelada: 'border-destructive/20 bg-destructive/10 text-destructive',
};

type Chapter = {
  id: number;
  story_id: number;
};

export default function MyStories() {
  const queryClient = useQueryClient();

  const deleteStory = useMutation({
    mutationFn: async (id: number) => {
      const res = await authFetch(`/api/stories/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        throw new Error('Erro ao deletar historia');
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-stories'] });
      queryClient.invalidateQueries({ queryKey: ['stories'] });
      queryClient.invalidateQueries({ queryKey: ['stories-search'] });
      queryClient.invalidateQueries({ queryKey: ['stories-library-following'] });
    },
  });

  const { data: stories = [], isLoading } = useQuery<Story[]>({
    queryKey: ['my-stories'],
    queryFn: async () => {
      const res = await authFetch('/api/stories/me');
      if (!res.ok) throw new Error('Erro ao buscar historias');
      return res.json();
    },
  });

  const { data: allChapters = [] } = useQuery<Chapter[]>({
    queryKey: ['my-chapters', stories.map((story) => story.id)],
    enabled: stories.length > 0,
    queryFn: async () => {
      const results = await Promise.all(
        stories.map(async (story) => {
          const res = await authFetch(`/api/chapters/story/${story.id}`);
          if (!res.ok) return [];
          return res.json();
        })
      );

      return results.flat();
    },
  });

  const chaptersCountByStory = allChapters.reduce<Record<number, number>>(
    (acc, chapter) => {
      acc[chapter.story_id] = (acc[chapter.story_id] || 0) + 1;
      return acc;
    },
    {}
  );

  return (
    <div className="min-h-screen">
      <PageHeader title="Minhas historias" />

      <section className="p-6 text-foreground">
        <div className="rounded-xl border border-border/30 bg-card/50 p-6">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Seu estante de criacao</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Historias em elaboracao ficam visiveis apenas aqui.
              </p>
            </div>

            <Link to="/story/new">
              <Button className="gap-2 rounded-full bg-primary text-sm hover:bg-primary/80">
                <Plus className="h-4 w-4" />
                Nova historia
              </Button>
            </Link>
          </div>

          {deleteStory.isError && (
            <div className="mb-4 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              Nao foi possivel deletar a historia.
            </div>
          )}

          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-28 animate-pulse rounded-xl border border-border/30 bg-card/50"
                />
              ))}
            </div>
          ) : stories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <BookOpen className="mb-4 h-12 w-12 text-muted-foreground/30" />
              <p className="font-medium text-muted-foreground">
                Voce ainda nao criou nenhuma historia.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {stories.map((story) => (
                <div
                  key={story.id}
                  className="flex items-center gap-4 rounded-xl border border-border/30 bg-secondary/20 p-4"
                >
                  <div className="h-24 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-border/30 bg-secondary/30">
                    {story.cover ? (
                      <img
                        src={story.cover}
                        alt={story.title ?? 'Historia'}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <BookOpen className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-bold">{story.title}</h3>

                    {story.subtitle && (
                      <p className="truncate text-xs text-muted-foreground">
                        {story.subtitle}
                      </p>
                    )}

                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <Badge className={statusColors[story.status ?? '']}>
                        {statusLabels[story.status ?? ''] ?? story.status}
                      </Badge>

                      <span className="text-xs text-muted-foreground">
                        {chaptersCountByStory[story.id] || 0} capitulo(s)
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Link to={`/story/${story.id}`}>
                      <Button size="icon" variant="ghost" title="Editar">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>

                    <Button
                      size="icon"
                      variant="ghost"
                      title="Deletar"
                      disabled={deleteStory.isPending}
                      onClick={() => {
                        const confirmDelete = window.confirm(
                          'Essa acao e irreversivel. Deseja deletar esta historia?'
                        );

                        if (confirmDelete) {
                          deleteStory.mutate(story.id);
                        }
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
