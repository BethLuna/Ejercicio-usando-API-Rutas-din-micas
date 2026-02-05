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
    <div className="min-h-screen bg-slate-900">
      <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-10 shadow-lg">
        
        <div className="lg:hidden px-4 py-2 border-b border-gray-700">
          <h2 className="text-white text-center font-bold">PokeTrabajo</h2>
        </div>

        <div className="overflow-x-auto lg:overflow-x-visible">
          <div className="flex lg:flex-wrap gap-2 p-4 justify-start lg:justify-center min-w-max lg:min-w-0">
            {pokemonNames.map(({ id, name }) => (
              <Link
                key={id}
                href={`/pokes/${id}`}
                className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 lg:px-4 rounded-md text-xs sm:text-sm font-medium transition-all hover:scale-105 capitalize whitespace-nowrap flex-shrink-0"
              >
                <span className="hidden sm:inline">{name}</span>
                <span className="sm:hidden">#{id}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>
      <main>
        {children}
      </main>
    </div>
  );
}