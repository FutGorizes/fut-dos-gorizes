"use client"

import { useState } from "react"
import { AlertCircle, Save, UserRound } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

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


  const [nome, setNome] = useState(initialData?.nome ?? "")
  const [overall, setOverall] = useState(initialData?.overall?.toString() ?? "")
  const [chute, setChute] = useState(initialData?.chute?.toString() ?? "")
  const [passe, setPasse] = useState(initialData?.passe?.toString() ?? "")
  const [fisico, setFisico] = useState(initialData?.fisico?.toString() ?? "")

  const [erro, setErro] = useState("")



  function validarValor(valor: string) {

    const numero = Number(valor)

    return (
      valor !== "" &&
      numero >= 0 &&
      numero <= 100
    )

  }



  async function handleSubmit() {


    setErro("")


    if (!nome.trim()) {

      setErro("Digite o nome do jogador.")

      return

    }



    if (
      !validarValor(overall) ||
      !validarValor(chute) ||
      !validarValor(passe) ||
      !validarValor(fisico)
    ) {

      setErro("Os atributos devem estar entre 0 e 100.")

      return

    }



    await onSubmit({

      nome,

      overall: Number(overall),

      chute: Number(chute),

      passe: Number(passe),

      fisico: Number(fisico),

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
          <p className="page-kicker">Cadastro</p>
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
          <AlertTitle>Revise os dados</AlertTitle>
          <AlertDescription>{erro}</AlertDescription>
        </Alert>

      )}



      <div className="space-y-5">


        <div className="field-stack">
          <Label htmlFor="nome">Nome</Label>
          <Input
            id="nome"
            placeholder="Nome do jogador"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>



        <div className="form-grid">


          <div className="field-stack">
            <Label htmlFor="overall">Overall</Label>
            <Input
              id="overall"
              type="number"
              min={0}
              max={100}
              placeholder="0 a 100"
              value={overall}
              onChange={(e) => setOverall(e.target.value)}
            />
          </div>



          <div className="field-stack">
            <Label htmlFor="chute">Chute</Label>
            <Input
              id="chute"
              type="number"
              min={0}
              max={100}
              placeholder="0 a 100"
              value={chute}
              onChange={(e) => setChute(e.target.value)}
            />
          </div>



          <div className="field-stack">
            <Label htmlFor="passe">Passe</Label>
            <Input
              id="passe"
              type="number"
              min={0}
              max={100}
              placeholder="0 a 100"
              value={passe}
              onChange={(e) => setPasse(e.target.value)}
            />
          </div>



          <div className="field-stack">
            <Label htmlFor="fisico">Físico</Label>
            <Input
              id="fisico"
              type="number"
              min={0}
              max={100}
              placeholder="0 a 100"
              value={fisico}
              onChange={(e) => setFisico(e.target.value)}
            />
          </div>


        </div>



        <Button

          className="h-10 w-full"

          onClick={handleSubmit}

        >

          <Save size={18} />
          {buttonText}

        </Button>


      </div>

      </CardContent>

    </Card>

  )

}
