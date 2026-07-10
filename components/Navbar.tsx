"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  CalendarDays,
  LayoutDashboard,
  LogOut,
  Menu,
  Shield,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  requiresAuth?: boolean;
  requiresAdmin?: boolean;
};

const navItems: NavItem[] = [
  {
    href: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/jogadores",
    label: "Jogadores",
    icon: UsersRound,
  },
  {
    href: "/jogador/configurar",
    label: "Meu Jogador",
    icon: UserRound,
    requiresAuth: true,
  },
  {
    href: "/partidas",
    label: "Partidas",
    icon: CalendarDays,
  },
  {
    href: "/ranking",
    label: "Ranking",
    icon: BarChart3,
  },
  {
    href: "/admin/solicitacoes",
    label: "Solicitações",
    icon: ShieldCheck,
    requiresAdmin: true,
  },
];


export default function Navbar({
  initialUserId = null,
}: {
  initialUserId?: string | null;
}) {

  const router = useRouter();
  const pathname = usePathname();

  // Estado inicial vem do servidor (via layout) para não piscar em páginas logadas.
  const [usuario, setUsuario] = useState<string | null>(initialUserId);
  const [nome, setNome] = useState("");
  const [admin, setAdmin] = useState(false);



  useEffect(() => {


    async function verificarUsuario() {


      const { data } = await supabase.auth.getUser();


      if(data.user){

        setUsuario(data.user.id);


        const { data: jogador } = await supabase
          .from("jogadores")
          .select("nome, admin")
          .eq("usuario_id", data.user.id)
          .single();



        if(jogador){

          setNome(jogador.nome);
          setAdmin(jogador.admin === true);

        }

      }


    }


    verificarUsuario();



    const {
      data: listener
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {


        setUsuario(session?.user.id ?? null);



        if(session?.user){


          const { data: jogador } = await supabase
            .from("jogadores")
            .select("nome, admin")
            .eq("usuario_id", session.user.id)
            .single();



          if(jogador){

            setNome(jogador.nome);
            setAdmin(jogador.admin === true);

          }


        } else {

          setNome("");
          setAdmin(false);

        }


      }
    );



    return () => {

      listener.subscription.unsubscribe();

    };


  }, []);





  async function sair(){

    await supabase.auth.signOut();

    setUsuario(null);
    setNome("");

    router.push("/login");
    router.refresh();

  }

  // Sem usuário logado, não mostra o header (esconde na hora ao deslogar).
  if (!usuario) return null;

  const visibleNavItems = navItems.filter(
    (item) =>
      (!item.requiresAuth || usuario) && (!item.requiresAdmin || admin),
  );

  const linkClassName = (href: string) =>
    cn(
      "h-10 justify-start gap-2 px-3 font-medium text-white/75 hover:bg-white/10 hover:text-white [&_svg]:size-4",
      pathname === href && "bg-white/10 text-white"
    );

  const mobileLinkClassName = (href: string) =>
    cn(
      "flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white [&_svg]:size-4",
      pathname === href && "bg-white/10 text-white"
    );

  const renderAuthActions = (mobile = false) => (
    usuario ? (
      <>
        <div
          className={cn(
            "inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white/70 [&_svg]:size-4",
            mobile && "w-full justify-start"
          )}
        >
          <UserRound className="size-4" />
          <span className="truncate">{nome || "Jogador"}</span>
        </div>

        <Button
          variant="outline"
          onClick={sair}
          className={cn(
            "h-10 border-white/10 bg-transparent px-3 text-white/75 hover:bg-white/10 hover:text-white",
            mobile && "w-full justify-start"
          )}
        >
          <LogOut className="size-4" />
          Sair
        </Button>
      </>
    ) : (
      <>
        <Button
          variant="outline"
          render={<Link href="/login" />}
          className={cn(
            "h-10 border-white/15 bg-transparent px-3 text-white/80 hover:bg-white/10 hover:text-white",
            mobile && "w-full justify-start"
          )}
        >
          Entrar
        </Button>

        <Button
          render={<Link href="/cadastro" />}
          className={cn(
            "h-10 bg-accent px-3 font-bold text-accent-foreground hover:bg-accent/90",
            mobile && "w-full justify-start"
          )}
        >
          <Shield className="size-4" />
          Cadastro
        </Button>
      </>
    )
  );




  return (

    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#111111]/95 px-4 py-3 text-white shadow-sm backdrop-blur supports-[backdrop-filter]:bg-[#111111]/85 sm:px-6 lg:px-8">


      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <BrandLogo />

        <div className="hidden items-center gap-1 lg:flex">
          {visibleNavItems.map((item) => {
            const Icon = item.icon;

            return (
              <Button
                key={item.href}
                variant="ghost"
                render={<Link href={item.href} />}
                className={linkClassName(item.href)}
              >
                <Icon className="size-4" />
                {item.label}
              </Button>
            );
          })}
        </div>

        <div className="hidden items-center gap-2 lg:flex">
          {renderAuthActions()}
        </div>

        <Sheet>
          <SheetTrigger
            render={
              <Button
                variant="outline"
                size="icon-lg"
                className="border-white/10 bg-transparent text-white hover:bg-white/10 lg:hidden"
              />
            }
          >
            <Menu className="size-5" />
            <span className="sr-only">Abrir menu</span>
          </SheetTrigger>

          <SheetContent className="border-white/10 bg-[#111111] text-white" side="right">
            <SheetHeader>
              <SheetTitle className="sr-only">Menu principal</SheetTitle>
              <BrandLogo />
            </SheetHeader>

            <div className="px-4">
              <Separator className="bg-white/10" />
            </div>

            <div className="grid gap-1 px-4">
              {visibleNavItems.map((item) => {
                const Icon = item.icon;

                return (
                  <SheetClose
                    key={item.href}
                    render={<Link href={item.href} className={mobileLinkClassName(item.href)} />}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </SheetClose>
                );
              })}
            </div>

            <div className="px-4">
              <Separator className="bg-white/10" />
            </div>

            <div className="grid gap-2 px-4">
              {renderAuthActions(true)}
            </div>
          </SheetContent>
        </Sheet>

      </div>


    </nav>

  );

}
