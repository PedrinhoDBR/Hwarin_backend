import { useState } from 'react';
import { Search } from 'lucide-react';
import { createAppTheme } from '../theme';

interface PageHeaderProps {
  title: string;
}

export default function PageHeader({ title }: PageHeaderProps) {
  const theme = createAppTheme('dark');
  const [search, setSearch] = useState('');

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-black/30 px-6 py-4 backdrop-blur-xl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-2xl font-light tracking-[0.22em] text-foreground lg:text-3xl">
          {title}
        </h1>

        <div
          className="flex w-full items-center gap-3 rounded-xl border px-4 py-3 backdrop-blur-md"
          style={{
            background: theme.brand.inputBg,
            borderColor: theme.brand.border,
            color: theme.text.secondary,
            maxWidth: '420px',
          }}
        >
          <input
            type="text"
            placeholder="Pesquisar..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
          <Search className="h-4 w-4 shrink-0" />
        </div>
      </div>
    </header>
  );
}