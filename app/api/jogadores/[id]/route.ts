import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentPlayer } from "@/lib/supabase/auth";


// ===============================
// BUSCAR JOGADOR POR ID
// ===============================

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const jogadorId = Number(id);

    if (isNaN(jogadorId)) {
      return NextResponse.json(
        { error: "ID inválido" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("jogadores")
      .select("*")
      .eq("id", jogadorId)
      .single();


    if (error) {
      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 400,
        }
      );
    }


    return NextResponse.json(data);


  } catch (err: any) {

    console.error("🔥 Erro GET:", err);

    return NextResponse.json(
      {
        error: err.message,
      },
      {
        status: 500,
      }
    );

  }
}



// ===============================
// EDITAR JOGADOR
// ===============================

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {

    const { id } = await params;

    const jogadorId = Number(id);


    if (isNaN(jogadorId)) {

      return NextResponse.json(
        {
          error: "ID inválido",
        },
        {
          status: 400,
        }
      );

    }


    const jogadorLogado = await getCurrentPlayer();


    if (!jogadorLogado) {

      return NextResponse.json(
        {
          error: "Usuário não autenticado",
        },
        {
          status: 401,
        }
      );

    }



    const supabase = await createClient();



    const { data: jogadorAlvo } = await supabase
      .from("jogadores")
      .select("usuario_id")
      .eq("id", jogadorId)
      .single();



    if (!jogadorAlvo) {

      return NextResponse.json(
        {
          error: "Jogador não encontrado",
        },
        {
          status: 404,
        }
      );

    }



    const podeEditar =
      jogadorLogado.admin ||
      jogadorLogado.usuario_id === jogadorAlvo.usuario_id;



    if (!podeEditar) {

      return NextResponse.json(
        {
          error: "Sem permissão",
        },
        {
          status: 403,
        }
      );

    }



    const body = await request.json();



    const { data, error } = await supabase
      .from("jogadores")
      .update(body)
      .eq("id", jogadorId)
      .select()
      .single();



    if (error) {

      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 400,
        }
      );

    }



    return NextResponse.json(data);



  } catch (err: any) {

    console.error("🔥 Erro PUT:", err);


    return NextResponse.json(
      {
        error: err.message,
      },
      {
        status: 500,
      }
    );

  }

}




// ===============================
// EXCLUIR JOGADOR
// ===============================

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {

  try {


    const { id } = await params;

    const jogadorId = Number(id);



    if (isNaN(jogadorId)) {

      return NextResponse.json(
        {
          error: "ID inválido",
        },
        {
          status: 400,
        }
      );

    }



    const jogadorLogado = await getCurrentPlayer();



    if (!jogadorLogado) {

      return NextResponse.json(
        {
          error: "Usuário não autenticado",
        },
        {
          status: 401,
        }
      );

    }



    const supabase = await createClient();



    const { data: jogadorAlvo } = await supabase
      .from("jogadores")
      .select("usuario_id")
      .eq("id", jogadorId)
      .single();



    if (!jogadorAlvo) {

      return NextResponse.json(
        {
          error: "Jogador não encontrado",
        },
        {
          status: 404,
        }
      );

    }



    const podeExcluir =
      jogadorLogado.admin ||
      jogadorLogado.usuario_id === jogadorAlvo.usuario_id;



    if (!podeExcluir) {

      return NextResponse.json(
        {
          error: "Sem permissão",
        },
        {
          status: 403,
        }
      );

    }



    const { data, error } = await supabase
      .from("jogadores")
      .delete()
      .eq("id", jogadorId)
      .select();



    if (error) {

      return NextResponse.json(
        {
          error: error.message,
        },
        {
          status: 400,
        }
      );

    }



    return NextResponse.json({

      message:
        "Jogador deletado com sucesso!",

      jogador: data,

    });



  } catch (err: any) {

    console.error("🔥 Erro DELETE:", err);


    return NextResponse.json(
      {
        error: err.message,
      },
      {
        status: 500,
      }
    );

  }

}