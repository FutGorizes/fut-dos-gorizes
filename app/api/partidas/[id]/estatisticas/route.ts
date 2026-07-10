import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase-server";



// Verifica se a partida terminou
async function verificarPartidaConcluida(
  partida_id:number
){

  const supabase = await createClient();


  const {
    data:partida,
    error
  } = await supabase

    .from("partidas")

    .select(
      "data, hora"
    )

    .eq(
      "id",
      partida_id
    )

    .single();



  if(error || !partida){

    return false;

  }



  const inicioPartida = new Date(
    `${partida.data}T${partida.hora}`
  );


  const fimPartida = new Date(

    inicioPartida.getTime()

    +

    60 * 60 * 1000

  );



  return new Date() >= fimPartida;

}





// GET - Buscar estatísticas da partida
export async function GET(
  request:NextRequest,
  {
    params
  }:{
    params:Promise<{
      id:string
    }>
  }
){

  const {
    id
  } = await params;


  const partidaId = Number(id);



  const supabase = await createClient();



  const {
    data,
    error
  } = await supabase

    .from("estatisticas_partidas")

    .select(`

      id,

      jogador_id,

      gols,

      assistencias,

      jogadores (

        nome,

        foto_url

      )

    `)

    .eq(
      "partida_id",
      partidaId
    );




  if(error){

    return NextResponse.json(

      {
        message:error.message
      },

      {
        status:500
      }

    );

  }



  return NextResponse.json(data);


}







// POST - Salvar estatísticas da partida
export async function POST(
  request:NextRequest,
  {
    params
  }:{
    params:Promise<{
      id:string
    }>
  }
){

  const {
    id
  } = await params;



  const partidaId = Number(id);



  const supabase = await createClient();




  // Verifica autenticação

  const authHeader =
    request.headers.get(
      "Authorization"
    );



  if(!authHeader){

    return NextResponse.json(

      {
        message:"Token não enviado"
      },

      {
        status:401
      }

    );

  }



  const token =
    authHeader.replace(
      "Bearer ",
      ""
    );




  const {

    data:{
      user
    },

    error:userError

  } = await supabase.auth.getUser(token);





  if(userError || !user){

    return NextResponse.json(

      {
        message:"Usuário não autenticado"
      },

      {
        status:401
      }

    );

  }






  // Busca jogador ADM

  const {

    data:jogador

  } = await supabase

    .from("jogadores")

    .select(
      "id, admin"
    )

    .eq(
      "usuario_id",
      user.id
    )

    .single();






  if(!jogador || jogador.admin !== true){


    return NextResponse.json(

      {
        message:"Apenas administradores podem registrar estatísticas"
      },

      {
        status:403
      }

    );

  }





  const concluida =
    await verificarPartidaConcluida(
      partidaId
    );




  if(!concluida){


    return NextResponse.json(

      {
        message:"A partida ainda não foi concluída"
      },

      {
        status:400
      }

    );

  }







  const body = await request.json();



  const jogadores =
    body.jogadores;





  if(!Array.isArray(jogadores)){


    return NextResponse.json(

      {
        message:"Dados inválidos"
      },

      {
        status:400
      }

    );

  }








  // Remove estatísticas antigas dessa partida

  const {
    error:deleteError
  } = await supabase

    .from("estatisticas_partidas")

    .delete()

    .eq(
      "partida_id",
      partidaId
    );




  if(deleteError){


    return NextResponse.json(

      {
        message:deleteError.message
      },

      {
        status:500
      }

    );

  }






  const temporada =
    new Date().getFullYear();






  // Insere nova súmula

  const registros = jogadores.map(

    (j:any)=>({

      partida_id:partidaId,

      jogador_id:j.jogador_id,

      gols:j.gols ?? 0,

      assistencias:j.assistencias ?? 0,

      temporada

    })

  );





  const {

    error:insertError

  } = await supabase

    .from("estatisticas_partidas")

    .insert(registros);






  if(insertError){


    return NextResponse.json(

      {
        message:insertError.message
      },

      {
        status:500
      }

    );

  }







  // Recalcula estatísticas gerais

  const jogadoresIds =
    jogadores.map(
      (j:any)=>j.jogador_id
    );






  for(const jogadorId of jogadoresIds){


    const {

      data:partidasJogador

    } = await supabase

      .from("estatisticas_partidas")

      .select(
        "gols, assistencias"
      )

      .eq(
        "jogador_id",
        jogadorId
      )

      .eq(
        "temporada",
        temporada
      );






    const gols =
      partidasJogador?.reduce(

        (total,p)=>
          total + (p.gols ?? 0),

        0

      ) ?? 0;






    const assistencias =
      partidasJogador?.reduce(

        (total,p)=>
          total + (p.assistencias ?? 0),

        0

      ) ?? 0;






    const jogos =
      partidasJogador?.length ?? 0;






    await supabase

      .from("estatisticas_jogadores")

      .upsert({

        jogador_id:jogadorId,

        temporada,

        gols,

        assistencias,

        jogos

      },

      {

        onConflict:
          "jogador_id,temporada"

      });


  }







  return NextResponse.json(

    {
      message:"Estatísticas registradas com sucesso"
    }

  );


}