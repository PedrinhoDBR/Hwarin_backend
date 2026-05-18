import { useState } from 'react';
import {
  Bookmark,
  ChevronRight,
  Download,
  Play,
  Sparkles,
  Star,
} from 'lucide-react';
import { Button, PageHeader } from '../components/index';
import { alpha, createAppTheme } from '../theme';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Story {
  id: number;
  title: string;
  author: string;
  cover: string;
  tags: string[];
  synopsis: string;
  description: string;
  rating: number;
  chapters: number;
  views: string;
  updatedAt: string;
}

interface RelatedStory {
  id: number;
  title: string;
  cover: string;
  author: string;
}

// ─── Mock data (replace with backend) ────────────────────────────────────────
const STORY: Story = {
  id: 1,
  title: "The Little Prince",
  author: "Antoine de Saint-Exupéry",
  cover: "https://picsum.photos/seed/prince/300/450",
  tags: ["philosophy", "fairytale", "from 0 to 100 y.o."],
  synopsis: "A obra mais famosa de Antoine de Saint-Exupéry com ilustrações do próprio autor.",
  description:
    "Um conto de fadas sábio que fala de forma simples e tocante sobre as coisas mais importantes: amizade e amor, dever e lealdade, beleza e maldade.\n\nO autor nos apresenta ao personagem mais misterioso e tocante da literatura mundial — um menino que veio de um asteroide e nos ensina a enxergar o que os olhos não veem.",
  rating: 4.8,
  chapters: 27,
  views: "2.3M",
  updatedAt: "há 2 dias",
};

