"use client";

import { useState } from "react";
import Image from "next/image";
import { AlertCircle, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";


export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  async function entrar() {
    setErro("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: senha,
    });

    if (error) {
      setErro(error.message);
      return;
    }

    router.push("/partidas");
    router.refresh();
  }

  return (
    <main className="app-page flex items-center justify-center">
      <Card className="surface-card w-full max-w-md p-8">
        <div className="mb-8 text-center">
          <Image
            src="/gurizes-logo.png"
            alt="Gurizes FC"
            width={80}
            height={80}
            className="mx-auto mb-4 size-20 rounded-lg"
          />
          <p className="page-kicker">Acesso</p>
          <h1 className="mt-2 text-3xl font-black">Entrar</h1>
        </div>

        <div className="space-y-4">
          {erro && (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>Não foi possível entrar</AlertTitle>
              <AlertDescription>{erro}</AlertDescription>
            </Alert>
          )}

          <div className="field-stack">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              placeholder="seu@email.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            />
          </div>

          <Button onClick={entrar} className="h-10 w-full">
            <LogIn size={18} />
            Entrar
          </Button>
        </div>
      </Card>
    </main>
  );
}
