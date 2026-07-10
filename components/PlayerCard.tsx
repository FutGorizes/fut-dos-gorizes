import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Pencil, User } from "lucide-react";

import { getCardTemplate } from "@/lib/card-templates";
import type { CardPlayer } from "@/types/player";

function CardStat({
  value,
  label,
  text,
  muted,
}: {
  value: number;
  label: string;
  text: string;
  muted: string;
}) {
  return (
    <div className={`flex items-baseline gap-1.5 ${text}`}>
      <span className="text-[7cqw] font-black leading-none">{value}</span>
      <span
        className={`text-[4cqw] font-semibold uppercase tracking-wide ${muted}`}
      >
        {label}
      </span>
    </div>
  );
}

export default function PlayerCard({
  player,
  isAdmin = false,
}: {
  player: CardPlayer;
  isAdmin?: boolean;
}) {
  const tpl = getCardTemplate(player.card_template, player.overall);
  const fotoCard = player.foto_sem_fundo_url;
  const nomeCard =
    player.nome.length > 15 ? player.nome.slice(0, 15).trim() : player.nome;

  return (
    <div className="flex w-full max-w-sm flex-col items-center gap-4">
      <Link
        href={`/jogadores/${player.id}`}
        className="group relative block w-full transition-transform duration-200 hover:-translate-y-1"
      >
        <div className="relative w-full @container aspect-800/1118">
          <Image
            src={tpl.src}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, 384px"
            className="pointer-events-none select-none object-contain"
            priority={false}
          />

          <div
            className={`absolute left-[15%] top-[20%] z-10 flex flex-col items-center leading-none ${tpl.text}`}
          >
            <span className="text-[12cqw] font-black">{player.overall}</span>
            <span className="text-[5cqw] font-bold uppercase tracking-widest">
              {player.posicao || "-"}
            </span>
          </div>

          <div className="absolute inset-x-[6%] top-[8%] bottom-[42%] z-0 flex items-end justify-center">
            {fotoCard ? (
              <img
                src={fotoCard}
                alt={player.nome}
                className="h-full w-auto max-w-[70%] mb-10 object-contain object-bottom drop-shadow-[0_6px_10px_rgba(0,0,0,0.35)]"
              />
            ) : (
              <div
                className={`flex h-[70%] w-[70%] items-end justify-center ${tpl.muted}`}
              >
                <User className="h-1/2 w-auto mb-10" />
              </div>
            )}
          </div>

          <div
            className={`absolute inset-x-[10%] top-[53%] z-10 text-center text-[7cqw] font-black uppercase tracking-wide leading-none ${tpl.text}`}
          >
            {nomeCard}
          </div>

          <div className="absolute inset-x-[12%] top-[62%] left-[23%] z-10 grid grid-cols-2 gap-x-[6%] gap-y-[3.5cqw]">
            <CardStat
              value={player.chute}
              label="CHU"
              text={tpl.text}
              muted={tpl.muted}
            />
            <CardStat
              value={player.marcacao}
              label="MAR"
              text={tpl.text}
              muted={tpl.muted}
            />
            <CardStat
              value={player.passe}
              label="PAS"
              text={tpl.text}
              muted={tpl.muted}
            />
            <CardStat
              value={player.fisico}
              label="FÍS"
              text={tpl.text}
              muted={tpl.muted}
            />
            <CardStat
              value={player.drible}
              label="DRI"
              text={tpl.text}
              muted={tpl.muted}
            />
          </div>
        </div>
      </Link>

      {isAdmin && (
        <Button
          variant="secondary"
          render={<Link href={`/jogadores/${player.id}/editar`} />}
          className="h-10 px-4"
        >
          <Pencil size={18} />
          Editar jogador
        </Button>
      )}
    </div>
  );
}
