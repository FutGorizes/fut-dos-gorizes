"use client"

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import {
  Camera,
  Dumbbell,
  Flame,
  Goal,
  Save,
  Shield,
  Target,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const posicoes = [
  { value: "GOL", label: "Goleiro" },
  { value: "ZAG", label: "Zagueiro" },
  { value: "LE", label: "Lateral Esquerdo" },
  { value: "LD", label: "Lateral Direito" },
  { value: "MC", label: "Meio Campo" },
  { value: "CA", label: "Centroavante" },
];


export default function ConfigurarJogador() {


  const router = useRouter();


  const [jogadorId, setJogadorId] = useState<number | null>(null);


  const [chute, setChute] = useState(0);
  const [passe, setPasse] = useState(0);
  const [drible, setDrible] = useState(0);
  const [marcacao, setMarcacao] = useState(0);
  const [fisico, setFisico] = useState(0);


  const [posicao, setPosicao] = useState("");
  const [posicaoSecundaria, setPosicaoSecundaria] = useState("");


  const [fotoUrl, setFotoUrl] = useState("");
  const [arquivoFoto, setArquivoFoto] = useState<File | null>(null);


  const [loading, setLoading] = useState(true);




  function calcularOverall() {


    switch(posicao){


      case "CA":

        return Math.round(
          (chute * 0.40) +
          (drible * 0.25) +
          (passe * 0.15) +
          (fisico * 0.15) +
          (marcacao * 0.05)
        );



      case "MC":

        return Math.round(
          (passe * 0.35) +
          (drible * 0.25) +
          (chute * 0.20) +
          (fisico * 0.10) +
          (marcacao * 0.10)
        );



      case "ZAG":

        return Math.round(
          (marcacao * 0.45) +
          (fisico * 0.30) +
          (passe * 0.10) +
          (drible * 0.10) +
          (chute * 0.05)
        );



      case "LE":
      case "LD":

        return Math.round(
          (fisico * 0.25) +
          (marcacao * 0.25) +
          (passe * 0.20) +
          (drible * 0.20) +
          (chute * 0.10)
        );



      case "GOL":

        return Math.round(
          (marcacao * 0.35) +
          (fisico * 0.30) +
          (passe * 0.20) +
          (drible * 0.10) +
          (chute * 0.05)
        );



      default:

        return Math.round(
          (
            chute +
            passe +
            drible +
            marcacao +
            fisico
          ) / 5
        );


    }


  }



  const overall = calcularOverall();






  useEffect(() => {


    async function carregarJogador() {


      const { data } = await supabase.auth.getUser();



      if (!data.user) {

        router.push("/login");

        return;

      }



      const { data: jogador } = await supabase
        .from("jogadores")
        .select("*")
        .eq(
          "usuario_id",
          data.user.id
        )
        .single();



      if (jogador) {


        setJogadorId(jogador.id);


        setChute(jogador.chute ?? 0);
        setPasse(jogador.passe ?? 0);
        setDrible(jogador.drible ?? 0);
        setMarcacao(jogador.marcacao ?? 0);
        setFisico(jogador.fisico ?? 0);


        setPosicao(
          jogador.posicao ?? ""
        );


        setPosicaoSecundaria(
          jogador.posicao_secundaria ?? ""
        );


        setFotoUrl(
          jogador.foto_url ?? ""
        );


      }


      setLoading(false);


    }


    carregarJogador();


  }, [router]);






  async function uploadFoto() {


    if(!arquivoFoto) {

      return fotoUrl;

    }



    const extensao = arquivoFoto.name.split(".").pop();



    const nomeArquivo =
      `${Date.now()}.${extensao}`;



    const { error } = await supabase.storage
      .from("jogadores")
      .upload(
        nomeArquivo,
        arquivoFoto
      );



    if(error){

      toast.error("Erro ao enviar foto: " + error.message);

      return fotoUrl;

    }




    const { data } =
      supabase.storage
      .from("jogadores")
      .getPublicUrl(nomeArquivo);



    return data.publicUrl;


  }
    async function salvar() {


    if (!jogadorId) return;



    const novaFotoUrl = await uploadFoto();



    const { error } = await supabase
      .from("jogadores")
      .update({

        chute,
        passe,
        drible,
        marcacao,
        fisico,

        posicao,

        posicao_secundaria:
          posicaoSecundaria,

        overall,

        foto_url:
          novaFotoUrl,

      })
      .eq(
        "id",
        jogadorId
      );



    if(error){

      toast.error(error.message);

      return;

    }



    toast.success(`Jogador atualizado. Overall: ${overall}`);


    router.push("/");


  }







  if(loading){

    return (
      <main className="app-page">
        <div className="content-shell text-muted-foreground">
          Carregando...
        </div>
      </main>
    )

  }

  const attributeFields = [
    {
      id: "chute",
      label: "Chute",
      icon: Goal,
      value: chute,
      setValue: setChute,
    },
    {
      id: "passe",
      label: "Passe",
      icon: Target,
      value: passe,
      setValue: setPasse,
    },
    {
      id: "drible",
      label: "Drible",
      icon: Flame,
      value: drible,
      setValue: setDrible,
    },
    {
      id: "marcacao",
      label: "Marcação",
      icon: Shield,
      value: marcacao,
      setValue: setMarcacao,
    },
    {
      id: "fisico",
      label: "Físico",
      icon: Dumbbell,
      value: fisico,
      setValue: setFisico,
    },
  ];

  return (
    <main className="app-page flex justify-center">
      <Card className="surface-card w-full max-w-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="icon-tile">
              <UserRound size={20} />
            </span>
            <div>
              <p className="page-kicker">Meu perfil</p>
              <CardTitle className="font-heading text-3xl font-black">
                Configurar Jogador
              </CardTitle>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="size-32 rounded-lg after:rounded-lg">
              {fotoUrl && (
                <AvatarImage
                  src={fotoUrl}
                  alt="Foto do jogador"
                  className="rounded-lg"
                />
              )}
              <AvatarFallback className="rounded-lg bg-secondary text-muted-foreground">
                <UserRound size={42} />
              </AvatarFallback>
            </Avatar>

            <Label
              htmlFor="foto"
              className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-secondary px-4 font-semibold transition hover:border-accent/60"
            >
              <Camera size={16} />
              Escolher arquivo
            </Label>
            <Input
              id="foto"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e)=>{
                const arquivo = e.target.files?.[0];

                if(arquivo){
                  setArquivoFoto(arquivo);
                  setFotoUrl(URL.createObjectURL(arquivo));
                }
              }}
            />
          </div>

          <div className="rounded-lg border border-accent/40 bg-[#111111] p-4 text-center text-white">
            <p className="text-sm text-white/60">Overall</p>
            <Badge className="mt-2 h-auto rounded-lg bg-accent px-4 py-2 text-5xl font-black text-accent-foreground hover:bg-accent">
              {overall}
            </Badge>
          </div>

          <div className="form-grid">
            {attributeFields.map((field) => {
              const Icon = field.icon;

              return (
                <div className="field-stack" key={field.id}>
                  <Label htmlFor={field.id}>
                    <Icon size={16} className="text-accent" />
                    {field.label}
                  </Label>
                  <Input
                    id={field.id}
                    type="number"
                    min={0}
                    max={100}
                    value={field.value}
                    onChange={(e)=> field.setValue(Number(e.target.value))}
                  />
                </div>
              );
            })}
          </div>

          <div className="field-stack">
            <Label>Posição principal</Label>
            <Select value={posicao || null} onValueChange={(value) => setPosicao(value ?? "")}>
              <SelectTrigger className="h-10 w-full bg-card">
                <SelectValue placeholder="Escolha a posição principal" />
              </SelectTrigger>
              <SelectContent>
                {posicoes.map((posicaoItem) => (
                  <SelectItem key={posicaoItem.value} value={posicaoItem.value}>
                    {posicaoItem.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="field-stack">
            <Label>Posição secundária</Label>
            <Select value={posicaoSecundaria || null} onValueChange={(value) => setPosicaoSecundaria(value ?? "")}>
              <SelectTrigger className="h-10 w-full bg-card">
                <SelectValue placeholder="Escolha a posição secundária" />
              </SelectTrigger>
              <SelectContent>
                {posicoes.map((posicaoItem) => (
                  <SelectItem key={posicaoItem.value} value={posicaoItem.value}>
                    {posicaoItem.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            className="h-10 w-full cursor-pointer"
            onClick={salvar}
          >
            <Save size={18} />
            Salvar Jogador
          </Button>
        </CardContent>
      </Card>
    </main>
  );

}
