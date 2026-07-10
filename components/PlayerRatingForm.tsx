"use client";

import { useState } from "react";

import { createRating } from "@/services/ratingService";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


type Props = {
  partidaId: number;
  avaliadorId: number;
  jogadorId: number;
};


export default function PlayerRatingForm({
  partidaId,
  avaliadorId,
  jogadorId,
}: Props) {


  const [notas, setNotas] = useState({

    chute: "50",
    passe: "50",
    drible: "50",
    marcacao: "50",
    fisico: "50",

  });



  const [salvando, setSalvando] = useState(false);





  function alterarNota(
    campo: keyof typeof notas,
    valor: string
  ) {


    // permite apagar o campo
    if(valor === ""){


      setNotas({

        ...notas,

        [campo]: "",

      });


      return;

    }





    let numero = Number(valor);





    if(numero < 0){

      numero = 0;

    }




    if(numero > 100){

      numero = 100;

    }





    setNotas({

      ...notas,

      [campo]: String(numero),

    });


  }







  async function salvar(){


    try{


      setSalvando(true);





      await createRating({

        partida_id: partidaId,

        avaliador_id: avaliadorId,

        jogador_id: jogadorId,


        chute: Number(notas.chute || 0),

        passe: Number(notas.passe || 0),

        drible: Number(notas.drible || 0),

        marcacao: Number(notas.marcacao || 0),

        fisico: Number(notas.fisico || 0),

      });





      alert(
        "Avaliação salva!"
      );





    }catch(error){


      console.error(
        "Erro ao salvar avaliação:",
        error
      );



      alert(
        "Erro ao salvar avaliação"
      );




    }finally{


      setSalvando(false);


    }


  }







  return (

    <div
      className="
        mt-5
        border-t
        border-zinc-700
        pt-5
        space-y-4
      "
    >



      <h3
        className="
          text-lg
          font-bold
          text-white
        "
      >

        Avaliação do jogador

      </h3>





      {
        Object.entries(notas).map(
          ([campo, valor]) => (

            <div
              key={campo}
              className="space-y-1"
            >



              <label
                className="
                  text-sm
                  capitalize
                  text-zinc-300
                "
              >

                {campo}

              </label>





              <Input

                type="number"

                min={0}

                max={100}


                value={valor}



                onChange={(e)=>

                  alterarNota(
                    campo as keyof typeof notas,
                    e.target.value
                  )

                }



                className="
                  border-zinc-700
                  bg-zinc-900
                  text-white
                "

              />



            </div>


          )

        )

      }





      <Button

        onClick={salvar}

        disabled={salvando}


        className="
          w-full
          cursor-pointer
          bg-green-500
          text-black
          hover:bg-green-400
        "

      >


        {
          salvando
          ?
          "Salvando..."
          :
          "Salvar avaliação"
        }



      </Button>





    </div>

  );

}