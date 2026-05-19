import React, { useEffect, useState,useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Upload, X, Loader2 } from 'lucide-react';


const GENRES = [
  'Fantasia', 'Romance', 'Ficção Científica', 'Terror', 'Aventura',
  'Drama', 'Mistério', 'Comédia', 'Ação', 'Suspense',
  'Fanfic', 'Slice of Life', 'Sobrenatural', 'Histórico', 'Outro'
];

export default function StoryForm({
  initialData,
  onSubmit,
  isLoading,
}) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    subtitle: '',
    synopsis: '',
    status: 'em_andamento',
    genres: [],
    tags: [],
    language: 'Português',
    is_collaborative: false,
    cover: '',
    master_story_id: null,
  });

  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (initialData) {
      setForm({
        title:
          initialData.title || '',

        subtitle:
          initialData.subtitle || '',

        synopsis:
          initialData.synopsis || '',

        status:
          initialData.status ||
          'em_andamento',

        genres:
          initialData.genres || [],

        tags:
          initialData.tags || [],

        language:
          initialData.language ||
          'Português',

        is_collaborative:
          initialData.is_collaborative ||
          false,

        cover:
          initialData.cover || '',

        master_story_id:
          initialData.master_story_id ||
          null,
      });
    }
  }, [initialData]);

  const handleChange = (
    field,
    value
  ) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const toggleGenre = (genre) => {
    setForm((prev) => ({
      ...prev,

      genres:
        prev.genres.includes(genre)
          ? prev.genres.filter(
              (g) => g !== genre
            )
          : [
              ...prev.genres,
              genre,
            ],
    }));
  };

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      handleChange('cover', reader.result);
    };

    reader.readAsDataURL(file);
  };

  const addTag = () => {
    if (
      tagInput.trim() &&
      !form.tags.includes(
        tagInput.trim()
      )
    ) {
      setForm((prev) => ({
        ...prev,

        tags: [
          ...prev.tags,
          tagInput.trim(),
        ],
      }));

      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setForm((prev) => ({
      ...prev,

      tags: prev.tags.filter(
        (t) => t !== tag
      ),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      <div className="rounded-2xl border border-border/30 bg-card/50 p-6 space-y-5">
        <h2 className="font-heading font-bold text-lg">
          Informações da História
        </h2>

        {/* CAPA */}
        <div>
          <Label className="text-sm mb-2 block">
            Capa da história
          </Label>

          <div className="flex items-center gap-4">

            {/* preview */}
            <div className="w-28 h-40 rounded-xl border border-border/30 bg-secondary/20 overflow-hidden flex items-center justify-center">
              {form.cover ? (
                <img
                  src={form.cover}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-xs text-muted-foreground">
                  Sem capa
                </span>
              )}
            </div>

            {/* buttons */}
            <div className="flex flex-col gap-2">

              <Button
                type="button"
                size="sm"
                className="text-xs"
                onClick={() => fileInputRef.current?.click()}
              >
                Enviar imagem
              </Button>

              <Button
                type="button"
                size="sm"
                variant="outline"
                className="text-xs"
                onClick={() => handleChange('cover', '')}
              >
                Remover
              </Button>

              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

          </div>
        </div>

        {/* TÍTULO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm mb-2 block">
              Título *
            </Label>

            <Input
              value={form.title}
              onChange={(e) =>
                handleChange(
                  'title',
                  e.target.value
                )
              }
              placeholder="Título da história"
              className="bg-secondary/30 border-border/30"
              required
            />
          </div>

          <div>
            <Label className="text-sm mb-2 block">
              Subtítulo
            </Label>

            <Input
              value={form.subtitle}
              onChange={(e) =>
                handleChange(
                  'subtitle',
                  e.target.value
                )
              }
              placeholder="Subtítulo"
              className="bg-secondary/30 border-border/30"
            />
          </div>
        </div>

        {/* SINOPSE */}
        <div>
          <Label className="text-sm mb-2 block">
            Sinopse *
          </Label>

          <Textarea
            value={form.synopsis}
            onChange={(e) =>
              handleChange(
                'synopsis',
                e.target.value
              )
            }
            placeholder="Escreva a sinopse..."
            className="bg-secondary/30 border-border/30 h-32 resize-none"
            required
          />
        </div>

        {/* STATUS + IDIOMA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-sm mb-2 block">
              Status
            </Label>

            <Select
              value={form.status}
              onValueChange={(v) =>
                handleChange(
                  'status',
                  v
                )
              }
            >
              <SelectTrigger className="bg-secondary/30 border-border/30">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="em_andamento">
                  Em andamento
                </SelectItem>

                <SelectItem value="concluida">
                  Concluída
                </SelectItem>

                <SelectItem value="pausada">
                  Pausada
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm mb-2 block">
              Idioma
            </Label>

            <Select
              value={form.language}
              onValueChange={(v) =>
                handleChange(
                  'language',
                  v
                )
              }
            >
              <SelectTrigger className="bg-secondary/30 border-border/30">
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="Português">
                  Português
                </SelectItem>

                <SelectItem value="English">
                  English
                </SelectItem>

                <SelectItem value="Español">
                  Español
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* GÊNEROS */}
        <div>
          <Label className="text-sm mb-2 block">
            Gêneros
          </Label>

          <div className="flex flex-wrap gap-2">
            {GENRES.map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() =>
                  toggleGenre(genre)
                }
                className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                  form.genres.includes(
                    genre
                  )
                    ? 'bg-primary/20 text-primary border-primary/40'
                    : 'bg-secondary/20 text-muted-foreground border-border/30 hover:border-border/60'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* TAGS */}
        <div>
          <Label className="text-sm mb-2 block">
            Tags
          </Label>

          <div className="flex gap-2 items-center">
            <Input
              value={tagInput}
              onChange={(e) =>
                setTagInput(
                  e.target.value
                )
              }
              onKeyDown={(e) =>
                e.key === 'Enter' &&
                (
                  e.preventDefault(),
                  addTag()
                )
              }
              placeholder="Adicionar tag..."
              className="bg-secondary/30 border-border/30 flex-1"
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
            <div className="flex flex-wrap gap-2 mt-2">
              {form.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs gap-1 bg-primary/10 text-primary"
                >
                  {tag}

                  <button
                    type="button"
                    onClick={() =>
                      removeTag(tag)
                    }
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* COLABORATIVA */}
        <div className="flex items-center justify-between py-2">
          <div>
            <Label className="text-sm">
              História colaborativa
            </Label>

            <p className="text-xs text-muted-foreground">
              Permitir que outros usuários adicionem capítulos
            </p>
          </div>

          <Switch
            checked={
              form.is_collaborative
            }
            onCheckedChange={(v) =>
              handleChange(
                'is_collaborative',
                v
              )
            }
          />
        </div>
      </div>
      <div className="flex justify-center gap-3">
        <Button
          size="sm"
          onClick={() => navigate(-1)}
          className="bg-secondary hover:bg-primary/80 rounded-xl px-4"
        >
        Voltar
      </Button>

        <Button
          type="submit"
          size="sm"
          disabled={!form.title || !form.synopsis || isLoading}
          className="bg-primary hover:bg-primary/80 rounded-xl px-4"
        >
        {isLoading && (
          <Loader2 className="w-4 h-4 animate-spin mr-2" />
        )}

        {initialData
          ? 'Salvar História'
          : 'Criar História'}
      </Button>
      </div>
    </form>
  );
}
