import { createClient } from "@supabase/supabase-js";

// Client com a SERVICE KEY — ignora RLS. Uso EXCLUSIVO no servidor
// (rotas de API / server components), nunca no cliente. Nunca importe isto
// em componentes "use client".
export function createAdminClient() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const secret = process.env.SUPABASE_SECRET_KEY!;

  return createClient(url, secret, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
