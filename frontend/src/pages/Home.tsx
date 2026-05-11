export default function Home() {
  return (
    <section className="p-6 text-foreground flex gap-6">
      <div className="rounded-3xl border border-white/10 bg-black/25 p-8 backdrop-blur-md w-1/4 flex flex-col justify-center items-center">
        <img src="/public/LogoPink.png" alt="Description" className="mb-4 rounded-lg w-40" />
        <h2 className="mb-3 text-2xl font-semibold text-foreground">Title</h2>
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground"> Continue lendo </p>
        <button className="mt-4 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md">
          Ler mais
        </button>
      </div>

      <div className="rounded-3xl border border-white/10 bg-black/25 p-8 backdrop-blur-md w-2/4">
        <h2 className="mb-3 text-2xl font-semibold text-foreground">Bem-vindo ao </h2>
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground"> a
        </p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-black/25 p-8 backdrop-blur-md w-1/4">
        <h2 className="mb-3 text-2xl font-semibold text-foreground">Bem-vindo ao </h2>
        <p className="max-w-2xl text-sm leading-7 text-muted-foreground"> a
        </p>
      </div>
    </section>
  );
}