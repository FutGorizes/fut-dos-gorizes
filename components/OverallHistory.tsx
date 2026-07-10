import {
  TrendingUp,
  TrendingDown,
  Trophy,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";


type OverallHistoryItem = {

  id:number;

  jogador_id:number;

  partida_id:number;

  overall_antes:number;

  overall_depois:number;

  nota_avaliacao:number;

  created_at:string;

};



export default function OverallHistory({

  history,

}: {

  history: OverallHistoryItem[];

}) {


  if(!history || history.length === 0){

    return (

      <Card className="border border-border bg-secondary/30">


        <CardHeader className="pb-3">


          <CardTitle className="flex items-center gap-2 text-lg font-black">

            📊 Histórico de Carreira

          </CardTitle>


        </CardHeader>


        <CardContent className="text-center text-sm text-muted-foreground">


          Nenhuma evolução registrada ainda.


        </CardContent>


      </Card>

    );

  }





  return (

    <Card className="border border-border bg-secondary/30">


      <CardHeader className="pb-3">


        <CardTitle className="flex items-center gap-2 text-lg font-black">


          <Trophy size={20} className="text-accent"/>


          Histórico de Carreira


        </CardTitle>


      </CardHeader>





      <CardContent className="space-y-4">



        {history.map((item)=>(


          <div

            key={item.id}

            className="rounded-lg bg-background p-4"

          >



            <div className="mb-3 flex items-center justify-between">


              <p className="text-sm font-bold">

                🏆 Partida #{item.partida_id}

              </p>


              <p className="text-xs text-muted-foreground">

                {new Date(item.created_at)

                  .toLocaleDateString("pt-BR")}

              </p>


            </div>







            <div className="flex items-center justify-center gap-3">


              <strong className="text-3xl font-black">

                {item.overall_antes}

              </strong>




              <span className="text-muted-foreground">

                →

              </span>





              <strong className="text-3xl font-black text-accent">

                {item.overall_depois}

              </strong>


            </div>







            <div className="mt-3 flex items-center justify-center gap-2 text-sm">


              <span>

                ⭐ Nota da comunidade:

              </span>


              <strong>

                {item.nota_avaliacao}

              </strong>


            </div>







            {item.overall_depois > item.overall_antes && (

              <div className="mt-2 flex justify-center gap-2 text-sm font-bold">

                <TrendingUp size={18}/>

                Evoluiu +

                {item.overall_depois - item.overall_antes}


              </div>

            )}






            {item.overall_depois < item.overall_antes && (

              <div className="mt-2 flex justify-center gap-2 text-sm font-bold">


                <TrendingDown size={18}/>


                Caiu

                {" "}

                {item.overall_antes - item.overall_depois}


              </div>

            )}




          </div>


        ))}



      </CardContent>



    </Card>

  );


}