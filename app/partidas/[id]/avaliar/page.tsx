import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import {
  canPlayerRateMatch,
  getPlayersFromMatch,
  getRatedPlayers,
} from "@/services/ratingService";

import PlayerRatingCard from "@/components/PlayerRatingCard";



export default async function AvaliarPartidaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {


  const { id } = await params;


  const partidaId = Number(id);




  const supabase = await createClient();




  const {
    data:{
      user,
    },
  } = await supabase.auth.getUser();




  if(!user){

    redirect("/login");

  }







  const {
    data:jogador,
    error:jogadorError,

  } = await supabase

    .from("jogadores")

    .select(`

      id,

      nome

    `)

    .eq(
      "usuario_id",
      user.id
    )

    .single();







  if(
    jogadorError ||
    !jogador
  ){

    return (

      <div
        className="
          p-8
          text-white
        "
      >

        Jogador não encontrado.

      </div>

    );

  }








  const podeAvaliar =
    await canPlayerRateMatch(
      partidaId,
      jogador.id
    );







  if(!podeAvaliar){

    return (

      <div
        className="
          p-8
          text-white
        "
      >

        Você não participou dessa partida.

      </div>

    );

  }









  const jogadores =
    await getPlayersFromMatch(
      partidaId
    );






  const jogadoresAvaliados =
    await getRatedPlayers(
      partidaId,
      jogador.id
    );









  return (

    <div
      className="
        p-8
        space-y-6
      "
    >



      <h1
        className="
          text-3xl
          font-bold
          text-white
        "
      >

        Avaliar jogadores

      </h1>






      <p
        className="
          text-zinc-400
        "
      >

        Dê notas aos jogadores que participaram da partida.

      </p>







      <div
        className="
          grid
          gap-5
        "
      >



        {
          jogadores.map(
            (item:any)=>(


              <PlayerRatingCard

                key={
                  item.jogador_id
                }



                jogador={
                  item.jogadores
                }




                partidaId={
                  partidaId
                }




                avaliadorId={
                  jogador.id
                }





                jaAvaliado={
                  jogadoresAvaliados.includes(
                    item.jogador_id
                  )
                }


              />


            )
          )
        }



      </div>



    </div>

  );


}