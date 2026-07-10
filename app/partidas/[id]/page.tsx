import Link from "next/link";

import {
  CalendarDays,
  Clock,
  Pencil,
  ShieldCheck,
  Star,
  UsersRound,
  Wallet,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import DeleteGameButton from "@/components/DeleteGameButton";
import ConfirmPresenceButton from "@/components/ConfirmPresenceButton";

import { createClient } from "@/lib/supabase-server";


export const dynamic = "force-dynamic";


type Presenca = {

  id:number;

  jogadores: {

    nome:string;

    overall:number | null;

    posicao:string | null;

    posicao_secundaria:string | null;

  };

};







export default async function PartidaDetalhes({

  params,

}: {

  params: Promise<{ id:string }>;

}) {


  const { id } = await params;


  const partidaId = Number(id);


  const supabase = await createClient();





  if(isNaN(partidaId)){


    return (

      <main className="app-page">

        Partida inválida

      </main>

    );

  }







  const {

    data:partida,

    error

  } = await supabase

    .from("partidas")

    .select("*")

    .eq(

      "id",

      partidaId

    )

    .single();







  if(error || !partida){


    return (

      <main className="app-page">

        Partida não encontrada

      </main>

    );

  }







  const {

    data:presencas

  } = await supabase

    .from("presencas")

    .select(`

      id,

      jogador_id,

      jogadores (

        id,

        nome,

        overall,

        posicao,

        posicao_secundaria

      )

    `)

    .eq(

      "partida_id",

      partidaId

    );








  const {

    data:{
      user
    }

  } = await supabase.auth.getUser();






  let jaConfirmado = false;


  let jogadorIdLogado:number | null = null;


  let podeAvaliarPartida = false;
    if(user){


    const {

      data:jogador

    } = await supabase

      .from("jogadores")

      .select("id")

      .eq(

        "usuario_id",

        user.id

      )

      .maybeSingle();







    if(jogador){


      jogadorIdLogado = jogador.id;





      const {

        data:minhaPresenca

      } = await supabase

        .from("presencas")

        .select("id")

        .eq(

          "partida_id",

          partidaId

        )

        .eq(

          "jogador_id",

          jogador.id

        )

        .maybeSingle();







      jaConfirmado = !!minhaPresenca;



    }


  }












  // Libera avaliação 1 hora após o início da partida

  if(jogadorIdLogado){


    const inicioPartida = new Date(

      `${partida.data}T${partida.hora}`

    );




    const liberaAvaliacao = new Date(

      inicioPartida.getTime()

      +

      60 * 60 * 1000

    );





    const agora = new Date();





    if(agora >= liberaAvaliacao){



      const {

        data:participou

      } = await supabase

        .from("presencas")

        .select("id")

        .eq(

          "partida_id",

          partidaId

        )

        .eq(

          "jogador_id",

          jogadorIdLogado

        )

        .maybeSingle();






      podeAvaliarPartida = !!participou;



    }


  }














  return (

    <main className="app-page">


      <Card className="surface-card mx-auto max-w-xl">



        <CardHeader className="items-center text-center">

        <div className="flex items-center justify-center gap-3">

          <span className="icon-tile">

            <ShieldCheck size={20} />

          </span>



          <div>

            <p className="page-kicker text-center">

              Detalhes

            </p>


            <CardTitle className="text-center text-4xl font-black">

              Partida

            </CardTitle>


          </div>


        </div>

        </CardHeader>





        <CardContent className="space-y-8">







        <div className="text-center space-y-5">



          <p className="flex items-center justify-center gap-2 text-lg text-muted-foreground">

            <CalendarDays size={18} className="text-accent" />


            {

              partida.data

              .split("-")

              .reverse()

              .join("/")

            }


          </p>








          <p className="flex items-center justify-center gap-2 text-lg text-muted-foreground">


            <Clock size={18} className="text-accent" />

            Horário: {partida.hora || "Não informado"}


          </p>
          



          {
            partida.valor_goleiro

            &&

            (

              <div className="mt-4 rounded-lg border border-accent/30 bg-secondary/70 p-4 text-left">


                <h2 className="mb-2 flex items-center gap-2 text-xl font-black">


                  <Wallet size={20} className="text-accent" />


                  Pagamento do goleiro


                </h2>





                <p>

                  Valor: R$ {partida.valor_goleiro}

                </p>





                {

                  partida.pix_goleiro

                  &&

                  (

                    <p>

                      Pix: {partida.pix_goleiro}

                    </p>

                  )

                }



              </div>

            )

          }









          <div>


            <p className="text-2xl font-black">

              {partida.time_a}

            </p>





            <p className="my-4 rounded-lg border border-border bg-secondary/70 py-4 text-5xl font-black">


              {partida.gols_a} x {partida.gols_b}


            </p>





            <p className="text-2xl font-black">

              {partida.time_b}

            </p>


          </div>


        </div>









        <div>


          <ConfirmPresenceButton

            partidaId={partida.id}

            jaConfirmado={jaConfirmado}

          />


        </div>









        {
          podeAvaliarPartida && (

            <div>


              <Button

                className="

                  h-12

                  w-full

                  bg-accent

                  text-accent-foreground

                  font-black

                "

                render={

                  <Link

                    href={`/partidas/${partida.id}/avaliar`}

                    className="flex h-full w-full items-center justify-center gap-2"

                  />

                }

              >


                <Star size={20}/>


                Avaliar jogadores


              </Button>


            </div>

          )
        }









        <Separator />





        <div>



          <h2 className="mb-4 flex items-center gap-2 text-2xl font-black">


            <UsersRound size={22} />


            Confirmados


            <Badge variant="secondary" className="rounded-lg">


              {presencas?.length ?? 0}/14


            </Badge>


          </h2>









          <div className="space-y-3">



            {

              (presencas as Presenca[] | null)?.map((presenca)=>(


                <Card

                  key={presenca.id}

                  className="bg-secondary/60"

                >

                  <CardContent className="p-4">



                    <p className="flex items-center gap-2 text-lg font-black">


                      <ShieldCheck size={18} className="text-accent" />


                      {presenca.jogadores.nome}


                    </p>





                    <p className="mt-2 flex items-center gap-2 text-muted-foreground">


                      <Star size={16} className="text-accent" />


                      Overall: {presenca.jogadores.overall ?? 0}


                    </p>





                    <p className="text-muted-foreground">


                      {presenca.jogadores.posicao ?? "Sem posição"}


                      {


                        presenca.jogadores.posicao_secundaria

                        &&

                        ` | ${presenca.jogadores.posicao_secundaria}`


                      }


                    </p>



                  </CardContent>

                </Card>


              ))

            }



          </div>


        </div>









        <Separator />





        <div className="flex flex-col gap-3 sm:flex-row">



          <Button

            className="h-10 flex-1"

            render={

              <Link

                href={`/partidas/${partida.id}/editar`}

                className="flex h-full w-full items-center justify-center"

              />

            }

          >

            <Pencil size={18} />


            Editar


          </Button>







          <div className="flex-1">


            <DeleteGameButton

              id={partida.id}

            />


          </div>





        </div>







        </CardContent>

      </Card>


    </main>

  );


}