"use client";

import { useState } from "react";
import Image from "next/image";
import { AlertCircle, CheckCircle2, LogIn, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";

type Mode = "login" | "cadastro";

export default function AuthForm({
  defaultMode = "login",
}: {
  defaultMode?: Mode;
}) {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>(defaultMode);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [aviso, setAviso] = useState("");
  const [carregando, setCarregando] = useState(false);

  const isLogin = mode === "login";

  function trocarModo(novo: Mode) {
    if (novo === mode) return;
    setMode(novo);
    setErro("");
    setAviso("");
  }

  async function fazerLogin() {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      setErro(error.message);
      setCarregando(false);
      return;
    }

    // Conta precisa estar aprovada por um admin.
    const { data: solicitacao } = await supabase
      .from("solicitacoes_cadastro")
      .select("status")
      .eq("usuario_id", data.user.id)
      .maybeSingle();

    if (solicitacao?.status === "pendente" || solicitacao?.status === "rejeitado") {
      await supabase.auth.signOut();
      setCarregando(false);
      setErro(
        solicitacao.status === "pendente"
          ? "Seu cadastro ainda está em análise. Aguarde a aprovação de um admin."
          : "Seu cadastro não foi aprovado. Fale com um admin.",
      );
      return;
    }

    router.push("/");
    router.refresh();
  }

  async function fazerCadastro() {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: senha,
      options: { data: { nome } },
    });

    if (error) {
      setErro(error.message);
      setCarregando(false);
      return;
    }

    // Registra a solicitação pendente (RLS: só a própria).
    if (data.user) {
      const { error: solErro } = await supabase
        .from("solicitacoes_cadastro")
        .insert({ usuario_id: data.user.id, nome, email });

      if (solErro) {
        setErro("Erro ao registrar a solicitação: " + solErro.message);
        setCarregando(false);
        return;
      }
    }

    // Não deixa entrar; some com a sessão e volta pro modo login com o aviso.
    await supabase.auth.signOut();
    setCarregando(false);
    setMode("login");
    setSenha("");
    setNome("");
    setAviso(
      "Cadastro enviado! Sua conta será liberada após a aprovação de um admin.",
    );
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (carregando) return;

    setErro("");
    setAviso("");
    setCarregando(true);

    if (isLogin) {
      await fazerLogin();
    } else {
      await fazerCadastro();
    }
  }

  return (
    <main className="app-page flex items-center justify-center">
      <Card className="surface-card w-full max-w-md p-8">
        <div className="mb-6 text-center">
          <Image
            src="/gurizes-logo.png"
            alt="Gurizes FC"
            width={80}
            height={80}
            className="mx-auto mb-4 size-20 rounded-lg"
          />
          <p className="page-kicker">{isLogin ? "Acesso" : "Novo acesso"}</p>
          <h1 className="mt-2 text-3xl font-black">
            {isLogin ? "Entrar" : "Criar conta"}
          </h1>
        </div>

        {/* Alternância Entrar / Criar conta */}
        <div className="mb-6 grid grid-cols-2 gap-1 rounded-lg border border-border bg-secondary/40 p-1">
          {(["login", "cadastro"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => trocarModo(m)}
              aria-pressed={mode === m}
              className={cn(
                "h-9 rounded-md text-sm font-semibold transition",
                mode === m
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {m === "login" ? "Entrar" : "Criar conta"}
            </button>
          ))}
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {aviso && (
            <Alert>
              <CheckCircle2 />
              <AlertTitle>Solicitação enviada</AlertTitle>
              <AlertDescription>{aviso}</AlertDescription>
            </Alert>
          )}

          {erro && (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>
                {isLogin
                  ? "Não foi possível entrar"
                  : "Não foi possível cadastrar"}
              </AlertTitle>
              <AlertDescription>{erro}</AlertDescription>
            </Alert>
          )}

          {!isLogin && (
            <div className="field-stack">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                placeholder="Nome do jogador"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
              />
            </div>
          )}

          <div className="field-stack">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="seu@email.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field-stack">
            <Label htmlFor="senha">Senha</Label>
            <Input
              id="senha"
              placeholder="Sua senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <Button type="submit" disabled={carregando} className="h-10 w-full">
            {isLogin ? <LogIn size={18} /> : <UserPlus size={18} />}
            {carregando
              ? isLogin
                ? "Entrando..."
                : "Criando conta..."
              : isLogin
                ? "Entrar"
                : "Cadastrar"}
          </Button>
        </form>
      </Card>
    </main>
  );
}
