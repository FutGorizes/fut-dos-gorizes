import { supabase } from "@/lib/supabase";


export type PlayerRatingHistory = {

  partidaId: number;

  data: string;

  local: string;

  nota: number;

};





export async function getPlayerRatingHistory(
  jogadorId: number
): Promise<PlayerRatingHistory[]> {



  const { data, error } = await supabase

    .from("avaliacoes_partidas")

    .select(`

      partida_id,

      chute,

      passe,

      drible,

      marcacao,

      fisico,

      partidas (

        data,

        local

      )

    `)

    .eq(
      "jogador_id",
      jogadorId
    );






  if(error){


    console.error(
      "Erro buscando histórico de avaliações:",
      error
    );


    return [];


  }






  if(!data){

    return [];

  }







  return data.map((avaliacao:any)=>{



    const nota = Math.round(

      (

        avaliacao.chute +

        avaliacao.passe +

        avaliacao.drible +

        avaliacao.marcacao +

        avaliacao.fisico

      )

      /

      5

    );






    const partida = avaliacao.partidas;



    const dataFormatada = partida?.data

      ? new Date(
          partida.data + "T12:00:00"
        )
        .toLocaleDateString(
          "pt-BR"
        )

      : "Data não informada";







    return {


      partidaId:
        avaliacao.partida_id,


      data:
        dataFormatada,


      local:
        partida?.local ?? "Local não informado",


      nota,


    };



  });


}