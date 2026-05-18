import React from 'react';
import { Button } from '../ui/button';

export default function CommunitySection() {
  return (
    <div className="rounded-2xl border border-border/30 bg-card/50 p-6 flex flex-col justify-between h-full">
      <div>
        <h2 className="font-heading font-bold text-lg uppercase tracking-wider mb-3">
          Comunidade
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          O acesso à leitura no Brasil enfrenta desafios estruturais. O Storyverse busca democratizar a escrita e leitura de ficção, 
          conectando autores e leitores em uma plataforma gratuita e colaborativa.
        </p>
      </div>
      <div className="flex gap-3 mt-4">
        <Button size="sm" className="rounded-full text-xs bg-primary hover:bg-primary/80">
          Leia mais
        </Button>
        <Button size="sm" variant="outline" className="rounded-full text-xs border-border/50">
          Publicar post
        </Button>
      </div>
    </div>
  );
}