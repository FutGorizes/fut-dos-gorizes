"use client"

import { useState } from "react"
import { AlertCircle, Save, UserRound } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import type { Player } from "@/types/player"


type Props = {
  initialData?: Partial<Player>
  onSubmit: (player: Player) => Promise<void>
  buttonText: string
}


export default function PlayerForm({
  initialData,
  onSubmit,
  buttonText,
}: Props) {


  const posicoes = [
    "GOL",
    "ZAG",
    "LE",
    "LD",
    "MC",
    "CA",
  ]



  const [nome, setNome] = useState(
    initialData?.nome ?? ""
  )


  const [chute, setChute] = useState(
    initialData?.chute?.toString() ?? ""
  )


  const [passe, setPasse] = useState(
    initialData?.passe?.toString() ?? ""
  )


  const [drible, setDrible] = useState(
    initialData?.drible?.toString() ?? ""
  )


  const [marcacao, setMarcacao] = useState(
    initialData?.marcacao?.toString() ?? ""
  )


  const [fisico, setFisico] = useState(
    initialData?.fisico?.toString() ?? ""
  )



  const [posicao, setPosicao] = useState(
    initialData?.posicao ?? ""
  )


  const [posicaoSecundaria, setPosicaoSecundaria] = useState(
    initialData?.posicao_secundaria ?? ""
  )



  const [erro, setErro] = useState("")




  function validarValor(valor: string) {

    const numero = Number(valor)

    return (
      valor !== "" &&
      numero >= 0 &&
      numero <= 100
    )

  }





  function calcularOverall() {


    switch (posicao) {


      case "CA":

        return Math.round(

          Number(chute) * 0.4 +

          Number(drible) * 0.25 +

          Number(passe) * 0.15 +

          Number(fisico) * 0.15 +

          Number(marcacao) * 0.05

        )





      case "MC":

        return Math.round(

          Number(passe) * 0.35 +

          Number(drible) * 0.25 +

          Number(chute) * 0.2 +

          Number(fisico) * 0.1 +

          Number(marcacao) * 0.1

        )





      case "ZAG":

        return Math.round(

          Number(marcacao) * 0.45 +

          Number(fisico) * 0.3 +

          Number(passe) * 0.1 +

          Number(drible) * 0.1 +

          Number(chute) * 0.05

        )





      case "LE":

      case "LD":

        return Math.round(

          Number(fisico) * 0.25 +

          Number(marcacao) * 0.25 +

          Number(passe) * 0.2 +

          Number(drible) * 0.2 +

          Number(chute) * 0.1

        )





      case "GOL":

        return Math.round(

          Number(marcacao) * 0.35 +

          Number(fisico) * 0.3 +

          Number(passe) * 0.2 +

          Number(drible) * 0.1 +

          Number(chute) * 0.05

        )





      default:

        return Math.round(

          (

            Number(chute) +

            Number(passe) +

            Number(drible) +

            Number(marcacao) +

            Number(fisico)

          ) / 5

        )

    }


  }






  async function handleSubmit() {


    setErro("")



    if (!nome.trim()) {

      setErro(
        "Digite o nome do jogador."
      )

      return

    }





    if (

      !validarValor(chute) ||

      !validarValor(passe) ||

      !validarValor(drible) ||

      !validarValor(marcacao) ||

      !validarValor(fisico)

    ) {


      setErro(
        "Os atributos devem estar entre 0 e 100."
      )

      return

    }





    if (!posicao) {

      setErro(
        "Selecione a posição principal."
      )

      return

    }





    if (

      posicaoSecundaria &&

      posicao === posicaoSecundaria

    ) {


      setErro(
        "A posição secundária não pode ser igual à principal."
      )

      return

    }
    
    await onSubmit({

      id: initialData?.id,

      nome,

      foto_url: initialData?.foto_url,

      overall: calcularOverall(),

      chute: Number(chute),

      passe: Number(passe),

      drible: Number(drible),

      marcacao: Number(marcacao),

      fisico: Number(fisico),

      posicao,

      posicao_secundaria: posicaoSecundaria,

    })


  }






  return (

    <Card className="surface-card w-full max-w-xl">


      <CardHeader className="items-center text-center">


        <div className="mb-2 flex items-center justify-center gap-3">


          <span className="icon-tile">

            <UserRound size={20} />

          </span>



          <div>

            <p className="page-kicker">
              Cadastro
            </p>


            <CardTitle className="font-heading text-3xl font-black">
              Jogador
            </CardTitle>


          </div>


        </div>


      </CardHeader>





      <CardContent className="space-y-5">



        {erro && (

          <Alert variant="destructive">

            <AlertCircle />

            <AlertTitle>
              Revise os dados
            </AlertTitle>


            <AlertDescription>
              {erro}
            </AlertDescription>


          </Alert>

        )}







        <div className="field-stack">


          <Label htmlFor="nome">
            Nome
          </Label>


          <Input

            id="nome"

            value={nome}

            onChange={(e) =>
              setNome(e.target.value)
            }

          />


        </div>







        <div className="form-grid">





          <div className="field-stack">


            <Label>
              Overall
            </Label>


            <div className="flex h-10 items-center rounded-lg border border-input bg-muted px-3 font-black">

              {calcularOverall()}

            </div>


          </div>







          <div className="field-stack">


            <Label>
              Chute
            </Label>


            <Input

              type="number"

              value={chute}

              onChange={(e) =>
                setChute(e.target.value)
              }

            />


          </div>







          <div className="field-stack">


            <Label>
              Passe
            </Label>


            <Input

              type="number"

              value={passe}

              onChange={(e) =>
                setPasse(e.target.value)
              }

            />


          </div>







          <div className="field-stack">


            <Label>
              Drible
            </Label>


            <Input

              type="number"

              value={drible}

              onChange={(e) =>
                setDrible(e.target.value)
              }

            />


          </div>







          <div className="field-stack">


            <Label>
              Marcação
            </Label>


            <Input

              type="number"

              value={marcacao}

              onChange={(e) =>
                setMarcacao(e.target.value)
              }

            />


          </div>







          <div className="field-stack">


            <Label>
              Físico
            </Label>


            <Input

              type="number"

              value={fisico}

              onChange={(e) =>
                setFisico(e.target.value)
              }

            />


          </div>








          <div className="field-stack">


            <Label>
              Posição Principal
            </Label>





            <Select

              value={posicao}

              onValueChange={setPosicao}

            >


              <SelectTrigger className="w-full cursor-pointer">

                <SelectValue placeholder="Escolha a posição" />

              </SelectTrigger>





              <SelectContent>


                {posicoes.map((item) => (


                  <SelectItem

                    key={item}

                    value={item}

                  >

                    {item}

                  </SelectItem>


                ))}


              </SelectContent>



            </Select>



          </div>








          <div className="field-stack">


            <Label>
              Posição Secundária
            </Label>





            <Select

              value={posicaoSecundaria}

              onValueChange={setPosicaoSecundaria}

            >


              <SelectTrigger className="w-full cursor-pointer">


                <SelectValue placeholder="Escolha a posição" />


              </SelectTrigger>





              <SelectContent>


                {posicoes.map((item) => (


                  <SelectItem

                    key={item}

                    value={item}

                  >

                    {item}

                  </SelectItem>


                ))}


              </SelectContent>



            </Select>



          </div>





        </div>








        <Button

          className="h-10 w-full cursor-pointer"

          onClick={handleSubmit}

        >


          <Save size={18} />


          {buttonText}



        </Button>





      </CardContent>



    </Card>


  )


}