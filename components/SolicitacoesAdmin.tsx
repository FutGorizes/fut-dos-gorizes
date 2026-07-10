"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X, Loader2, Inbox, RotateCcw, Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export type Solicitacao = {
  id: string;
  nome: string;
  email: string;
  status: string;
  created_at: string;
};

type Acao = "aprovar" | "rejeitar" | "reverter" | "excluir";

export default function SolicitacoesAdmin({
  solicitacoes,
}: {
  solicitacoes: Solicitacao[];
}) {
  const router = useRouter();
  const [processando, setProcessando] = useState<string | null>(null);
  const [aExcluir, setAExcluir] = useState<Solicitacao | null>(null);

  const pendentes = solicitacoes.filter((s) => s.status === "pendente");
  const historico = solicitacoes.filter((s) => s.status !== "pendente");

  async function agir(id: string, acao: Acao) {
    setProcessando(id);
    try {
      const res = await fetch("/api/admin/solicitacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, acao }),
      });

      const json = await res.json();

      if (!res.ok) {
        toast.error(json.error ?? "Erro ao processar a solicitação.");
        return;
      }

      const mensagens: Record<Acao, string> = {
        aprovar: "Cadastro aprovado.",
        rejeitar: "Cadastro rejeitado.",
        reverter: "Solicitação devolvida para a fila.",
        excluir: "Cadastro excluído.",
      };
      toast.success(mensagens[acao]);
      router.refresh();
    } catch {
      toast.error("Erro de rede ao processar a solicitação.");
    } finally {
      setProcessando(null);
    }
  }

  async function confirmarExclusao() {
    if (!aExcluir) return;
    await agir(aExcluir.id, "excluir");
    setAExcluir(null);
  }

  return (
    <div className="space-y-10">
      {/* Pendentes */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Pendentes ({pendentes.length})
        </h2>

        {pendentes.length === 0 ? (
          <Card className="surface-card">
            <CardContent className="flex flex-col items-center gap-3 py-10 text-center text-muted-foreground">
              <Inbox size={28} />
              <p>Nenhuma solicitação pendente.</p>
            </CardContent>
          </Card>
        ) : (
          pendentes.map((s) => {
            const ocupado = processando === s.id;
            return (
              <Card key={s.id} className="surface-card">
                <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
                  <div className="min-w-0">
                    <p className="truncate font-bold">{s.nome}</p>
                    <p className="truncate text-sm text-muted-foreground">
                      {s.email}
                    </p>
                  </div>
                  {ocupado ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="secondary"
                        disabled={ocupado}
                        onClick={() => agir(s.id, "rejeitar")}
                        className="h-9"
                      >
                        <X size={16} />
                        Rejeitar
                      </Button>

                      <Button
                        disabled={ocupado}
                        onClick={() => agir(s.id, "aprovar")}
                        className="h-9"
                      >
                        <Check size={16} />
                        Aprovar
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </section>

      {/* Histórico */}
      <section className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Histórico ({historico.length})
        </h2>

        {historico.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma solicitação processada ainda.
          </p>
        ) : (
          historico.map((s) => {
            const ocupado = processando === s.id;
            const aprovado = s.status === "aprovado";

            return (
              <Card key={s.id} className="surface-card">
                <CardContent className="flex flex-wrap items-center justify-between gap-4 p-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <Badge
                      variant="outline"
                      className={
                        aprovado
                          ? "border-emerald-500/40 text-emerald-500"
                          : "border-destructive/40 text-destructive"
                      }
                    >
                      {aprovado ? "Aprovado" : "Rejeitado"}
                    </Badge>

                    <div className="min-w-0">
                      <p className="truncate font-bold">{s.nome}</p>
                      <p className="truncate text-sm text-muted-foreground">
                        {s.email}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!aprovado && (
                      <>
                        <Button
                          variant="secondary"
                          disabled={ocupado}
                          onClick={() => agir(s.id, "reverter")}
                          className="h-9"
                        >
                          {ocupado ? (
                            <Loader2 className="animate-spin" />
                          ) : (
                            <RotateCcw size={16} />
                          )}
                          Reverter
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          disabled={ocupado}
                          onClick={() => setAExcluir(s)}
                          aria-label="Excluir cadastro"
                          className="size-9"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </section>

      <AlertDialog
        open={aExcluir !== null}
        onOpenChange={(aberto) => {
          if (!aberto) setAExcluir(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Tem certeza que deseja excluir este essa solicitação?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Isso remove <strong>{aExcluir?.nome}</strong> ({aExcluir?.email})
              solicitação de vez. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={confirmarExclusao}
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
