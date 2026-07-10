import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";


// LISTAR JOGADORES
export async function GET() {

  const { data, error } = await supabase
    .from("jogadores")
    .select("*");


  if (error) {

    return NextResponse.json(
      {
        error: error.message
      },
      {
        status: 500
      }
    );

  }


  return NextResponse.json(data);

}



// CRIAR JOGADOR
export async function POST(
  request: NextRequest
) {

  try {

    const body = await request.json();


    const { data, error } = await supabase
      .from("jogadores")
      .insert(body)
      .select()
      .single();



    if (error) {

      console.log("ERRO AO INSERIR:", error);

      return NextResponse.json(
        {
          error: error.message,
          details: error.details,
          hint: error.hint
        },
        {
          status: 500
        }
      );

    }



    return NextResponse.json(data);



  } catch (error: unknown) {

    const message = error instanceof Error ? error.message : "Erro inesperado";


    return NextResponse.json(
      {
        error: message
      },
      {
        status: 500
      }
    );


  }

}
