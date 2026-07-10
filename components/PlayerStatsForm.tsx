"use client";

import { useState } from "react";
import { Save, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { supabase } from "@/lib/supabase";

type Props = {
  jogadorId: number;

  temporada: number;

  initialData?: {
    gols?: number;

    assistencias?: number;

    jogos?: number;
  };
};

export default function PlayerStatsForm({
  jogadorId,

  temporada,

  initialData,
}: Props) {
  const router = useRouter();

  const [gols, setGols] = useState(initialData?.gols?.toString() ?? "0");

  const [assistencias, setAssistencias] = useState(
    initialData?.assistencias?.toString() ?? "0",
  );

  const [jogos, setJogos] = useState(initialData?.jogos?.toString() ?? "0");

  const [erro, setErro] = useState("");

  const [sucesso, setSucesso] = useState("");

  const [salvando, setSalvando] = useState(false);

  async function handleSubmit() {
    setErro("");

    setSucesso("");

    setSalvando(true);

    const dados = {
      jogador_id: jogadorId,

      temporada,

      gols: Number(gols),

      assistencias: Number(assistencias),

      jogos: Number(jogos),
    };

    const { error } = await supabase

      .from("estatisticas_jogadores")

      .upsert(
        dados,

        {
          onConflict: "jogador_id,temporada",
        },
      );

    if (error) {
      console.error("Erro Supabase:", error);

      setErro(error.message);

      setSalvando(false);

      return;
    }

    setSucesso("Estatísticas salvas com sucesso!");

    setSalvando(false);

    router.refresh();
  }

  return (
    <Card className="surface-card w-full max-w-xl">
      <CardHeader>
        <div className="flex items-center gap-3">
          <span className="icon-tile">
            <Trophy size={20} />
          </span>

          <div>
            <p className="page-kicker">Administração</p>

            <CardTitle className="font-heading text-xl font-black">
              Estatísticas {temporada}
            </CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {erro && <p className="text-sm text-destructive">Erro: {erro}</p>}

        {sucesso && <p className="text-sm text-green-500">{sucesso}</p>}

        <div className="form-grid">
          <div className="field-stack">
            <Label>Gols</Label>

            <Input
              type="number"
              min="0"
              value={gols}
              onChange={(e) => setGols(e.target.value)}
            />
          </div>

          <div className="field-stack">
            <Label>Assistências</Label>

            <Input
              type="number"
              min="0"
              value={assistencias}
              onChange={(e) => setAssistencias(e.target.value)}
            />
          </div>

          <div className="field-stack">
            <Label>Jogos</Label>

            <Input
              type="number"
              min="0"
              value={jogos}
              onChange={(e) => setJogos(e.target.value)}
            />
          </div>
        </div>

        <Button
          className="h-10 w-full cursor-pointer"
          onClick={handleSubmit}
          disabled={salvando}
        >
          <Save size={18} />

          {salvando ? "Salvando..." : "Salvar estatísticas"}
        </Button>
      </CardContent>
    </Card>
  );
}
