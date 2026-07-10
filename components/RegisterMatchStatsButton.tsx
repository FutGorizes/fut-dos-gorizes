"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Minus, Trophy } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { supabase } from "@/lib/supabase";



type JogadorConfirmado = {

  id:number;

  jogadores:{

    id:number;

    nome:string;

  };

};



interface Props {

  partidaId:number;

  jogadores:JogadorConfirmado[];

}





export default function RegisterMatchStatsButton({

  partidaId,

  jogadores

}:Props){



  const router = useRouter();



  const [aberto,setAberto] = useState(false);


  const [loading,setLoading] = useState(false);





  const [estatisticas,setEstatisticas] = useState(


    jogadores.map((j)=>({

      jogador_id:j.jogadores.id,

      nome:j.jogadores.nome,

      gols:0,

      assistencias:0

    }))


  );








  function alterarValor(

    index:number,

    campo:"gols" | "assistencias",

    valor:number

  ){


    setEstatisticas((atual)=>

      atual.map((j,i)=>{


        if(i !== index){

          return j;

        }



        return {

          ...j,

          [campo]:

            Math.max(

              0,

              j[campo] + valor

            )

        };


      })

    );


  }









  async function salvar(){



    try{


      setLoading(true);





      const {

        data:{

          session

        }

      } = await supabase.auth.getSession();





      if(!session){


        toast.error(
          "Usuário não autenticado"
        );


        return;


      }









      const response = await fetch(

        `/api/partidas/${partidaId}/estatisticas`,

        {

          method:"POST",


          headers:{


            "Content-Type":"application/json",


            Authorization:

            `Bearer ${session.access_token}`


          },


          body:JSON.stringify({

            jogadores:estatisticas.map((j)=>({

              jogador_id:j.jogador_id,

              gols:j.gols,

              assistencias:j.assistencias

            }))


          })


        }

      );







      const data = await response.json();






      if(!response.ok){


        toast.error(

          data.message ||

          "Erro ao salvar estatísticas"

        );


        return;


      }






      toast.success(

        "Estatísticas registradas"

      );



      router.refresh();



      setAberto(false);





    }

    catch(error){


      console.log(error);


      toast.error(

        "Erro de conexão"

      );


    }


    finally{


      setLoading(false);


    }


  }









  return (


    <div className="space-y-4">


      <Button

        className="
          h-12
          w-full
          font-black
        "

        onClick={()=>setAberto(!aberto)}

      >


        <Trophy size={18}/>


        Registrar estatísticas


      </Button>







      {
        aberto && (

          <Card className="bg-secondary/60">


            <CardContent className="space-y-4 p-4">





              {

                estatisticas.map((j,index)=>(


                  <div

                    key={j.jogador_id}

                    className="
                      rounded-lg
                      border
                      bg-background
                      p-4
                    "

                  >



                    <p className="mb-3 font-black">

                      {j.nome}

                    </p>






                    <div className="grid grid-cols-2 gap-3">



                      <div>

                        <p className="mb-2 text-sm font-bold">

                          Gols

                        </p>



                        <div className="flex items-center justify-between">


                          <Button

                            size="icon"

                            variant="outline"

                            onClick={()=>alterarValor(
                              index,
                              "gols",
                              -1
                            )}

                          >

                            <Minus size={16}/>

                          </Button>



                          <span className="font-black">

                            {j.gols}

                          </span>




                          <Button

                            size="icon"

                            variant="outline"

                            onClick={()=>alterarValor(
                              index,
                              "gols",
                              1
                            )}

                          >

                            <Plus size={16}/>

                          </Button>



                        </div>


                      </div>









                      <div>

                        <p className="mb-2 text-sm font-bold">

                          Assistências

                        </p>




                        <div className="flex items-center justify-between">


                          <Button

                            size="icon"

                            variant="outline"

                            onClick={()=>alterarValor(
                              index,
                              "assistencias",
                              -1
                            )}

                          >

                            <Minus size={16}/>

                          </Button>



                          <span className="font-black">

                            {j.assistencias}

                          </span>




                          <Button

                            size="icon"

                            variant="outline"

                            onClick={()=>alterarValor(
                              index,
                              "assistencias",
                              1
                            )}

                          >

                            <Plus size={16}/>

                          </Button>



                        </div>



                      </div>




                    </div>



                  </div>


                ))

              }





              <Button

                className="w-full font-black"

                disabled={loading}

                onClick={salvar}

              >

                {
                  loading

                  ?

                  "Salvando..."

                  :

                  "Salvar estatísticas"

                }


              </Button>




            </CardContent>


          </Card>


        )

      }


    </div>


  );


}