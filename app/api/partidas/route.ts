import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";


// LISTAR PARTIDAS
export async function GET() {

  const { data, error } = await supabase
    .from("partidas")
    .select("*")
    .order("data", {
      ascending: false,
    });


  if (error) {

    console.log("ERRO AO BUSCAR PARTIDAS:", error);

    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );

  }


  return NextResponse.json(data);

}



// CRIAR PARTIDA
export async function POST(
  request: NextRequest
) {

  try {

    const body = await request.json();


    console.log("Dados recebidos:", body);



    const { data, error } = await supabase
      .from("partidas")
      .insert(body)
      .select()
      .single();



    if (error) {

      console.log("ERRO SUPABASE:", error);


      return NextResponse.json(
        {
          error: error.message,
          details: error.details,
          hint: error.hint,
        },
        {
          status: 500,
        }
      );

    }



    return NextResponse.json(data);



  } catch (error: unknown) {

    const message = error instanceof Error ? error.message : "Erro inesperado";


    return NextResponse.json(
      {
        error: message,
      },
      {
        status: 500,
      }
    );


  }

}
