import { supabase } from "@/lib/supabase";


export type PlayerRatingAverage = {

  chute: number;

  passe: number;

  drible: number;

  marcacao: number;

  fisico: number;

  jogosAvaliados: number;

  notaGeral: number;

};





export async function getPlayerRatingAverage(
  jogadorId: number
): Promise<PlayerRatingAverage | null> {


  const { data, error } = await supabase

    .from("avaliacoes_partidas")

    .select(`

      chute,

      passe,

      drible,

      marcacao,

      fisico

    `)

    .eq(
      "jogador_id",
      jogadorId
    );





  if (error) {


    console.error(
      "Erro buscando avaliações do jogador:",
      error
    );


    return null;


  }





  if (!data || data.length === 0) {


    return null;


  }







  const total = data.length;






  const soma = data.reduce(


    (acc, item) => {


      acc.chute += item.chute ?? 0;

      acc.passe += item.passe ?? 0;

      acc.drible += item.drible ?? 0;

      acc.marcacao += item.marcacao ?? 0;

      acc.fisico += item.fisico ?? 0;



      return acc;


    },


    {


      chute: 0,

      passe: 0,

      drible: 0,

      marcacao: 0,

      fisico: 0,


    }


  );









  const chute = Math.round(

    soma.chute / total

  );





  const passe = Math.round(

    soma.passe / total

  );





  const drible = Math.round(

    soma.drible / total

  );





  const marcacao = Math.round(

    soma.marcacao / total

  );





  const fisico = Math.round(

    soma.fisico / total

  );









  const notaGeral = Math.round(

    (

      chute +

      passe +

      drible +

      marcacao +

      fisico


    )

    /

    5


  );









  return {


    chute,

    passe,

    drible,

    marcacao,

    fisico,


    jogosAvaliados: total,


    notaGeral,


  };


}