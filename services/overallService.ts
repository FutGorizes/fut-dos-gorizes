export type OverallEvolution = {

  overallAntes: number;

  notaComunidade: number;

  diferencaNota: number;

  variacao: number;

  overallDepois: number;

};





export function calculateOverallEvolution(

  overallAtual: number,

  notaComunidade: number

): OverallEvolution {



  const diferencaNota =

    notaComunidade - overallAtual;





  // Peso que uma avaliação tem na evolução

  // 20% da diferença entre overall e nota

  const pesoEvolucao = 0.2;






  const variacao = Number(

    (

      diferencaNota *

      pesoEvolucao

    )

    .toFixed(1)

  );






  let overallDepois = Math.round(

    overallAtual + variacao

  );







  // Nunca ultrapassar 100

  if(overallDepois > 100){

    overallDepois = 100;

  }







  // Nunca ficar abaixo de 1

  if(overallDepois < 1){

    overallDepois = 1;

  }








  return {


    overallAntes: overallAtual,


    notaComunidade,


    diferencaNota,


    variacao,


    overallDepois,


  };


}