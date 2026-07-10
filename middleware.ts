import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,

    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,

    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);

            response.cookies.set(name, value);
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Rotas de auth: só para quem NÃO está logado.
  const rotaDeAuth = pathname === "/login" || pathname === "/cadastro";

  // Rotas públicas (não exigem login):
  // - as próprias telas de auth
  // - /auth/* (callback de OAuth precisa trocar o code por sessão)
  // - /api/* (chamadas de API não devem virar redirect de HTML)
  // - arquivos estáticos do /public (ex.: /gurizes-logo.png, /fifa-card1.png)
  const rotaPublica =
    rotaDeAuth ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/api") ||
    /\.[\w]+$/.test(pathname);

  // Não logado tentando acessar rota protegida -> manda pro login.
  if (!user && !rotaPublica) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user) {
    // Conta precisa estar aprovada. Usuários antigos não têm solicitação
    // (null) e são tratados como já aprovados.
    const { data: solicitacao } = await supabase
      .from("solicitacoes_cadastro")
      .select("status")
      .eq("usuario_id", user.id)
      .maybeSingle();

    const bloqueado =
      solicitacao?.status === "pendente" ||
      solicitacao?.status === "rejeitado";

    if (bloqueado) {
      // Só pode ver as telas de auth (onde aparece a mensagem de espera).
      if (!rotaDeAuth) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
      return response;
    }

    // Aprovado tentando ver login/cadastro -> manda pra dentro do app.
    if (rotaDeAuth) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
