import { Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";


export default function Ranking() {
  return (
    <main className="app-page">
      <div className="content-shell">
        <Card className="surface-card">
          <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <span className="icon-tile">
              <Trophy size={20} />
            </span>

            <div>
              <p className="page-kicker">Desempenho</p>
              <h1 className="page-title">Ranking</h1>
              <p className="mt-2 text-muted-foreground">
                Ranking dos jogadores.
              </p>
            </div>
          </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
