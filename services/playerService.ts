import type { Player } from "@/types/player";

export async function getPlayers() {
  const res = await fetch("/api/jogadores");

  if (!res.ok) {
    throw new Error("Erro ao buscar jogadores");
  }

  return res.json();
}

export async function getPlayer(id: string) {
  const res = await fetch(`/api/jogadores/${id}`);

  if (!res.ok) {
    throw new Error("Erro ao buscar jogador");
  }

  return res.json();
}

export async function createPlayer(player: Player) {
  const res = await fetch("/api/jogadores", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(player),
  });

  if (!res.ok) {
    throw new Error("Erro ao criar jogador");
  }

  return res.json();
}

export async function updatePlayer(id: string, player: Player) {
  const res = await fetch(`/api/jogadores/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(player),
  });

  if (!res.ok) {
    throw new Error("Erro ao atualizar jogador");
  }

  return res.json();
}

export async function deletePlayer(id: string) {
  const res = await fetch(`/api/jogadores/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error("Erro ao excluir jogador");
  }

  return res.json();
}