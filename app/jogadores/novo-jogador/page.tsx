"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";

import PlayerForm from "@/components/PlayerForm";
import type { Player } from "@/types/player";

export default function NovoJogador() {
  const router = useRouter();


  async function salvarJogador(player: Player) {

    const response = await fetch("/api/jogadores", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(player),
    });


    if (!response.ok) {

      toast.error("Erro ao cadastrar jogador");

      return;

    }


    toast.success("Jogador cadastrado com sucesso");


    router.push("/jogadores");

  }



  return (

    <main className="app-page flex items-center justify-center">

      <PlayerForm
        buttonText="Salvar Jogador"
        onSubmit={salvarJogador}
      />

    </main>

  );

}
