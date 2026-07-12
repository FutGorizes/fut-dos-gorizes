import { supabase } from "@/lib/supabase";

import { calculateOverallEvolution } from "@/services/overallService";

import { saveOverallHistory } from "@/services/overallHistoryService";

type CreateRatingProps = {
  partida_id: number;
  avaliador_id: number;
  jogador_id: number;
  chute: number;
  passe: number;
  drible: number;
  marcacao: number;
  fisico: number;
};

async function generateOverallEvolution(
  partidaId: number,
  jogadorId: number
) {
  const {
    data: avaliacoes,
    error,
  } = await supabase
    .from("avaliacoes_partidas")
    .select(`
      chute,
      passe,
      drible,
      marcacao,
      fisico
    `)
    .eq("partida_id", partidaId)
    .eq("jogador_id", jogadorId);

  if (error) {
    console.error("Erro buscando avaliações:", error);
    return;
  }

  // precisa de pelo menos 3 avaliações
  if (!avaliacoes || avaliacoes.length < 3) {
    return;
  }

  const somaNotas = avaliacoes.reduce((total, item) => {
    return (
      total +
      item.chute +
      item.passe +
      item.drible +
      item.marcacao +
      item.fisico
    );
  }, 0);

  const notaMedia = Math.round(
    somaNotas / (avaliacoes.length * 5)
  );

  const {
    data: jogador,
    error: jogadorError,
  } = await supabase
    .from("jogadores")
    .select("overall")
    .eq("id", jogadorId)
    .single();

  if (jogadorError || !jogador) {
    console.error("Erro buscando jogador:", jogadorError);
    return;
  }

  const evolucao = calculateOverallEvolution(
    jogador.overall,
    notaMedia,
    avaliacoes.length
  );

  if (!evolucao.podeEvoluir) {
    return;
  }

  const { error: updateError } = await supabase
    .from("jogadores")
    .update({
      overall: evolucao.overallDepois,
    })
    .eq("id", jogadorId);

  if (updateError) {
    console.error("Erro atualizando overall:", updateError);
    return;
  }

  await saveOverallHistory(
    jogadorId,
    partidaId,
    evolucao.overallAntes,
    evolucao.overallDepois,
    evolucao.notaComunidade
  );
}

export async function createRating(
  dados: CreateRatingProps
) {
  // Impede que um jogador avalie a si mesmo
  if (dados.avaliador_id === dados.jogador_id) {
    throw new Error("Você não pode avaliar a si mesmo.");
  }

  const {
    data,
    error,
  } = await supabase
    .from("avaliacoes_partidas")
    .insert({
      partida_id: dados.partida_id,
      avaliador_id: dados.avaliador_id,
      jogador_id: dados.jogador_id,
      chute: dados.chute,
      passe: dados.passe,
      drible: dados.drible,
      marcacao: dados.marcacao,
      fisico: dados.fisico,
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  await generateOverallEvolution(
    dados.partida_id,
    dados.jogador_id
  );

  return data;
}

export async function canPlayerRateMatch(
  partidaId: number,
  jogadorId: number
) {
  const {
    data,
    error,
  } = await supabase
    .from("presencas")
    .select("id")
    .eq("partida_id", partidaId)
    .eq("jogador_id", jogadorId)
    .maybeSingle();

  if (error) {
    console.error("Erro verificando presença:", error);
    return false;
  }

  return !!data;
}

export async function getPlayersFromMatch(
  partidaId: number
) {
  const {
    data,
    error,
  } = await supabase
    .from("presencas")
    .select(`
      jogador_id,
      jogadores (
        id,
        nome,
        overall,
        posicao,
        foto_url
      )
    `)
    .eq("partida_id", partidaId);

  if (error) {
    console.error("Erro buscando jogadores:", error);
    return [];
  }

  return data;
}

export async function getRatedPlayers(
  partidaId: number,
  avaliadorId: number
) {
  const {
    data,
    error,
  } = await supabase
    .from("avaliacoes_partidas")
    .select("jogador_id")
    .eq("partida_id", partidaId)
    .eq("avaliador_id", avaliadorId);

  if (error) {
    console.error("Erro buscando avaliações:", error);
    return [];
  }

  return data.map((item) => item.jogador_id);
}