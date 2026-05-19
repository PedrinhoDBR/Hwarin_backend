import PageHeader from '../components/PageHeader';
import { useAuth } from '../hooks/UseAuth';

export default function User() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen">
      <PageHeader title="Perfil" />

      <section className="p-6">
        <div className="rounded-2xl border border-border/30 bg-card/50 p-6">
          <h2 className="text-lg font-semibold text-foreground">
            {user?.username ?? user?.name ?? 'Usuario'}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {user?.email}
          </p>
        </div>
      </section>
    </div>
  );
}
