"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import PlayerForm from "@/components/PlayerForm";
import type { Player } from "@/types/player";

import {
  getPlayer,
  updatePlayer,
} from "@/services/playerService";


export default function EditarJogador() {

  const { id } = useParams();
  const router = useRouter();

  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {

    async function carregarJogador() {

      try {

        const data = await getPlayer(id as string);

        setPlayer(data);

      } catch (error) {

        console.error("Erro ao carregar jogador:", error);

      } finally {

        setLoading(false);

      }

    }


    if (id) {
      carregarJogador();
    }

  }, [id]);



  async function handleSubmit(playerAtualizado: Player) {

    await updatePlayer(
      id as string,
      playerAtualizado
    );


    router.push(`/jogadores/${id}`);

  }



  if (loading) {

    return (
      <main className="app-page">
        Carregando...
      </main>
    );

  }



  if (!player) {

    return (
      <main className="app-page">
        Jogador não encontrado.
      </main>
    );

  }



  return (

    <main className="app-page flex justify-center items-center">

      <PlayerForm
        initialData={player}
        onSubmit={handleSubmit}
        buttonText="Salvar Alterações"
      />

    </main>

  );

}
