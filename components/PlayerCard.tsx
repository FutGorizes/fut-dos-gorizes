import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

import {
  User,
  Trophy,
  Goal,
  Target,
  Dumbbell,
  Pencil,
  Shield,
  CircleDot,
} from "lucide-react";

import type { Player } from "@/types/player";


function PlayerStat({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Goal;
  label: string;
  value: number;
}) {
  return (
    <div className="grid gap-2">

      <div className="flex justify-between">

        <span className="flex items-center gap-2">

          <Icon size={18} />

          {label}

        </span>


        <strong className="text-foreground">
          {value}
        </strong>

      </div>


      <Progress
        value={value}
        className="[&_[data-slot=progress-indicator]]:bg-accent"
      />

    </div>
  );
}



export default function PlayerCard({
  player,
  isAdmin = false,
}: {
  player: Player & {
    posicao?: string;
    posicao_secundaria?: string;
  };

  isAdmin?: boolean;

}) {

  return (

    <Card className="w-full max-w-sm cursor-pointer border-border/80 bg-card transition-all duration-200 hover:-translate-y-1 hover:border-accent/60 hover:shadow-lg hover:shadow-black/10">

      <CardContent className="p-6">


        <Link href={`/jogadores/${player.id}`}>

          <div className="flex items-center justify-between">

            <Avatar className="size-16 rounded-lg after:rounded-lg">

              {player.foto_url ? (

                <AvatarImage
                  src={player.foto_url}
                  alt={player.nome}
                  className="rounded-lg"
                />

              ) : (

                <AvatarFallback className="rounded-lg bg-secondary text-foreground">

                  <User size={30} />

                </AvatarFallback>

              )}

            </Avatar>



            <Badge className="h-8 gap-2 rounded-lg bg-accent px-3 text-sm font-black text-accent-foreground hover:bg-accent">

              <Trophy size={18} />

              {player.overall}

            </Badge>


          </div>




          <h2 className="mt-5 text-center text-2xl font-black">

            {player.nome}

          </h2>




          <div className="mt-3 flex justify-center gap-2">

            <Badge variant="outline">

              {player.posicao || "-"}

            </Badge>


            <Badge variant="outline">

              {player.posicao_secundaria || "-"}

            </Badge>


          </div>





          <div className="mt-8 space-y-5 text-sm text-muted-foreground">


            <PlayerStat
              icon={Goal}
              label="Chute"
              value={player.chute}
            />



            <PlayerStat
              icon={Target}
              label="Passe"
              value={player.passe}
            />



            <PlayerStat
              icon={CircleDot}
              label="Drible"
              value={player.drible}
            />



            <PlayerStat
              icon={Shield}
              label="Marcação"
              value={player.marcacao}
            />



            <PlayerStat
              icon={Dumbbell}
              label="Físico"
              value={player.fisico}
            />


          </div>


        </Link>




        {isAdmin && (

          <div className="mt-8 flex justify-center">

            <Button
              variant="secondary"
              render={<Link href={`/jogadores/${player.id}/editar`} />}
              className="h-10 px-4"
            >

              <Pencil size={18} />

              Editar jogador

            </Button>


          </div>

        )}


      </CardContent>


    </Card>

  );

}