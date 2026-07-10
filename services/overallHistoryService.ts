import { supabase } from "@/lib/supabase";



export type OverallHistory = {

  id:number;

  jogador_id:number;

  partida_id:number;

  overall_antes:number;

  overall_depois:number;

  nota_avaliacao:number;

  created_at:string;

};






export async function saveOverallHistory(

  jogadorId:number,

  partidaId:number,

  overallAntes:number,

  overallDepois:number,

  notaAvaliacao:number

){


  const { data, error } = await supabase

    .from("historico_overall")

    .insert({

      jogador_id:jogadorId,

      partida_id:partidaId,

      overall_antes:overallAntes,

      overall_depois:overallDepois,

      nota_avaliacao:notaAvaliacao

    })

    .select()

    .single();





  if(error){

    console.error(
      "Erro ao salvar histórico de overall:",
      error
    );

    return null;

  }





  return data;

}









export async function getOverallHistory(

  jogadorId:number

):Promise<OverallHistory[]> {



  const {data,error}=

    await supabase

    .from("historico_overall")

    .select("*")

    .eq(

      "jogador_id",

      jogadorId

    )

    .order(

      "created_at",

      {

        ascending:false

      }

    );





  if(error){

    console.error(
      "Erro buscando histórico:",
      error
    );

    return [];

  }





  return data ?? [];

}