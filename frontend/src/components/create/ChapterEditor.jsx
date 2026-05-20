import React, { useEffect, useState } from 'react';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { Check, Loader2, Plus, Trash2 } from 'lucide-react';
import ReactQuill from 'react-quill-new';

import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { authFetch } from '../../services/api';

export default function ChapterEditor({ storyId, onDone }) {
  const queryClient = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [chapterNumber, setChapterNumber] = useState(1);

  const { data: chapters = [] } = useQuery({
    queryKey: ['edit-chapters', storyId],
    queryFn: async () => {
      const response = await authFetch(`/api/chapters/story/${storyId}`);

      if (!response.ok) {
        throw new Error('Erro ao buscar capitulos');
      }

      return response.json();
    },
  });

  const sorted = [...chapters].sort(
    (a, b) => a.chapter_number - b.chapter_number
  );

  useEffect(() => {
    if (!editing) {
      setChapterNumber(sorted.length + 1);
    }
  }, [editing, sorted.length]);

  const createChapter = useMutation({
    mutationFn: async (data) => {
      const response = await authFetch('/api/chapters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || 'Erro ao criar capitulo');
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['edit-chapters', storyId],
      });
      resetForm();
    },
  });

  const updateChapter = useMutation({
    mutationFn: async ({ id, data }) => {
      const response = await authFetch(`/api/chapters/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.detail || 'Erro ao atualizar capitulo');
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['edit-chapters', storyId],
      });
      resetForm();
    },
  });

  const deleteChapter = useMutation({
    mutationFn: async (id) => {
      const response = await authFetch(`/api/chapters/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar capitulo');
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['edit-chapters', storyId],
      });
    },
  });

  function resetForm() {
    setEditing(null);
    setTitle('');
    setSubtitle('');
    setContent('');
    setChapterNumber(sorted.length + 1);
  }

  function handleSave() {
    if (!title.trim() || !content.trim()) return;

    const data = {
      story_id: storyId,
      title,
      text: content,
      subtitle,
      chapter_number: chapterNumber,
      status: 'publicado',
    };

    if (editing) {
      updateChapter.mutate({
        id: editing.id,
        data,
      });
      return;
    }

    createChapter.mutate(data);
  }

  function handleEdit(chapter) {
    setEditing(chapter);
    setTitle(chapter.title);
    setSubtitle(chapter.subtitle || '');
    setContent(chapter.text);
    setChapterNumber(chapter.chapter_number);
  }

  const isPending = createChapter.isPending || updateChapter.isPending;
  const canSave = title.trim() && content.trim() && !isPending;

  return (
    <div className="grid gap-5 lg:grid-cols-[320px_1fr]">
      <aside className="rounded-xl border border-border/30 bg-card/50 p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wide">
              Capitulos
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              {sorted.length} cadastrado(s)
            </p>
          </div>

          <Button
            type="button"
            size="icon"
            variant="outline"
            onClick={resetForm}
            title="Novo capitulo"
            className="h-9 w-9 rounded-full"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {sorted.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/40 p-5 text-sm text-muted-foreground">
            Nenhum capitulo ainda. Preencha o formulario ao lado e salve para
            montar a lista.
          </div>
        ) : (
          <div className="space-y-2">
            {sorted.map((chapter) => (
              <button
                key={chapter.id}
                type="button"
                onClick={() => handleEdit(chapter)}
                className={`w-full rounded-xl border p-3 text-left transition-colors ${
                  editing?.id === chapter.id
                    ? 'border-primary/50 bg-primary/10'
                    : 'border-border/30 bg-secondary/20 hover:bg-secondary/30'
                }`}
              >
                <span className="text-xs text-muted-foreground">
                  Capitulo {chapter.chapter_number}
                </span>
                <span className="mt-1 block truncate text-sm font-medium">
                  {chapter.title}
                </span>
                {chapter.subtitle && (
                  <span className="mt-1 block truncate text-xs text-muted-foreground">
                    {chapter.subtitle}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </aside>

      <div className="space-y-4 rounded-xl border border-border/30 bg-card/50 p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wide">
              {editing
                ? `Editar capitulo ${editing.chapter_number}`
                : 'Novo capitulo'}
            </h3>
            <p className="mt-1 text-xs text-muted-foreground">
              Salvar adiciona o capitulo a esta historia imediatamente.
            </p>
          </div>

          {editing && (
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => deleteChapter.mutate(editing.id)}
              className="gap-2 text-destructive"
            >
              <Trash2 className="h-4 w-4" />
              Excluir
            </Button>
          )}
        </div>

        <div>
          <Label className="mb-2 block text-sm">Titulo do capitulo</Label>
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Ex: O comeco de tudo"
            className="border-border/30 bg-secondary/30"
          />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <Label className="mb-2 block text-sm">Subtitulo</Label>
            <Input
              value={subtitle}
              onChange={(event) => setSubtitle(event.target.value)}
              placeholder="Subtitulo do capitulo"
              className="border-border/30 bg-secondary/30"
            />
          </div>

          <div>
            <Label className="mb-2 block text-sm">Numero</Label>
            <Input
              type="number"
              min={1}
              value={chapterNumber}
              onChange={(event) => setChapterNumber(Number(event.target.value))}
              className="border-border/30 bg-secondary/30"
            />
          </div>
        </div>

        <div>
          <Label className="mb-2 block text-sm">Conteudo</Label>
          <div className="rounded-xl border border-border/30 bg-secondary/20">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              placeholder="Escreva o conteudo do capitulo..."
              className="chapter-editor"
            />
          </div>
        </div>

        {(createChapter.isError || updateChapter.isError || deleteChapter.isError) && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            Nao foi possivel salvar a alteracao do capitulo.
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            onClick={handleSave}
            disabled={!canSave}
            className="gap-2 rounded-xl bg-primary hover:bg-primary/80"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : editing ? (
              <Check className="h-4 w-4" />
            ) : (
              <Plus className="h-4 w-4" />
            )}
            {editing ? 'Salvar alteracoes' : 'Adicionar capitulo'}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
            className="rounded-xl"
          >
            Novo em branco
          </Button>

          <Button
            type="button"
            onClick={onDone}
            variant="outline"
            className="rounded-xl border-primary/30 text-primary"
          >
            Ver pagina da historia
          </Button>
        </div>
      </div>
    </div>
  );
}
