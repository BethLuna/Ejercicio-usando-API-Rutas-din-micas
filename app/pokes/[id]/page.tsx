import React from 'react'
import Image from 'next/image'

type PokeApiResponse = {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    other: {
      dream_world: {
        front_default: string;
      };
      'official-artwork': {
        front_default: string;
      };
    };
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
};

interface PokeInterface {
  params: {
    id: string;
  };
}

export default async function PokemonDetailPage(props: PokeInterface) {
  const { id } = await props.params;

  const res = await fetch(
    `https://pokeapi.co/api/v2/pokemon/${id}/`,
    { 
      cache: "force-cache",
      next: { revalidate: 3600 }
    }
  );

  if (!res.ok) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-red-500 text-lg sm:text-xl font-bold text-center">
          Error al obtener la información del pokémon.
        </div>
      </div>
    );
  }

  const data: PokeApiResponse = await res.json();

  const imageUrl = 
    data.sprites.other.dream_world.front_default || 
    data.sprites.other['official-artwork'].front_default ||
    `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${id}.svg`;

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="max-w-2xl mx-auto">
    
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold capitalize text-white mb-2">
            {data.name}
          </h1>
          <p className="text-gray-400 text-lg sm:text-xl">#{data.id}</p>
        </div>
        <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          <div className="relative h-64 sm:h-80 lg:h-96 bg-gradient-to-b from-gray-700 to-gray-800 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <div className="relative w-full h-full">
              <Image
                src={imageUrl}
                alt={`Imagen de ${data.name}`}
                fill
                className="object-contain drop-shadow-2xl"
                sizes="(max-width: 768px) 100vw, 672px"
                priority
              />
            </div>
          </div>
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div>
              <h3 className="text-gray-400 text-xs sm:text-sm font-semibold mb-2">TIPO</h3>
              <div className="flex flex-wrap gap-2">
                {data.types.map((type) => (
                  <span
                    key={type.type.name}
                    className="bg-blue-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-semibold capitalize"
                  >
                    {type.type.name}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-gray-700 p-3 sm:p-4 rounded-lg">
                <p className="text-gray-400 text-xs sm:text-sm">Altura</p>
                <p className="text-white text-xl sm:text-2xl font-bold">
                  {data.height / 10} m
                </p>
              </div>
              <div className="bg-gray-700 p-3 sm:p-4 rounded-lg">
                <p className="text-gray-400 text-xs sm:text-sm">Peso</p>
                <p className="text-white text-xl sm:text-2xl font-bold">
                  {data.weight / 10} kg
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}