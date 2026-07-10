import { notFound } from "next/navigation"

import { supabase } from "@/lib/supabase"

import PlayerStatsForm from "@/components/PlayerStatsForm"



export default async function EstatisticasJogador({

  params,

}: {

  params: Promise<{ id: string }>

}) {



  const { id } = await params



  const jogadorId = Number(id)



  if (isNaN(jogadorId)) {

    notFound()

  }






  const { data: player } = await supabase

    .from("jogadores")

    .select("id,nome")

    .eq("id", jogadorId)

    .single()






  if (!player) {

    notFound()

  }







  const temporadaAtual = new Date().getFullYear()






  const { data: estatisticas } = await supabase

    .from("estatisticas_jogadores")

    .select("*")

    .eq("jogador_id", jogadorId)

    .eq("temporada", temporadaAtual)

    .maybeSingle()







  return (

    <main className="app-page">


      <div className="mx-auto w-full max-w-xl space-y-4">


        <div>

          <p className="page-kicker">

            Administração

          </p>


          <h1 className="font-heading text-3xl font-black">

            Estatísticas de {player.nome}

          </h1>


          <p className="text-sm text-muted-foreground">

            Temporada {temporadaAtual}

          </p>


        </div>





        <PlayerStatsForm

          jogadorId={jogadorId}

          temporada={temporadaAtual}

          initialData={{

            gols: estatisticas?.gols,

            assistencias: estatisticas?.assistencias,

            jogos: estatisticas?.jogos,

          }}

        />


      </div>


    </main>

  )


}