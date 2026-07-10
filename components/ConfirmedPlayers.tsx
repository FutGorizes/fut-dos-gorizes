"use client";

import { useEffect, useState } from "react";
import { Check, Star, UsersRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";


interface Jogador {
  id: number;
  nome: string;
  overall: number;
}

type PresencaResponse = {
  jogadores: Jogador;
};


export default function ConfirmedPlayers({
  partidaId
}: {
  partidaId: number;
}) {


  const [jogadores, setJogadores] = useState<Jogador[]>([]);



  useEffect(() => {

    async function buscarPresencas() {

      const response = await fetch(
        `/api/presencas?partida_id=${partidaId}`
      );


      const data = await response.json();


      const lista = (data as PresencaResponse[]).map(
        (item) => item.jogadores
      );


      setJogadores(lista);

    }


    buscarPresencas();


  }, [partidaId]);




  return (

    <div className="mt-8">


      <h2 className="mb-4 flex items-center gap-2 text-xl font-black">
        <UsersRound size={20} />
        Confirmados
        <Badge variant="secondary" className="rounded-lg">
          {jogadores.length}/14
        </Badge>
      </h2>



      <div className="space-y-2">


        {jogadores.length === 0 && (

          <p className="text-zinc-500">
            Nenhum jogador confirmado ainda.
          </p>

        )}



        {jogadores.map((jogador) => (

          <Card
            key={jogador.id}
            className="bg-secondary/60"
          >
            <CardContent className="flex justify-between p-3">

            <span className="flex items-center gap-2 font-semibold">
              <Check size={16} className="text-accent" />
              {jogador.nome}
            </span>


            <span className="flex items-center gap-1 font-black">
              <Star size={15} className="text-accent" />
              {jogador.overall}
            </span>

            </CardContent>
          </Card>

        ))}


      </div>


    </div>

  );

}
