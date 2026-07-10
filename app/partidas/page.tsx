import Link from "next/link";
import { CalendarDays, Plus } from "lucide-react";

import GameCard from "@/components/GameCard";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { verificarAdmin } from "@/lib/isAdmin";


export const dynamic = "force-dynamic";


export default async function Partidas() {
  const { data: games, error } = await supabase
    .from("partidas")
    .select("*")
    .order("id", {
      ascending: false,
    });

  if (error) {
    console.log("Erro ao buscar partidas:", error);
  }

  const isAdmin = await verificarAdmin();

  console.log("ADMIN NA PAGINA PARTIDAS:", isAdmin);

  return (
    <main className="app-page">
      <div className="content-shell">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="icon-tile">
              <CalendarDays size={20} />
            </span>

            <div>
              <p className="page-kicker">Agenda e resultados</p>
              <h1 className="page-title">Partidas</h1>
            </div>
          </div>

          {isAdmin && (
            <Button
              render={<Link href="/partidas/nova" />}
              className="h-10 px-5 font-semibold"
            >
              <Plus size={18} />
              Criar Partida
            </Button>
          )}
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {games?.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      </div>
    </main>
  );
}
