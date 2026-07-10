"use client";


import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

import { supabase } from "@/lib/supabase";



interface Props {

  partidaId:number;

  jaConfirmado:boolean;

}



export default function ConfirmPresenceButton({

  partidaId,

  jaConfirmado

}:Props){



  const [confirmado,setConfirmado] = useState(
    jaConfirmado
  );


  const [loading,setLoading] = useState(false);

  const router = useRouter();







  async function alterarPresenca(){


    try{


      setLoading(true);



      const {

        data:{
          session
        }

      } = await supabase.auth.getSession();







      if(!session){

        toast.error("Usuário não autenticado");

        return;

      }







      const response = await fetch(

        "/api/presencas",

        {

          method:

          confirmado

          ? "DELETE"

          : "POST",





          headers:{

            "Content-Type":"application/json",


            Authorization:

            `Bearer ${session.access_token}`

          },





          body:JSON.stringify({

            partida_id:partidaId

          })

        }

      );








      const data = await response.json();







      if(!response.ok){

        toast.error(data.message || "Erro ao alterar presença");

        return;

      }







      setConfirmado(!confirmado);
      toast.success(confirmado ? "Presença retirada" : "Presença confirmada");



      router.refresh();




    }


    catch(error){

      console.log(error);

      toast.error("Erro de conexão");

    }


    finally{

      setLoading(false);

    }


  }









  return (

    <Button

      className="h-10 w-full cursor-pointer"

      disabled={loading}

      onClick={alterarPresenca}

    >

      {loading ? (
        "Aguarde..."
      ) : confirmado ? (
        <>
          <X size={18} />
          Retirar presença
        </>
      ) : (
        <>
          <Check size={18} />
          Confirmar presença
        </>
      )}


    </Button>

  );


}
