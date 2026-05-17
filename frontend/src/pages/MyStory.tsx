import React, { useEffect, useState } from 'react';
import { useMutation, useQueryClient,useQuery, } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Plus, BookOpen, Edit, } from 'lucide-react';
import { authFetch } from '../services/api';
import { Trash2 } from 'lucide-react';


const statusLabels = {
  em_andamento: 'Em andamento',
  concluida: 'Concluída',
  pausada: 'Pausada',
  cancelada: 'Cancelada',
};

const statusColors = {
  em_andamento: 'bg-primary/10 text-primary border-primary/20',
  concluida: 'bg-green-500/10 text-green-400 border-green-500/20',
  pausada: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  cancelada: 'bg-destructive/10 text-destructive border-destructive/20',
};



export default function MyStories() {

const queryClient = useQueryClient();

const deleteStory = useMutation({
  mutationFn: async (id) => {
    const res = await authFetch(`/api/stories/${id}`, {
      method: 'DELETE',
    });

    if (!res.ok) {
      throw new Error('Erro ao deletar história');
    }

    return true;
  },

  onSuccess: () => {
    queryClient.invalidateQueries({
    queryKey: ['my-stories']
  })
  },
});

  const { data: stories = [], isLoading } = useQuery({
    queryKey: ['my-stories'],
    queryFn: async () => {
      const res = await authFetch('/api/stories/me');
      if (!res.ok) throw new Error('Erro ao buscar histórias');
      return res.json();
    },
  });

  const { data: allChapters = [] } = useQuery({
    queryKey: ['my-chapters', stories],
    enabled: stories.length > 0,
    queryFn: async () => {
      const results = await Promise.all(
        stories.map(async (s) => {
          const res = await authFetch(`/api/chapters/story/${s.id}`);
          if (!res.ok) return [];
          return res.json();
        })
      );
      return results.flat();
    },
  });

  const chaptersCountByStory = allChapters.reduce((acc, ch) => {
    acc[ch.story_id] = (acc[ch.story_id] || 0) + 1;
    return acc;
  }, {});

  return (
    <section className="p-6 text-foreground justify-center overflow-x-hidden">
        
      <div className="p-6 rounded-3xl border border-white/20 bg-black/60">

        {/* HEADER */}
        <div className="flex items-center justify-between">
          <Link to="/story/new">
            <Button className="bg-primary hover:bg-primary/80 rounded-full text-sm gap-2">
              <Plus className="w-4 h-4" />
              Nova história
            </Button>
          </Link>
        </div>

        {/* LOADING */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-28 rounded-2xl border border-border/30 bg-card/50 animate-pulse" />
            ))}
          </div>
        ) : stories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <BookOpen className="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground font-medium">
              Você ainda não criou nenhuma história
            </p>
          </div>
        ) : (

          <div className="space-y-3">

            {stories.map((story) => (
              <div
                key={story.id}
                className="flex items-center gap-4 p-4 rounded-2xl border border-border/30 bg-card/50"
              >

                {/* COVER */}
                <div className="w-16 h-22 rounded-xl overflow-hidden flex-shrink-0">
                  {story.cover ? (
                    <img src={story.cover} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/30 to-accent/30 flex items-center justify-center">
                      📖
                    </div>
                  )}
                </div>

                {/* INFO */}
                <div className="flex-1">
                  <h3 className="font-bold">{story.title}</h3>

                  {story.subtitle && (
                    <p className="text-xs text-muted-foreground">
                      {story.subtitle}
                    </p>
                  )}

                  <div className="flex gap-2 mt-2 flex-wrap">

                    <Badge className={statusColors[story.status]}>
                      {statusLabels[story.status]}
                    </Badge>

                    <span className="text-xs text-muted-foreground">
                      {chaptersCountByStory[story.id] || 0} capítulos
                    </span>

                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2">

                  <Link to={`/story/${story.id}`}>
                    <Button size="icon" variant="ghost">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </Link>

                    <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => {
                        const confirmDelete = window.confirm(
                        '⚠️ Essa ação é irreversível. Deseja realmente deletar esta história?'
                        );

                        if (confirmDelete) {
                        deleteStory.mutate(story.id);
                        }
                    }}
                    >
                    <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>

                </div>

              </div>
            ))}

          </div>
        )}
      </div>
    </section>
  );
}