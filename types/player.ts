export type Player = {
  id?: number;
  nome: string;
  foto_url?: string;
  foto_sem_fundo_url?: string;
  card_template?: string;
  overall: number;
  chute: number;
  passe: number;
  drible: number;
  marcacao: number;
  fisico: number;
  posicao: string;
  posicao_secundaria: string;
};

export type CardPlayer = Player & {
  posicao?: string;
  posicao_secundaria?: string;
};
