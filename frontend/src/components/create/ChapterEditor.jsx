import React, { useState } from 'react';
import {useQuery,useMutation,useQueryClient,} from '@tanstack/react-query';

import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

import {Plus,Check,Loader2,Trash2,} from 'lucide-react';

import ReactQuill from 'react-quill-new';

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
      const response = await authFetch(
        `/api/chapters/story/${storyId}`
      );

      if (!response.ok) {
        throw new Error('Erro ao buscar capítulos');
      }

      return response.json();
    },
  });

  const sorted = [...chapters].sort(
    (a, b) => a.chapter_number - b.chapter_number
  );

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
        throw new Error(result.detail || 'Erro ao criar capítulo');
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
        throw new Error(result.detail || 'Erro ao atualizar capítulo');
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
        throw new Error('Erro ao deletar capítulo');
      }

      return true;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['edit-chapters', storyId],
      });
    },
  });

  const resetForm = () => {
    setEditing(null);

    setTitle('');
    setSubtitle('');
    setContent('');

    setChapterNumber(
      sorted.length + 1
    );
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      return;
    }

    if (editing) {
      updateChapter.mutate({
        id: editing.id,

        data: {
          title,
          text: content,
          subtitle: subtitle,
          chapter_number: chapterNumber,
          status: 'publicado',
        },
      });
    } else {
      createChapter.mutate({
        story_id: storyId,
        title,
        text: content,
        subtitle: subtitle,
        chapter_number: chapterNumber,
        status: 'publicado',
      });
    }
  };

  const handleEdit = (chapter) => {
    setEditing(chapter);
    setTitle(chapter.title);
    setSubtitle(chapter.subtitle);
    setContent(chapter.text);
    setChapterNumber(chapter.chapter_number);
  };

  const isPending =
    createChapter.isPending || updateChapter.isPending;

  return (
    <div className="space-y-6">

      {sorted.length > 0 && (
        <div className="rounded-2xl border border-border/30 bg-card/50 p-5">
          <h3 className="font-heading font-bold text-sm uppercase tracking-wider mb-3">
            Capítulos ({sorted.length})
          </h3>

          <div className="space-y-2">
            {sorted.map((ch) => (
              <div
                key={ch.id}
                className="flex items-center justify-between p-3 rounded-xl bg-secondary/20 hover:bg-secondary/30 transition-colors"
              >
                <div>
                  <span className="text-xs text-muted-foreground mr-2">
                    Cap {ch.chapter_number}
                  </span>

                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {ch.title}
                    </span>

                    {ch.subtitle && (
                      <span className="text-xs text-muted-foreground">
                        {ch.subtitle}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(ch)}
                    className="text-xs h-7"
                  >
                    Editar
                  </Button>

                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() =>
                      deleteChapter.mutate(ch.id)
                    }
                    className="h-7 w-7 text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Editor */}
      <div className="rounded-2xl border border-border/30 bg-card/50 p-6 space-y-4">
        <h3 className="font-heading font-bold text-sm uppercase tracking-wider">
          {editing
            ? `Editar Capítulo ${editing.chapter_number}`
            : 'Novo Capítulo'}
        </h3>

        <div>
          <Label className="text-sm mb-2 block">
            Título do Capítulo
          </Label>

          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex: O começo de tudo"
            className="bg-secondary/30 border-border/30"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <div>
            <Label className="text-sm mb-2 block">
              Subtítulo
            </Label>

            <Input
              value={subtitle || ''}
              onChange={(e) =>
                setSubtitle(e.target.value)
              }
              placeholder="Subtítulo do capítulo"
              className="bg-secondary/30 border-border/30"
            />
          </div>

          <div>
            <Label className="text-sm mb-2 block">
              Número do capítulo
            </Label>

            <Input
              type="number"
              min={1}
              value={chapterNumber}
              onChange={(e) =>
                setChapterNumber(
                  Number(e.target.value)
                )
              }
              className="bg-secondary/30 border-border/30"
            />
          </div>

        </div>

        <div>
          <Label className="text-sm mb-2 block">
            Conteúdo
          </Label>

          <div className="bg-secondary/20 rounded-xl border border-border/30">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              placeholder="Escreva o conteúdo do capítulo..."
              className="chapter-editor"
            />
          </div>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleSave}
            disabled={
              !title.trim() ||
              !content.trim() ||
              isPending
            }
            className="bg-primary hover:bg-primary/80 rounded-xl gap-2"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : editing ? (
              <Check className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}

            {editing
              ? 'Salvar'
              : 'Adicionar Capítulo'}
          </Button>

          {editing && (
            <Button
              variant="outline"
              onClick={resetForm}
              className="rounded-xl"
            >
              Cancelar
            </Button>
          )}
        </div>
      </div>

      {/* Done button */}
      <Button
        onClick={onDone}
        variant="outline"
        className="w-full rounded-xl h-11 border-primary/30 text-primary"
      >
        Finalizar e ver história
      </Button>
    </div>
  );
}