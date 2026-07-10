import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/lib/supabase-server";
import { createAdminClient } from "@/lib/supabase-admin";

// Aprova ou rejeita uma solicitação de cadastro.
// Body: { id: string, acao: "aprovar" | "rejeitar" }
export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  // Só admin pode aprovar/rejeitar.
  const { data: jogadorLogado } = await supabase
    .from("jogadores")
    .select("admin")
    .eq("usuario_id", user.id)
    .single();

  if (!jogadorLogado?.admin) {
    return NextResponse.json(
      { error: "Apenas administradores." },
      { status: 403 },
    );
  }

  const { id, acao } = await request.json();

  const acoesValidas = ["aprovar", "rejeitar", "reverter", "excluir"];
  if (!id || !acoesValidas.includes(acao)) {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  const admin = createAdminClient();

  const { data: solicitacao, error: solErro } = await admin
    .from("solicitacoes_cadastro")
    .select("*")
    .eq("id", id)
    .single();

  if (solErro || !solicitacao) {
    return NextResponse.json(
      { error: "Solicitação não encontrada." },
      { status: 404 },
    );
  }

  // Excluir de vez: remove jogador, solicitação e o usuário do auth.
  if (acao === "excluir") {
    await admin
      .from("jogadores")
      .delete()
      .eq("usuario_id", solicitacao.usuario_id);

    const { error: delSol } = await admin
      .from("solicitacoes_cadastro")
      .delete()
      .eq("id", id);

    if (delSol) {
      return NextResponse.json({ error: delSol.message }, { status: 500 });
    }

    // Remove o usuário do auth (ignora se já não existir).
    await admin.auth.admin.deleteUser(solicitacao.usuario_id);

    return NextResponse.json({ ok: true, status: "excluido" });
  }

  if (acao === "rejeitar") {
    const { error } = await admin
      .from("solicitacoes_cadastro")
      .update({ status: "rejeitado" })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, status: "rejeitado" });
  }

  // Reverter: devolve uma solicitação rejeitada para a fila (pendente).
  if (acao === "reverter") {
    const { error } = await admin
      .from("solicitacoes_cadastro")
      .update({ status: "pendente" })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true, status: "pendente" });
  }

  // aprovar: marca a solicitação e cria a linha de jogador (se ainda não existe).
  const { data: jaExiste } = await admin
    .from("jogadores")
    .select("id")
    .eq("usuario_id", solicitacao.usuario_id)
    .maybeSingle();

  if (!jaExiste) {
    const { error: criaErro } = await admin.from("jogadores").insert({
      usuario_id: solicitacao.usuario_id,
      nome: solicitacao.nome,
      admin: false,
      overall: 0,
      chute: 0,
      passe: 0,
      drible: 0,
      marcacao: 0,
      fisico: 0,
      posicao: "",
      posicao_secundaria: "",
    });

    if (criaErro) {
      return NextResponse.json({ error: criaErro.message }, { status: 500 });
    }
  }

  const { error } = await admin
    .from("solicitacoes_cadastro")
    .update({ status: "aprovado" })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, status: "aprovado" });
}
