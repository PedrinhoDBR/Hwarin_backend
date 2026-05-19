import React, { useState } from 'react';
import {useMutation,useQuery,} from '@tanstack/react-query';
import {useNavigate,useParams,} from 'react-router-dom';
import StoryForm from '../components/create/StoryForm';
import ChapterEditor from '../components/create/ChapterEditor';
import {Tabs,TabsContent,TabsList,TabsTrigger,} from '../components/ui/tabs';
import { authFetch } from '../services/api';
import { useToast } from '../hooks/useToast';
import PageHeader from '../components/PageHeader';

type StoryData = {
  title: string;
  subtitle?: string;
  synopsis: string;
  language: string;
  status: string;
  cover?: string;
  master_story_id?: number | null;
  genres: string[];
  tags: string[];
};

type StoryRecord = StoryData & {
  id: number;
};

type StoryFormData = StoryData & {
  is_collaborative?: boolean;
};

export default function CreateStory() {
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast();

  const { id } = useParams();
  const isEditing = (id !== 'new') && (id !== undefined);

  const [createdStory, setCreatedStory] =
    useState<StoryRecord | null>(null);

  const [activeTab, setActiveTab] =
    useState('info');

  const {
    data: story,
    isLoading: isLoadingStory,
  } = useQuery<StoryRecord | null>({
    queryKey: ['story', id],

    enabled: isEditing,

    queryFn: async () => {
      if (!id) return null;
      const response = await authFetch(
        `/api/stories/${id}`
      );

      if (!response.ok) {
        throw new Error(
          'Erro ao buscar história'
        );
      }

      return response.json();
    },
  });
  const activeStory = createdStory ?? story;

  const saveStory = useMutation<StoryRecord, Error, StoryData>({
    mutationFn: async (
      storyData: StoryData
    ) => {
      const response = await authFetch(
        isEditing
          ? `/api/stories/${id}`
          : '/api/stories',

        {
          method: isEditing
            ? 'PUT'
            : 'POST',

          headers: {
            'Content-Type':
              'application/json',
          },

          body: JSON.stringify(storyData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail ||
            'Erro ao salvar história'
        );
      }

      return data;
    },

    onError: (error) => {
      showToast(error.message || 'Erro ao salvar história', 'error');
    },

    onSuccess: (data) => {
      showToast('História salva com sucesso!', 'success');
      setCreatedStory(data);
      setActiveTab('chapters');

      if (!isEditing) {
        navigate(`/story/${data.id}`, {
          replace: true,
        });
      }
    },
  });

  const handleSaveStory = (
    formData: StoryFormData
  ) => {
    saveStory.mutate({
      title: formData.title,
      subtitle: formData.subtitle,
      synopsis: formData.synopsis,
      language: formData.language,
      status: formData.status,
      cover: formData.cover,
      genres: formData.genres,
      tags: formData.tags,
      master_story_id:
        formData.master_story_id,
    });
  };

  if (isLoadingStory) {
    return (
      <div className="min-h-screen">
        <PageHeader
          title={isEditing ? 'Editar historia' : 'Nova historia'}
        />
        <section className="p-6 text-foreground">
          Carregando historia...
        </section>
      </div>
    );
  }

  return (
  <div className="min-h-screen">
    <PageHeader
      title={isEditing ? 'Editar historia' : 'Nova historia'}
    />

  <section className="p-6 text-foreground justify-center overflow-x-hidden">
    <div className="w-full max-w-full rounded-3xl border border-white/20 bg-black/60">
      {/* <div className="mb-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          className="gap-2 text-muted-foreground"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar
        </Button>
      </div> */}
        <div className="p-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
          >
            <TabsList className="bg-secondary/30 border border-border/30 mb-6">
              <TabsTrigger
                value="info"
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              >
                Informações
              </TabsTrigger>

              <TabsTrigger
                value="chapters"
                disabled={!activeStory}
                className="data-[state=active]:bg-primary/20 data-[state=active]:text-primary"
              >
                Capítulos
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <StoryForm
                initialData={
                  story
                    ? {
                        title:
                          story.title,
                        subtitle:
                          story.subtitle,
                        synopsis:
                          story.synopsis,
                        language:
                          story.language,
                        status:
                          story.status,
                        cover:
                          story.cover,
                        genres:
                          story.genres,
                        tags:
                          story.tags,
                        master_story_id:
                          story.master_story_id,
                      }
                    : undefined
                }
                onSubmit={
                  handleSaveStory
                }
                isLoading={
                  saveStory.isPending
                }
              />
            </TabsContent>

            <TabsContent value="chapters">
              {activeStory && (
                <ChapterEditor
                  storyId={
                    activeStory.id
                  }
                  onDone={() =>
                    navigate(
                      `/historia/${activeStory.id}`
                    )
                  }
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <ToastContainer />
    </section>
  </div>
  );
}
