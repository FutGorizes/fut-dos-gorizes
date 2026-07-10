import { redirect } from "next/navigation";
import { createClient } from "./server";

export async function getCurrentUser() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return user;
}

export async function getCurrentPlayer() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("jogadores")
    .select("*")
    .eq("usuario_id", user.id)
    .single();

  return data;
}

export async function isAdmin() {
  const jogador = await getCurrentPlayer();
  return jogador?.admin === true;
}

export async function requireAdmin() {
  const admin = await isAdmin();

  if (!admin) {
    redirect("/");
  }
}

export async function canEditPlayer(playerId: number) {
  const supabase = await createClient();

  const jogadorLogado = await getCurrentPlayer();

  if (!jogadorLogado) return false;

  if (jogadorLogado.admin) {
    return true;
  }

  const { data: jogador } = await supabase
    .from("jogadores")
    .select("usuario_id")
    .eq("id", playerId)
    .single();

  if (!jogador) return false;

  return jogador.usuario_id === jogadorLogado.usuario_id;
}
