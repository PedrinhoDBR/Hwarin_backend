import React, { useEffect, useState } from 'react';
import {useMutation,useQuery,} from '@tanstack/react-query';
import {useNavigate,useParams,} from 'react-router-dom';
import StoryForm from '../components/create/StoryForm';
import ChapterEditor from '../components/create/ChapterEditor';
import {Tabs,TabsContent,TabsList,TabsTrigger,} from '../components/ui/tabs';
import { authFetch } from '../services/api';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useToast } from '../hooks/useToast';

type StoryData = {
  title: string;
  subtitle?: string;
  text: string;
  language: string;
  status: string;
  cover?: string;
  master_story_id?: number | null;
};

export default function CreateStory() {
  const navigate = useNavigate();
  const { showToast, ToastContainer } = useToast();

  const { id } = useParams();
  const isEditing = (id !== 'new') && (id !== undefined);

  const [createdStory, setCreatedStory] =
    useState<any>(null);

  const [activeTab, setActiveTab] =
    useState('info');

  const {
    data: story,
    isLoading: isLoadingStory,
  } = useQuery({
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

  useEffect(() => {
    if (story) {
      setCreatedStory(story);
    }
  }, [story]);

  const saveStory = useMutation({
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
    formData: any
  ) => {
    saveStory.mutate({
      title: formData.title,
      subtitle: formData.subtitle,
      synopsis: formData.synopsis,
      language: formData.language,
      status: formData.status,
      cover: formData.cover,
      master_story_id:
        formData.master_story_id,
    });
  };

  if (isLoadingStory) {
    return (
      <section className="p-6 text-foreground">
        Carregando história...
      </section>
    );
  }

  return (
  <section className="p-6 text-foreground justify-center overflow-x-hidden">
    <div className="min-h-screen w-full max-w-full rounded-3xl border border-white/20 bg-black/60">
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
                disabled={!createdStory}
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
              {createdStory && (
                <ChapterEditor
                  storyId={
                    createdStory.id
                  }
                  onDone={() =>
                    navigate(
                      `/historia/${createdStory.id}`
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
  );
}