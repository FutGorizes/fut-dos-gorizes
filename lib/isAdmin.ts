import { createClient } from "@/lib/supabase-server";

export async function verificarAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false;
  }

  const { data: jogador, error } = await supabase

    .from("jogadores")
    .select("nome, usuario_id, admin")
    .eq("usuario_id", user.id)
    .single();

  if (!jogador) {
    return false;
  }

  return jogador.admin === true;
}
