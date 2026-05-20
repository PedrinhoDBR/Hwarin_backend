import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, X } from 'lucide-react';

import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Textarea } from '../ui/textarea';

const GENRES = [
  'Fantasia',
  'Romance',
  'Ficcao Cientifica',
  'Terror',
  'Aventura',
  'Drama',
  'Misterio',
  'Comedia',
  'Acao',
  'Suspense',
  'Fanfic',
  'Slice of Life',
  'Sobrenatural',
  'Historico',
  'Outro',
];

export default function StoryForm({ initialData, onSubmit, isLoading }) {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [tagInput, setTagInput] = useState('');
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    synopsis: '',
    status: 'em_elaboracao',
    genres: [],
    tags: [],
    language: 'Portugues',
    is_collaborative: false,
    cover: '',
    master_story_id: null,
  });

  useEffect(() => {
    if (!initialData) return;

    setForm({
      title: initialData.title || '',
      subtitle: initialData.subtitle || '',
      synopsis: initialData.synopsis || '',
      status: initialData.status || 'em_elaboracao',
      genres: initialData.genres || [],
      tags: initialData.tags || [],
      language: initialData.language || 'Portugues',
      is_collaborative: initialData.is_collaborative || false,
      cover: initialData.cover || '',
      master_story_id: initialData.master_story_id || null,
    });
  }, [initialData]);

  function handleChange(field, value) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function toggleGenre(genre) {
    setForm((current) => ({
      ...current,
      genres: current.genres.includes(genre)
        ? current.genres.filter((item) => item !== genre)
        : [...current.genres, genre],
    }));
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      handleChange('cover', reader.result);
    };

    reader.readAsDataURL(file);
  }

  function addTag() {
    const value = tagInput.trim();

    if (!value || form.tags.includes(value)) return;

    setForm((current) => ({
      ...current,
      tags: [...current.tags, value],
    }));
    setTagInput('');
  }

  function removeTag(tag) {
    setForm((current) => ({
      ...current,
      tags: current.tags.filter((item) => item !== tag),
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 rounded-xl border border-border/30 bg-card/50 p-6 lg:grid-cols-[180px_1fr]">
        <div>
          <Label className="mb-2 block text-sm">Capa da historia</Label>
          <div className="h-64 w-44 overflow-hidden rounded-xl border border-border/30 bg-secondary/20">
            {form.cover ? (
              <img
                src={form.cover}
                alt={form.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center px-4 text-center text-xs text-muted-foreground">
                Sem capa
              </div>
            )}
          </div>

          <div className="mt-3 flex gap-2">
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="text-xs"
              onClick={() => fileInputRef.current?.click()}
            >
              Imagem
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="text-xs"
              onClick={() => handleChange('cover', '')}
            >
              Remover
            </Button>
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <div className="space-y-5">
          <div>
            <h2 className="font-heading text-lg font-bold">
              Informacoes da historia
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Salve esta etapa para liberar o cadastro de capitulos.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label className="mb-2 block text-sm">Titulo *</Label>
              <Input
                value={form.title}
                onChange={(event) => handleChange('title', event.target.value)}
                placeholder="Titulo da historia"
                className="border-border/30 bg-secondary/30"
                required
              />
            </div>

            <div>
              <Label className="mb-2 block text-sm">Subtitulo</Label>
              <Input
                value={form.subtitle}
                onChange={(event) =>
                  handleChange('subtitle', event.target.value)
                }
                placeholder="Subtitulo"
                className="border-border/30 bg-secondary/30"
              />
            </div>
          </div>

          <div>
            <Label className="mb-2 block text-sm">Sinopse *</Label>
            <Textarea
              value={form.synopsis}
              onChange={(event) => handleChange('synopsis', event.target.value)}
              placeholder="Escreva a sinopse..."
              className="h-32 resize-none border-border/30 bg-secondary/30"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <Label className="mb-2 block text-sm">Status</Label>
              <Select
                value={form.status}
                onValueChange={(value) => handleChange('status', value)}
              >
                <SelectTrigger className="border-border/30 bg-secondary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="em_elaboracao">Em elaboracao</SelectItem>
                  <SelectItem value="em_andamento">Em andamento</SelectItem>
                  <SelectItem value="concluida">Concluida</SelectItem>
                  <SelectItem value="pausada">Pausada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="mb-2 block text-sm">Idioma</Label>
              <Select
                value={form.language}
                onValueChange={(value) => handleChange('language', value)}
              >
                <SelectTrigger className="border-border/30 bg-secondary/30">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Portugues">Portugues</SelectItem>
                  <SelectItem value="English">English</SelectItem>
                  <SelectItem value="Espanol">Espanol</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label className="mb-2 block text-sm">Generos</Label>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  onClick={() => toggleGenre(genre)}
                  className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                    form.genres.includes(genre)
                      ? 'border-primary/40 bg-primary/20 text-primary'
                      : 'border-border/30 bg-secondary/20 text-muted-foreground hover:border-border/60'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="mb-2 block text-sm">Tags</Label>
            <div className="flex items-center gap-2">
              <Input
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Adicionar tag..."
                className="flex-1 border-border/30 bg-secondary/30"
              />
              <Button
                type="button"
                size="sm"
                onClick={addTag}
                variant="outline"
                className="rounded-full text-xs"
              >
                Adicionar
              </Button>
            </div>

            {form.tags.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {form.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="gap-1 bg-primary/10 text-xs text-primary"
                  >
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)}>
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <p className="rounded-xl border border-primary/20 bg-primary/10 p-3 text-xs text-muted-foreground">
            Historias em elaboracao ficam fora da busca. Quando estiver pronta
            para leitores, altere o status para Em andamento ou Concluida.
          </p>
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-3">
        <Button
          type="button"
          size="sm"
          onClick={() => navigate(-1)}
          className="rounded-xl bg-secondary px-4 hover:bg-secondary/80"
        >
          Voltar
        </Button>

        <Button
          type="submit"
          size="sm"
          disabled={!form.title || !form.synopsis || isLoading}
          className="rounded-xl bg-primary px-4 hover:bg-primary/80"
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData ? 'Salvar historia' : 'Criar historia e cadastrar capitulos'}
        </Button>
      </div>
    </form>
  );
}
