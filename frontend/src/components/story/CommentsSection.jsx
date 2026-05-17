import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { MessageSquare, Send } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { authFetch } from '../../services/api';

export default function CommentsSection({ comments = [], storyId, user }) {
  const [content, setContent] = useState('');
  const queryClient = useQueryClient();

  const createComment = useMutation({
    mutationFn: async (data) => {
      const res = await authFetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error('Erro ao criar comentário');
      }

      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', storyId] });
      setContent('');
    },
  });

  const handleSubmit = () => {
    if (!content.trim() || !user) return;

    createComment.mutate({
      story_id: storyId,
      content: content.trim(),
      user_id: user.id,
      author_name: user.full_name || user.username || 'Anônimo',
    });
  };

  return (
    <div className="rounded-2xl border border-border/30 bg-card/50 p-5">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-4 h-4 text-primary" />
        <h2 className="font-heading font-bold text-sm uppercase tracking-wider">
          Comentários
        </h2>
      </div>

      {/* New comment */}
      <div className="flex gap-3 mb-5">
        <Textarea
          placeholder="Escreva um comentário..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="bg-secondary/30 border-border/30 text-sm resize-none h-20"
        />

        <Button
          size="icon"
          onClick={handleSubmit}
          disabled={!content.trim() || createComment.isPending}
          className="h-10 w-10 rounded-xl bg-primary/20 text-primary hover:bg-primary/30 flex-shrink-0"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>

      {/* Comments list */}
      <div className="space-y-3">
        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum comentário ainda. Seja o primeiro!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="flex gap-3 p-3 rounded-xl bg-secondary/20"
            >
              <Avatar className="h-8 w-8 flex-shrink-0">
                <AvatarFallback className="bg-primary/20 text-primary text-xs">
                  {(comment.author_name || 'A')[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    {comment.author_name || 'Anônimo'}
                  </span>

                  <span className="text-xs text-muted-foreground">
                    {comment.created_date
                      ? format(new Date(comment.created_date), "d 'de' MMM", {
                          locale: ptBR,
                        })
                      : ''}
                  </span>
                </div>

                <p className="text-sm text-foreground/70 mt-1">
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}