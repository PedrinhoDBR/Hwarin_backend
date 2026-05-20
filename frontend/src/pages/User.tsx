import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useMutation } from '@tanstack/react-query';
import { Camera, Loader2, UserRound } from 'lucide-react';

import PageHeader from '../components/PageHeader';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useAuth } from '../hooks/UseAuth';
import { authFetch } from '../services/api';
import type { AuthUser } from '../types/auth';

type ProfilePayload = {
  username: string;
  avatar_url: string;
  bio: string;
};

export default function User() {
  const { user, setUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [form, setForm] = useState<ProfilePayload>({
    username: '',
    avatar_url: '',
    bio: '',
  });

  useEffect(() => {
    if (!user) return;

    setForm({
      username: user.username ?? user.name ?? '',
      avatar_url: user.avatar_url ?? '',
      bio: user.bio ?? '',
    });
  }, [user]);

  const updateProfile = useMutation({
    mutationFn: async (payload: ProfilePayload): Promise<AuthUser> => {
      const response = await authFetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || 'Erro ao salvar perfil');
      }

      return data;
    },
    onSuccess: (updatedUser) => {
      setUser((current) => ({
        ...(current ?? updatedUser),
        ...updatedUser,
      }));
    },
  });

  function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = () => {
      setForm((current) => ({
        ...current,
        avatar_url: String(reader.result ?? ''),
      }));
    };

    reader.readAsDataURL(file);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateProfile.mutate(form);
  }

  return (
    <div className="min-h-screen">
      <PageHeader title="Perfil" />

      <section className="p-6">
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl space-y-5 rounded-xl border border-border/30 bg-card/50 p-6"
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative h-28 w-28 shrink-0">
              {form.avatar_url ? (
                <img
                  src={form.avatar_url}
                  alt={form.username}
                  className="h-28 w-28 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full bg-secondary/60">
                  <UserRound className="h-10 w-10 text-muted-foreground" />
                </div>
              )}

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 flex h-9 w-9 items-center justify-center rounded-full border border-border/40 bg-background text-foreground shadow-lg transition-colors hover:text-primary"
                title="Alterar foto"
              >
                <Camera className="h-4 w-4" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-xl font-semibold text-foreground">
                {user?.username ?? user?.name ?? 'Usuario'}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </div>

          <div className="grid gap-4">
            <div>
              <Label className="mb-2 block text-sm">Nome publico</Label>
              <Input
                value={form.username}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    username: event.target.value,
                  }))
                }
                className="border-border/30 bg-secondary/30"
              />
            </div>

            <div>
              <Label className="mb-2 block text-sm">Descricao breve</Label>
              <Textarea
                value={form.bio}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    bio: event.target.value,
                  }))
                }
                maxLength={280}
                placeholder="Conte em poucas linhas que tipo de historias voce escreve."
                className="min-h-28 resize-none border-border/30 bg-secondary/30"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                {form.bio.length}/280
              </p>
            </div>
          </div>

          {updateProfile.isError && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              Nao foi possivel salvar o perfil agora.
            </div>
          )}

          {updateProfile.isSuccess && (
            <div className="rounded-xl border border-primary/30 bg-primary/10 p-3 text-sm text-primary">
              Perfil atualizado.
            </div>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!form.username.trim() || updateProfile.isPending}
              className="gap-2 rounded-xl"
            >
              {updateProfile.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Salvar perfil
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
