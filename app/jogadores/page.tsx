import { UsersRound } from "lucide-react";

import PlayerCard from "@/components/PlayerCard";
import { createClient } from "@/lib/supabase/server";
import { isAdmin } from "@/lib/supabase/auth";

export default async function Jogadores() {
  const supabase = await createClient();

  const { data: players, error } = await supabase.from("jogadores").select("*");

  if (error) {
    console.log("ERRO SUPABASE:", JSON.stringify(error, null, 2));
  }
  const admin = await isAdmin();

  return (
    <main className="app-page">
      <div className="content-shell">
        <div className="mb-8 flex items-center gap-4">
          <span className="icon-tile">
            <UsersRound size={20} />
          </span>

          <div>
            <p className="page-kicker">Elenco</p>

            <h1 className="page-title">Jogadores</h1>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {players?.map((player) => (
            <PlayerCard key={player.id} player={player} isAdmin={admin} />
          ))}
        </div>
      </div>
    </main>
  );
}
