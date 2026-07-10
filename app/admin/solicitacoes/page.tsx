import { ShieldCheck } from "lucide-react";

import { requireAdmin } from "@/lib/supabase/auth";
import { createAdminClient } from "@/lib/supabase-admin";
import SolicitacoesAdmin, {
  type Solicitacao,
} from "@/components/SolicitacoesAdmin";

export default async function SolicitacoesPage() {
  await requireAdmin();

  const admin = createAdminClient();
  const { data } = await admin
    .from("solicitacoes_cadastro")
    .select("id, nome, email, status, created_at")
    .order("created_at", { ascending: false });

  const solicitacoes = (data ?? []) as Solicitacao[];

  return (
    <main className="app-page">
      <div className="content-shell">
        <div className="mb-8 flex items-center gap-4">
          <span className="icon-tile">
            <ShieldCheck size={20} />
          </span>

          <div>
            <p className="page-kicker">Admin</p>
            <h1 className="page-title">Solicitações de cadastro</h1>
          </div>
        </div>

        <SolicitacoesAdmin solicitacoes={solicitacoes} />
      </div>
    </main>
  );
}
