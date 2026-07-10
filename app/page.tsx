import type { ComponentType } from "react";
import Image from "next/image";
import {
  Dumbbell,
  Goal,
  Target,
  Trophy,
  UsersRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";


function StatCard({
  icon: Icon,
  label,
  name,
  score,
}: {
  icon: ComponentType<{ size?: number; className?: string }>;
  label: string;
  name: string | number;
  score?: number | null;
}) {
  return (
    <Card className="surface-card min-h-36">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <p className="page-kicker">{label}</p>
            <p className="mt-3 text-2xl font-bold leading-tight tracking-normal text-foreground break-words">
              {name}
            </p>
          </div>

          <span className="icon-tile size-9">
            <Icon className="size-5" />
          </span>
        </div>

        {score != null && (
          <Badge className="mt-4 rounded-lg bg-accent px-3 py-1 text-sm font-bold text-accent-foreground hover:bg-accent">
            {score} pts
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}


export default async function Home() {
  const { data: players, error } = await supabase
    .from("jogadores")
    .select("*");

  if (error) {
    console.log("Erro ao buscar jogadores:", error);
  }

  const totalJogadores = players?.length ?? 0;

  const melhorOverall = players?.length
    ? players.reduce((a, b) => (a.overall > b.overall ? a : b))
    : null;

  const maiorChute = players?.length
    ? players.reduce((a, b) => (a.chute > b.chute ? a : b))
    : null;

  const melhorPasse = players?.length
    ? players.reduce((a, b) => (a.passe > b.passe ? a : b))
    : null;

  const melhorFisico = players?.length
    ? players.reduce((a, b) => (a.fisico > b.fisico ? a : b))
    : null;

  return (
    <main className="app-page">
      <div className="content-shell space-y-8">
        <section className="overflow-hidden rounded-lg border border-border bg-[#111111] text-white shadow-lg shadow-black/10">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-accent">
                Gestão do clube
              </p>

              <h1 className="mt-4 text-4xl font-bold tracking-normal sm:text-5xl">
                Fut dos Gurizes
              </h1>

              <p className="mt-4 max-w-xl text-base leading-7 text-white/65">
                Acompanhe jogadores, partidas, presença e desempenho em uma
                interface mais limpa, rápida de ler e alinhada com a identidade
                do Gurizes FC.
              </p>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="rounded-lg border border-accent/30 bg-white/5 p-4">
                <Image
                  src="/gurizes-logo.png"
                  alt="Gurizes FC"
                  width={224}
                  height={224}
                  className="h-44 w-44 object-contain sm:h-56 sm:w-56"
                />
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            icon={UsersRound}
            label="Jogadores"
            name={totalJogadores}
          />

          <StatCard
            icon={Trophy}
            label="Melhor overall"
            name={melhorOverall?.nome ?? "Nenhum"}
            score={melhorOverall?.overall}
          />

          <StatCard
            icon={Goal}
            label="Melhor chute"
            name={maiorChute?.nome ?? "Nenhum"}
            score={maiorChute?.chute}
          />

          <StatCard
            icon={Target}
            label="Melhor passe"
            name={melhorPasse?.nome ?? "Nenhum"}
            score={melhorPasse?.passe}
          />
        </div>

        <Card className="surface-card">
          <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <span className="icon-tile">
              <Dumbbell className="size-5" />
            </span>
            <div>
              <p className="page-kicker">Destaque físico</p>
              <h2 className="text-2xl font-bold">Maior físico</h2>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <p className="text-xl font-semibold">
              {melhorFisico?.nome ?? "Nenhum"}
            </p>

            {melhorFisico && (
              <Badge className="rounded-lg bg-accent px-3 py-1 text-sm font-bold text-accent-foreground hover:bg-accent">
                {melhorFisico.fisico} pts
              </Badge>
            )}
          </div>
          </CardContent>
        </Card>
            </div>
    </main>
  );
}
