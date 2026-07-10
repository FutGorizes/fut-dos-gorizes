import Link from "next/link";

import {
  Dumbbell,
  Goal,
  Pencil,
  Shield,
  Star,
  Target,
  UserRound,
  CircleDot,
  Trophy,
  Handshake,
  CalendarDays,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import { getPlayerRatingAverage } from "@/services/playerRatingService";
import { getPlayerRatingHistory } from "@/services/playerHistoryService";
import { calculateOverallEvolution } from "@/services/overallService";
import { getOverallHistory } from "@/services/overallHistoryService";

import PlayerRatingHistory from "@/components/PlayerRatingHistory";
import OverallHistory from "@/components/OverallHistory";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Progress } from "@/components/ui/progress";

import DeletePlayerButton from "@/components/DeletePlayerButton";





export default async function PerfilJogador({

  params,

}: {

  params: Promise<{ id:string }>;

}) {



  const { id } = await params;


  const jogadorId = Number(id);





  if(isNaN(jogadorId)){


    return (

      <main className="app-page">

        Jogador inválido

      </main>

    );

  }







  const {

    data: player,

    error,

  } = await supabase

    .from("jogadores")

    .select("*")

    .eq("id", jogadorId)

    .single();







  if(error || !player){


    return (

      <main className="app-page">

        Jogador não encontrado

      </main>

    );

  }









  const temporadaAtual =

    new Date().getFullYear();









  const { data: estatisticas } =

    await supabase

    .from("estatisticas_jogadores")

    .select("*")

    .eq(

      "jogador_id",

      jogadorId

    )

    .eq(

      "temporada",

      temporadaAtual

    )

    .maybeSingle();








  const avaliacaoComunidade =

    await getPlayerRatingAverage(

      jogadorId

    );








  const historicoAvaliacoes =

    await getPlayerRatingHistory(

      jogadorId

    );








  const historicoOverall =

    await getOverallHistory(

      jogadorId

    );








  const evolucaoOverall =

    avaliacaoComunidade

      ? calculateOverallEvolution(

          player.overall,

          avaliacaoComunidade.notaGeral,

          avaliacaoComunidade.jogosAvaliados

        )

      : null;
        const {

    data:{ user },

  } = await supabase.auth.getUser();








  let isAdmin = false;








  if(user){


    const {data:jogadorLogado} =

      await supabase

      .from("jogadores")

      .select("admin")

      .eq(

        "usuario_id",

        user.id

      )

      .single();






    if(jogadorLogado?.admin){

      isAdmin = true;

    }


  }








  return (

    <main className="app-page">


      <Card className="surface-card mx-auto max-w-xl">


        <CardHeader className="items-center text-center">

          <Avatar className="mb-2 size-32 rounded-lg after:rounded-lg">


            {player.foto_url ? (

              <AvatarImage

                src={player.foto_url}

                alt={player.nome}

                className="rounded-lg"

              />

            ) : (

              <AvatarFallback className="rounded-lg bg-secondary text-muted-foreground">

                <UserRound size={44}/>

              </AvatarFallback>

            )}


          </Avatar>







          <CardTitle className="font-heading text-4xl font-black">

            {player.nome}

          </CardTitle>







          <Badge className="mt-2 h-8 gap-2 rounded-lg bg-accent px-3 text-sm font-black text-accent-foreground">


            <Star size={16}/>


            Overall {player.overall}


          </Badge>







          <div className="mt-4 flex justify-center gap-2">


            {player.posicao && (

              <Badge variant="secondary">

                {player.posicao}

              </Badge>

            )}





            {player.posicao_secundaria && (

              <Badge variant="secondary">

                {player.posicao_secundaria}

              </Badge>

            )}


          </div>





        </CardHeader>









        <CardContent className="space-y-6">







          {avaliacaoComunidade && (

            <Card className="border border-border bg-secondary/30">


              <CardHeader className="pb-3">


                <CardTitle className="flex items-center gap-2 text-lg font-black">


                  <Star size={20} className="text-accent"/>


                  Avaliação da Comunidade


                </CardTitle>


              </CardHeader>





              <CardContent className="text-center">


                <div className="text-5xl font-black text-accent">

                  {avaliacaoComunidade.notaGeral}

                </div>





                <p className="mt-2 text-sm text-muted-foreground">

                  Baseado em {avaliacaoComunidade.jogosAvaliados} avaliações

                </p>


              </CardContent>



            </Card>

          )}









          {evolucaoOverall && (

            <Card className="border border-border bg-secondary/30">


              <CardHeader className="pb-3">


                <CardTitle className="flex items-center gap-2 text-lg font-black">


                  📈 Evolução da Partida


                </CardTitle>


              </CardHeader>








              <CardContent className="space-y-4 text-center">



                {!evolucaoOverall.podeEvoluir ? (

                  <div className="rounded-lg bg-background p-6">


                    <p className="text-sm text-muted-foreground">


                      Aguardando mais avaliações para calcular evolução.


                    </p>


                    <p className="mt-2 text-xs text-muted-foreground">


                      Necessário: 3 avaliações


                    </p>


                  </div>


                ) : (

                  <>





                    <div>


                      <p className="text-xs text-muted-foreground">

                        Overall antes

                      </p>


                      <strong className="text-4xl font-black">

                        {evolucaoOverall.overallAntes}

                      </strong>


                    </div>





                    <div className="rounded-lg bg-background p-4">


                      <p className="text-xs text-muted-foreground">

                        Nota comunidade

                      </p>


                      <strong className="text-4xl font-black text-accent">

                        {evolucaoOverall.notaComunidade} ⭐

                      </strong>


                      <p className="mt-1 text-sm">

                        Média de {evolucaoOverall.jogosAvaliados} avaliações

                      </p>


                    </div>
                                        <div>


                      <p className="text-xs text-muted-foreground">

                        Overall depois

                      </p>


                      <strong className="text-4xl font-black">

                        {evolucaoOverall.overallDepois}

                      </strong>





                      <p className="mt-1 text-sm font-bold">



                        {evolucaoOverall.variacao > 0 && "⬆️"}

                        {evolucaoOverall.variacao < 0 && "⬇️"}

                        {" "}

                        {Math.abs(evolucaoOverall.variacao)}



                      </p>


                    </div>



                  </>

                )}



              </CardContent>



            </Card>

          )}









          <PlayerRatingHistory

            history={historicoAvaliacoes}

          />









          <OverallHistory

            history={historicoOverall}

          />










          <Card className="border border-border bg-secondary/30">


            <CardHeader className="pb-3">


              <CardTitle className="flex items-center gap-2 text-lg font-black">


                <Trophy size={20} className="text-accent"/>


                Temporada {temporadaAtual}


              </CardTitle>


            </CardHeader>








            <CardContent className="grid grid-cols-3 gap-3">



              <div className="rounded-lg bg-background p-3 text-center">


                <Goal

                  size={20}

                  className="mx-auto mb-1 text-accent"

                />


                <p className="text-xs text-muted-foreground">

                  Gols

                </p>


                <strong className="text-xl font-black">

                  {estatisticas?.gols ?? 0}

                </strong>


              </div>






              <div className="rounded-lg bg-background p-3 text-center">


                <Handshake

                  size={20}

                  className="mx-auto mb-1 text-accent"

                />


                <p className="text-xs text-muted-foreground">

                  Assistências

                </p>


                <strong className="text-xl font-black">

                  {estatisticas?.assistencias ?? 0}

                </strong>


              </div>








              <div className="rounded-lg bg-background p-3 text-center">


                <CalendarDays

                  size={20}

                  className="mx-auto mb-1 text-accent"

                />


                <p className="text-xs text-muted-foreground">

                  Jogos

                </p>


                <strong className="text-xl font-black">

                  {estatisticas?.jogos ?? 0}

                </strong>


              </div>


            </CardContent>


          </Card>









          <div className="space-y-4 text-sm text-muted-foreground">



            {[

              {

                nome:"Chute",

                valor:player.chute,

                icon:<Goal size={18} className="text-accent"/>

              },


              {

                nome:"Passe",

                valor:player.passe,

                icon:<Target size={18} className="text-accent"/>

              },


              {

                nome:"Drible",

                valor:player.drible,

                icon:<CircleDot size={18} className="text-accent"/>

              },


              {

                nome:"Marcação",

                valor:player.marcacao,

                icon:<Shield size={18} className="text-accent"/>

              },


              {

                nome:"Físico",

                valor:player.fisico,

                icon:<Dumbbell size={18} className="text-accent"/>

              },


            ].map((atributo)=>(


              <div

                key={atributo.nome}

                className="grid gap-2"

              >


                <p className="flex items-center justify-between gap-2">


                  <span className="inline-flex items-center gap-2">


                    {atributo.icon}


                    {atributo.nome}


                  </span>



                  <strong className="text-foreground">


                    {atributo.valor}


                  </strong>


                </p>







                <Progress

                  value={atributo.valor}

                  className="[&_[data-slot=progress-indicator]]:bg-accent"

                />


              </div>


            ))}





          </div>









          {isAdmin && (


            <div className="flex flex-col gap-3 pt-2 sm:flex-row">





              <Button

                render={

                  <Link href={`/jogadores/${player.id}/editar`} />

                }

                className="h-10 flex-1"

              >


                <Pencil size={18}/>


                Editar jogador


              </Button>









              <Button

                render={

                  <Link href={`/jogadores/${player.id}/estatisticas`} />

                }

                variant="secondary"

                className="h-10 flex-1"

              >


                <Trophy size={18}/>


                Estatísticas


              </Button>









              <DeletePlayerButton

                id={player.id}

              />



            </div>


          )}









        </CardContent>


      </Card>


    </main>


  );


}