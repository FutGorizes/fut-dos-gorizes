"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarPlus, Save } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";


export default function NovaPartida() {


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

  const [loading, setLoading] = useState(false);




  async function criarPartida() {


    setLoading(true);



    const response = await fetch(
      "/api/partidas",
      {

        method: "POST",

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

      toast.error("Erro ao criar partida");

      setLoading(false);

      return;

    }



    toast.success("Partida criada com sucesso");

    router.push("/partidas");

    router.refresh();


  }






  return (

    <main className="app-page flex items-center justify-center">


      <Card className="surface-card w-full max-w-xl p-8">


        <div className="mb-8 flex items-center justify-center gap-3">
          <span className="icon-tile">
            <CalendarPlus size={20} />
          </span>
          <div>
            <p className="page-kicker">Agenda</p>
            <h1 className="text-3xl font-black">
              Nova Partida
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

            onChange={(e)=>
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

            onChange={(e)=>
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

            onChange={(e)=>
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

            onChange={(e)=>
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

            onChange={(e)=>
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

              onChange={(e)=>
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

              onChange={(e)=>
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

            onChange={(e)=>
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

            onChange={(e)=>
              setValorGoleiro(e.target.value)
            }

          />
          </div>





          <Button

            className="h-10 w-full cursor-pointer"

            onClick={criarPartida}

            disabled={loading}

          >

            {loading
              ? "Criando..."
              : (
                <>
                  <Save size={18} />
                  Criar Partida
                </>
              )
            }

          </Button>



        </div>


      </Card>


    </main>

  );

}
