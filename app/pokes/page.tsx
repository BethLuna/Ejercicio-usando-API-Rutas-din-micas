import React from 'react'
import Image from 'next/image'
import Link from "next/link";

const ids = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

type PokemonApiResponse = {
  name: string;
  id: number;
};

async function getPokemonData(id: number): Promise<{ name: string; image: string } | null> {
  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${id}`,
    { 
      cache: "force-cache",
      next: { revalidate: 3600 }
    }
  );

  if (!res.ok) return null;

  const data: PokemonApiResponse = await res.json();
  
  return {
    name: data.name,
    image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`
  };
}

export default async function PokesPage() {
  const pokemons = await Promise.all(
    ids.map(async (id) => ({
      id,
      data: await getPokemonData(id),
    }))
  );

  return (
    
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 p-4 gap-4"> 
      {
        pokemons.map(({ id, data }) => (
          <Link
            key={id}
            href={`/pokes/${id}`}
            className="group"
          >
            <div className="text-center flex flex-col gap-2 justify-center bg-pink-950 rounded-lg shadow-md hover:shadow-xl transition-all transform hover:scale-105 duration-200">
            
              {data ? (
                <div className="relative h-48 w-full overflow-hidden rounded-t-lg bg-gray-700/50 p-4">
                  <Image
                    src={data.image}
                    alt={`Pokémon ${data.name}`}
                    fill
                    className="object-contain drop-shadow-lg"
                  />
                </div>
              ) : (
                <div className="w-full h-48 flex items-center justify-center bg-pink-700 rounded-t-lg">
                  <span className="text-gray-400">Imagen no disponible</span>
                </div>
              )}
              
              <div className="p-4">
                <h3 className="text-lg font-semibold capitalize text-white">
                  {data?.name || `Pokémon #${id}`}
                </h3>
                <p className="text-gray-400 text-sm">#{id}</p>
              </div>
            </div>
          </Link>
        ))
      }
    </div>
  );
}