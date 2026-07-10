"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import PlayerForm from "@/components/PlayerForm";
import PlayerStatsForm from "@/components/PlayerStatsForm";

import type { Player } from "@/types/player";

import {
  getPlayer,
  updatePlayer,
} from "@/services/playerService";

import { supabase } from "@/lib/supabase";



export default function EditarJogador() {


  const { id } = useParams();

  const router = useRouter();



  const [player, setPlayer] = useState<Player | null>(null);

  const [estatisticas, setEstatisticas] = useState<{
    gols: number;
    assistencias: number;
    jogos: number;
  } | null>(null);


  const [loading, setLoading] = useState(true);





  const temporadaAtual = new Date().getFullYear();







  useEffect(() => {


    async function carregarDados() {


      try {



        const jogador = await getPlayer(

          id as string

        );



        setPlayer(jogador);







        const { data: stats } = await supabase

          .from("estatisticas_jogadores")

          .select("*")

          .eq(
            "jogador_id",
            Number(id)
          )

          .eq(
            "temporada",
            temporadaAtual
          )

          .maybeSingle();







        if (stats) {


          setEstatisticas({

            gols: stats.gols ?? 0,

            assistencias: stats.assistencias ?? 0,

            jogos: stats.jogos ?? 0,

          });


        } else {


          setEstatisticas({

            gols: 0,

            assistencias: 0,

            jogos: 0,

          });


        }






      } catch (error) {


        console.error(
          "Erro ao carregar jogador:",
          error
        );


      } finally {


        setLoading(false);


      }


    }







    if (id) {


      carregarDados();


    }



  }, [id, temporadaAtual]);










  async function handleSubmit(

    playerAtualizado: Player

  ) {



    await updatePlayer(

      id as string,

      playerAtualizado

    );





    router.push(

      `/jogadores/${id}`

    );


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


    <main className="app-page flex flex-col items-center gap-6">





      <PlayerForm


        initialData={player}


        onSubmit={handleSubmit}


        buttonText="Salvar Alterações"


      />







      <PlayerStatsForm


        jogadorId={Number(id)}


        temporada={temporadaAtual}


        initialData={{


          gols: estatisticas?.gols,


          assistencias: estatisticas?.assistencias,


          jogos: estatisticas?.jogos,


        }}


      />






    </main>


  );


}