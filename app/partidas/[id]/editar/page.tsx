"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Pencil, Save } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";


export default function EditarPartida() {


  const { id } = useParams();

  const router = useRouter();



  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [local, setLocal] = useState("");
  const [timeA, setTimeA] = useState("");
  const [timeB, setTimeB] = useState("");
  const [golsA, setGolsA] = useState("0");
  const [golsB, setGolsB] = useState("0");

  const [pixGoleiro, setPixGoleiro] = useState("");
  const [valorGoleiro, setValorGoleiro] = useState("");

  const [loading, setLoading] = useState(true);




  useEffect(() => {


    async function carregarPartida() {


      const response = await fetch(
        `/api/partidas/${id}`
      );


      if (!response.ok) {

        toast.error("Erro ao buscar partida");
        return;

      }



      const partida = await response.json();



      setData(partida.data);
      setHora(partida.hora || "");
      setLocal(partida.local || "");
      setTimeA(partida.time_a);
      setTimeB(partida.time_b);
      setGolsA(String(partida.gols_a));
      setGolsB(String(partida.gols_b));

      setPixGoleiro(partida.pix_goleiro || "");

      setValorGoleiro(
        String(partida.valor_goleiro || "")
      );


      setLoading(false);


    }



    if (id) {

      carregarPartida();

    }


  }, [id]);









  async function salvarAlteracao() {


    const response = await fetch(
      `/api/partidas/${id}`,
      {

        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },


        body: JSON.stringify({

          data,

          hora,

          local,

          time_a: timeA,

          time_b: timeB,

          gols_a: Number(golsA),

          gols_b: Number(golsB),

          pix_goleiro: pixGoleiro,

          valor_goleiro: Number(valorGoleiro),


        }),

      }
    );



    if (!response.ok) {

      toast.error("Erro ao editar partida");
      return;

    }



    toast.success("Partida atualizada");

    router.push(`/partidas/${id}`);

    router.refresh();


  }







  if (loading) {

    return (

      <main className="app-page">
        Carregando...
      </main>

    );

  }







  return (

    <main className="app-page flex items-center justify-center">


      <Card className="surface-card w-full max-w-xl p-8">


        <div className="mb-8 flex items-center justify-center gap-3">
          <span className="icon-tile">
            <Pencil size={20} />
          </span>
          <div>
            <p className="page-kicker">Agenda</p>
            <h1 className="text-3xl font-black">
              Editar Partida
            </h1>
          </div>
        </div>





        <div className="space-y-5">



          <div className="field-stack">
          <Label htmlFor="data">Data</Label>
          <Input
            id="data"

            type="date"

            value={data}

            onChange={(e) =>
              setData(e.target.value)
            }

          />
          </div>





          <div className="field-stack">
          <Label htmlFor="hora">Horário</Label>
          <Input
            id="hora"

            type="time"

            value={hora}

            onChange={(e) =>
              setHora(e.target.value)
            }

          />
          </div>






          <div className="field-stack">
          <Label htmlFor="local">Local</Label>
          <Input
            id="local"

            placeholder="Local da partida"

            value={local}

            onChange={(e) =>
              setLocal(e.target.value)
            }

          />
          </div>






          <div className="field-stack">
          <Label htmlFor="time-a">Time A</Label>
          <Input
            id="time-a"

            placeholder="Time A"

            value={timeA}

            onChange={(e) =>
              setTimeA(e.target.value)
            }

          />
          </div>






          <div className="field-stack">
          <Label htmlFor="time-b">Time B</Label>
          <Input
            id="time-b"

            placeholder="Time B"

            value={timeB}

            onChange={(e) =>
              setTimeB(e.target.value)
            }

          />
          </div>






          <div className="grid grid-cols-2 gap-4">



            <div className="field-stack">
            <Label htmlFor="gols-a">Gols A</Label>
            <Input
              id="gols-a"

              type="number"

              value={golsA}

              onChange={(e) =>
                setGolsA(e.target.value)
              }

            />
            </div>





            <div className="field-stack">
            <Label htmlFor="gols-b">Gols B</Label>
            <Input
              id="gols-b"

              type="number"

              value={golsB}

              onChange={(e) =>
                setGolsB(e.target.value)
              }

            />
            </div>



          </div>







          <div className="field-stack">
          <Label htmlFor="pix-goleiro">Pix do goleiro</Label>
          <Input
            id="pix-goleiro"

            placeholder="Pix do goleiro"

            value={pixGoleiro}

            onChange={(e) =>
              setPixGoleiro(e.target.value)
            }

          />
          </div>






          <div className="field-stack">
          <Label htmlFor="valor-goleiro">Valor do goleiro</Label>
          <Input
            id="valor-goleiro"

            type="number"

            placeholder="Valor do goleiro"

            value={valorGoleiro}

            onChange={(e) =>
              setValorGoleiro(e.target.value)
            }

          />
          </div>







          <Button

            className="h-10 w-full cursor-pointer"

            onClick={salvarAlteracao}

          >

            <Save size={18} />
            Salvar Alterações

          </Button>




        </div>


      </Card>


    </main>

  );

}
