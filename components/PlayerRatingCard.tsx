"use client";

import { useState } from "react";

import PlayerRatingForm from "@/components/PlayerRatingForm";



type Props = {

  jogador: {

    id: number;

    nome: string;

    overall: number;

    posicao: string;

  };


  partidaId: number;


  avaliadorId: number;


  jaAvaliado: boolean;

};





export default function PlayerRatingCard({

  jogador,

  partidaId,

  avaliadorId,

  jaAvaliado,

}: Props) {



  const [aberto, setAberto] = useState(false);





  return (

    <div
      className="
        rounded-xl
        border
        border-zinc-700
        bg-zinc-950
        p-5
        text-white
      "
    >



      <h2
        className="
          text-xl
          font-bold
        "
      >

        {jogador.nome}

      </h2>






      <p
        className="
          text-zinc-300
        "
      >

        Overall:

        {" "}

        <span
          className="
            font-bold
            text-white
          "
        >

          {jogador.overall}

        </span>


      </p>






      <p
        className="
          text-zinc-300
        "
      >

        Posição:

        {" "}

        <span
          className="
            font-bold
            text-white
          "
        >

          {jogador.posicao}

        </span>


      </p>








      {
        jaAvaliado ? (

          <div
            className="
              mt-4
              rounded-lg
              bg-green-600
              px-5
              py-2
              text-center
              font-semibold
              text-white
            "
          >

            ✅ Avaliação enviada

          </div>


        ) : (


          <button

            onClick={() =>
              setAberto(!aberto)
            }


            className="
              mt-4
              cursor-pointer
              rounded-lg
              bg-green-500
              px-5
              py-2
              font-semibold
              text-black
              hover:bg-green-400
              transition
            "

          >

            {
              aberto
              ?
              "Fechar avaliação"
              :
              "Avaliar"
            }


          </button>


        )

      }







      {
        aberto && !jaAvaliado && (

          <PlayerRatingForm

            partidaId={
              partidaId
            }


            avaliadorId={
              avaliadorId
            }


            jogadorId={
              jogador.id
            }


          />

        )

      }





    </div>

  );

}