import Link from "next/link";

const ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

type PokemonApiResponse = {
  name: string;
  id: number;
};

async function getPokemonName(id: number): Promise<string> {
  try {
    const res = await fetch(
      `https://pokeapi.co/api/v2/pokemon/${id}`,
      { 
        cache: "force-cache", 
        next: { revalidate: 3600 } 
      }
    );

    if (!res.ok) return `#${id}`;

    const data: PokemonApiResponse = await res.json();
    return data.name;
  } catch (error) {
    return `#${id}`;
  }
}

export default async function PokesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pokemonNames = await Promise.all(
    ids.map(async (id) => ({
      id,
      name: await getPokemonName(id),
    }))
  );

  return (
    <div className="min-h-screen bg-pink-950/55">
      <nav className="bg-pink-950 border-b border-b-purple-50 p-4 sticky top-0 z-10 shadow-lg">
        <div className="flex flex-wrap gap-2 justify-center">
          {pokemonNames.map(({ id, name }) => (
            <Link
              key={id}
              href={`/pokes/${id}`}
              className="bg-gray-700/50 hover:bg-rose-300 text-white px-4 py-2 rounded-md text-sm font-medium transition-all hover:scale-105 capitalize"
            >
              {name}
            </Link>
          ))}
        </div>
      </nav>
      <main>
        {children}
      </main>
    </div>
  );
}