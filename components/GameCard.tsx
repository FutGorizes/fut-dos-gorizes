"use client";

import Link from "next/link";
import { CalendarDays, Eye, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Game {
  id: number;
  data: string;
  local: string;
  time_a: string;
  time_b: string;
  gols_a: number;
  gols_b: number;
}

export default function GameCard({ game }: { game: Game }) {
  return (
    <Card className="w-full max-w-sm border-border/80 bg-card transition-all duration-200 hover:-translate-y-1 hover:border-accent/60 hover:shadow-lg hover:shadow-black/10">
      <CardHeader>
        <CardTitle className="text-lg font-black">Partida</CardTitle>
        <CardAction>
          <Badge variant="secondary" className="rounded-lg font-bold text-muted-foreground">
            #{game.id}
          </Badge>
        </CardAction>
      </CardHeader>

      <CardContent className="space-y-5">
        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarDays size={16} className="text-accent" />
          {game.data.split("-").reverse().join("/")}
        </p>

        <p className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin size={16} className="text-accent" />
          {game.local}
        </p>

        <div className="text-center">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <p className="truncate text-right text-base font-bold">
              {game.time_a}
            </p>
            <p className="text-sm font-black text-muted-foreground">X</p>
            <p className="truncate text-left text-base font-bold">
              {game.time_b}
            </p>
          </div>

          <p className="my-4 rounded-lg border border-border bg-secondary/60 py-4 text-4xl font-black">
            {game.gols_a} x {game.gols_b}
          </p>
        </div>

        <Button
          render={<Link href={`/partidas/${game.id}`} />}
          className="h-10 w-full font-bold"
        >
          <Eye size={16} />
          Ver
        </Button>
      </CardContent>
    </Card>
  );
}
