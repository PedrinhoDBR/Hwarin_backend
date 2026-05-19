import {
  type FormEvent,
  useState,
} from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createAppTheme } from '../theme';

interface PageHeaderProps {
  title: string;
  onSearch?: (value: string) => void;
  searchValue?: string;
  searchPlaceholder?: string;
  showSearch?: boolean;
}

export default function PageHeader({
  title,
  onSearch,
  searchValue,
  searchPlaceholder = 'Pesquisar historias...',
  showSearch = true,
}: PageHeaderProps) {
  const theme = createAppTheme('dark');
  const navigate = useNavigate();
  const [search, setSearch] = useState(searchValue ?? '');
  const visibleSearch = searchValue ?? search;

  function handleSearchChange(value: string) {
    setSearch(value);
    onSearch?.(value);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const query = visibleSearch.trim();

    if (onSearch) {
      onSearch(query);
      return;
    }

    navigate(
      query
        ? `/search?q=${encodeURIComponent(query)}`
        : '/search'
    );
  }

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-black/30 px-6 py-4 backdrop-blur-xl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-2xl font-semibold text-foreground lg:text-3xl">
          {title}
        </h1>

        {showSearch && (
          <form
            onSubmit={handleSubmit}
            className="flex w-full items-center gap-3 rounded-xl border px-4 py-3 backdrop-blur-md"
            style={{
              background: theme.brand.inputBg,
              borderColor: theme.brand.border,
              color: theme.text.secondary,
              maxWidth: '420px',
            }}
          >
            <input
              type="search"
              placeholder={searchPlaceholder}
              value={visibleSearch}
              onChange={(event) =>
                handleSearchChange(event.target.value)
              }
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button
              type="submit"
              className="flex h-5 w-5 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
              title="Buscar"
              aria-label="Buscar"
            >
              <Search className="h-4 w-4" />
            </button>
          </form>
        )}
      </div>
    </header>
  );
}
