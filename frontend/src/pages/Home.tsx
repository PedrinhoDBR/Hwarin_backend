import React from 'react';
import { useQuery } from '@tanstack/react-query';

import PageHeader from '../components/PageHeader';
import FeaturedStory from '../components/home/FeaturedStory';
import CommunitySection from '../components/home/CommunitySection';
import RecentUpdates from '../components/home/RecentUpdates';
import LibrarySection from '../components/home/LibrarySection';

import { authFetch } from '../services/api';

async function getStories() {
  const response = await authFetch('/api/stories');

  if (!response.ok) {
    throw new Error('Erro ao buscar histórias');
  }

  return response.json();
}

export default function Home() {
  const {
    data: stories = [],
    isLoading,
  } = useQuery({
    queryKey: ['stories'],
    queryFn: getStories,
  });

  const featured = stories[0];

  return (
    <div className="min-h-screen">
      <PageHeader title="Página Inicial" />

      <div className="p-6 space-y-6">
        {/* Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="rounded-2xl border border-border/30 bg-card/50 h-52 animate-pulse" />
            ) : (
              <FeaturedStory story={featured} />
            )}
          </div>

          <div className="lg:col-span-5">
            <CommunitySection />
          </div>

          <div className="lg:col-span-4">
            <RecentUpdates stories={stories} />
          </div>
        </div>

        {/* Library */}
        {isLoading ? (
          <div className="rounded-2xl border border-border/30 bg-card/50 h-64 animate-pulse" />
        ) : (
          <LibrarySection stories={stories} />
        )}

        {/* Background */}
        <div className="relative h-40 rounded-2xl overflow-hidden border border-border/20 bg-gradient-to-b from-primary/5 via-accent/5 to-background">
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-muted-foreground text-sm font-heading">
              ✨ Explore o universo de histórias ✨
            </p>
          </div>

          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-primary/40 rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}