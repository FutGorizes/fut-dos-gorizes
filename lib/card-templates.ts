// Templates de card FUT disponíveis. Usado tanto pelo PlayerCard (para
// renderizar) quanto pela tela de configuração (para o usuário escolher).
export type CardTemplate = {
  id: string;
  nome: string;
  src: string;
  // Classes Tailwind com a cor do texto que fica legível sobre o quadro.
  text: string;
  muted: string;
};

export const cardTemplates: CardTemplate[] = [
  {
    id: "card1",
    nome: "Ouro",
    src: "/fifa-card1.png",
    text: "text-[#5b4700]",
    muted: "text-[#5b4700]/70",
  },
  {
    id: "card2",
    nome: "Vermelho",
    src: "/fifa-card2.png",
    text: "text-rose-50",
    muted: "text-rose-100/80",
  },
  {
    id: "card3",
    nome: "Especial",
    src: "/fifa-card3.png",
    text: "text-cyan-50",
    muted: "text-cyan-200/80",
  },
];

export const defaultCardTemplateId = cardTemplates[0].id;

// Retorna o template escolhido; se o id for inválido/ausente, cai no fallback
// por overall (mantém o comportamento antigo para jogadores sem escolha).
export function getCardTemplate(
  id: string | null | undefined,
  overall = 0,
): CardTemplate {
  const escolhido = cardTemplates.find((t) => t.id === id);
  if (escolhido) return escolhido;

  if (overall >= 90) return cardTemplates[2];
  if (overall >= 80) return cardTemplates[0];
  return cardTemplates[1];
}
