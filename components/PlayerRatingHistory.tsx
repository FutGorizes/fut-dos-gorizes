import {
  Star,
  CalendarDays,
  MapPin,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";



import type { PlayerRatingHistory } from "@/services/playerHistoryService";





type Props = {

  history: PlayerRatingHistory[];

};





export default function PlayerRatingHistory({

  history,

}: Props) {



  if(history.length === 0){

    return null;

  }






  return (

    <Card className="border border-border bg-secondary/30">


      <CardHeader className="pb-3">


        <CardTitle className="flex items-center gap-2 text-lg font-black">


          <Star size={20} className="text-accent" />


          Histórico de Avaliações


        </CardTitle>


      </CardHeader>







      <CardContent className="space-y-4">



        {history.map((item)=> (


          <div

            key={item.partidaId}

            className="rounded-lg bg-background p-4"


          >



            <div className="flex items-center justify-between">


              <div className="space-y-1">



                <p className="flex items-center gap-2 text-sm font-bold">


                  <CalendarDays

                    size={16}

                    className="text-accent"

                  />


                  {item.data}


                </p>






                <p className="flex items-center gap-2 text-sm text-muted-foreground">


                  <MapPin

                    size={16}

                    className="text-accent"

                  />


                  {item.local}


                </p>



              </div>







              <div className="text-center">


                <div className="text-3xl font-black text-accent">


                  {item.nota}


                </div>



                <p className="text-xs text-muted-foreground">


                  Nota


                </p>



              </div>





            </div>



          </div>


        ))}



      </CardContent>


    </Card>


  );

}