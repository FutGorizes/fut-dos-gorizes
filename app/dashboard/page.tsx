import { LayoutDashboard } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";


export default function Dashboard() {
  return (
    <main className="app-page">
      <div className="content-shell">
        <Card className="surface-card">
          <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <span className="icon-tile">
              <LayoutDashboard size={20} />
            </span>

            <div>
              <p className="page-kicker">Visão geral</p>
              <h1 className="page-title">Dashboard</h1>
              <p className="mt-2 text-muted-foreground">
                Bem-vindo ao Fut dos Gurizes.
              </p>
            </div>
          </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