const RELATED: RelatedStory[] = [
  { id: 2, title: "O Alquimista",      author: "Paulo Coelho",        cover: "https://picsum.photos/seed/alq/150/220"  },
  { id: 3, title: "Surely You're...",  author: "R. Feynman",          cover: "https://picsum.photos/seed/feyn/150/220" },
  { id: 4, title: "Foundation",        author: "Isaac Asimov",        cover: "https://picsum.photos/seed/found/150/220"},
  { id: 5, title: "Dune",              author: "Frank Herbert",       cover: "https://picsum.photos/seed/dune/150/220" },
  { id: 6, title: "Neuromancer",       author: "William Gibson",      cover: "https://picsum.photos/seed/neuro/150/220"},
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function StoryPage() {
  const theme = createAppTheme('dark');
  const { brand, text } = theme;
  const [bookmarked, setBookmarked] = useState(false);

  return (
    <div
      className="flex h-full flex-col overflow-hidden"
      style={{ color: text.primary, fontFamily: theme.fontFamily }}
    >
      
      <div className="flex-1 overflow-y-auto p-6 teste">
        <div className="flex flex-col gap-6">
          <section className="flex flex-col gap-6 xl:flex-row xl:items-start">
            <div
              className="relative w-full overflow-hidden"
              style={{
                maxWidth: '200px',
                borderRadius: '20px',
                boxShadow: `0 16px 48px ${alpha(brand.primary, 0.7)}, 0 0 0 1px rgba(255,255,255,0.1)`,
              }}
            >
              <img src={STORY.cover} alt={STORY.title} className="block w-full" />
              <div
                className="absolute -bottom-5 left-[10%] right-[10%] h-10 rounded-full blur-2xl"
                style={{ background: alpha(brand.sparkle, 0.25) }}
              />
            </div>

            <div className="flex flex-1 flex-col gap-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h1
                    className="mb-1 text-4xl leading-tight"
                    style={{
                      fontWeight: theme.typography.h1Weight,
                      background: brand.accentGradient,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    {STORY.title}
                  </h1>
                  <p className="text-sm italic" style={{ color: text.secondary }}>
                    {STORY.author}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setBookmarked((value) => !value)}
                  className="flex h-11 w-11 items-center justify-center rounded-xl border transition-colors"
                  style={{
                    color: bookmarked ? brand.sparkle : alpha(brand.fontColor, 0.4),
                    background: bookmarked ? alpha(brand.sparkle, 0.12) : 'transparent',
                    borderColor: bookmarked ? alpha(brand.sparkle, 0.3) : brand.border,
                  }}
                >
                  <Bookmark className="h-5 w-5" />
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {STORY.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border px-3 py-1 text-[0.72rem] font-medium backdrop-blur-md"
                    style={{
                      background: alpha(brand.primary, 0.25),
                      borderColor: alpha(brand.sparkle, 0.2),
                      color: text.primary,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3 text-[0.78rem]" style={{ color: text.secondary }}>
                <span className="flex items-center gap-1 font-bold" style={{ color: brand.fontColor }}>
                  <Star className="h-4 w-4 fill-current text-[#f5c842]" />
                  {STORY.rating}
                </span>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: brand.border }} />
                <span>{STORY.chapters} capítulos</span>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: brand.border }} />
                <span>{STORY.views} leituras</span>
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: brand.border }} />
                <span>Atualizado {STORY.updatedAt}</span>
              </div>

              <p className="text-sm italic leading-7" style={{ color: text.secondary }}>
                {STORY.synopsis}
              </p>

              <p className="whitespace-pre-line text-sm leading-8" style={{ color: text.secondary }}>
                {STORY.description}
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  className="rounded-xl px-6 py-3"
                  style={{
                    background: brand.accentGradient,
                    color: brand.fontColor,
                    boxShadow: `0 6px 20px ${alpha(brand.sparkle, 0.4)}`,
                    fontWeight: theme.typography.buttonWeight,
                  }}
                >
                  <Play className="h-4 w-4" />
                  Começar a ler
                </Button>

                <Button
                  className="rounded-xl border px-6 py-3"
                  style={{
                    background: alpha(brand.fontColor, 0.07),
                    color: text.secondary,
                    borderColor: brand.border,
                    fontWeight: theme.typography.buttonWeight,
                  }}
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </section>

          <section
            className="rounded-[20px] border p-6 backdrop-blur-xl"
            style={{
              background: 'rgba(15, 10, 35, 0.55)',
              borderColor: brand.border,
              boxShadow: `0 8px 32px ${alpha(brand.primary, 0.25)}`,
            }}
          >
            <div className="mb-4 flex items-center gap-2">
              <Sparkles className="h-3 w-3" style={{ color: brand.sparkle }} />
              <span
                className="text-[0.82rem] tracking-widest"
                style={{ fontWeight: theme.typography.h5Weight, color: text.primary }}
              >
                VOCÊ TAMBÉM PODE GOSTAR
              </span>
              <div className="flex-1" />
              <button type="button" className="flex items-center gap-1 text-[0.72rem]" style={{ color: text.secondary }}>
                Ver tudo
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-2">
              {RELATED.map((book) => (
                <article
                  key={book.id}
                  className="relative shrink-0 overflow-hidden border transition-transform duration-200 hover:-translate-y-1 hover:scale-[1.03]"
                  style={{
                    width: '100px',
                    borderRadius: '14px',
                    borderColor: 'rgba(255,255,255,0.12)',
                    boxShadow: `0 4px 20px rgba(0,0,0,0.45)`,
                  }}
                >
                  <img
                    src={book.cover}
                    alt={book.title}
                    className="block object-cover"
                    style={{ height: '150px', width: '100px' }}
                  />
                  <div
                    className="absolute bottom-0 left-0 right-0 p-2"
                    style={{ background: brand.overlayDark }}
                  >
                    <p
                      className="text-[0.65rem] leading-tight"
                      style={{ fontWeight: theme.typography.h5Weight, color: brand.fontColor }}
                    >
                      {book.title}
                    </p>
                    <p className="mt-1 text-[0.6rem]" style={{ color: alpha(brand.fontColor, 0.55) }}>
                      {book.author}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}