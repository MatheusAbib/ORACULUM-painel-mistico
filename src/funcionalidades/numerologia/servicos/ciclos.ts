
export interface CiclosPessoais {
  anoPessoal: number;
  mesPessoal: number;
  diaPessoal: number;
  anoAtual: number;
  mesAtual: number;
  diaAtual: number;
}

function reduzirCiclo(numero: number): number {
  while (numero > 9) {
    numero = String(numero)
      .split("")
      .reduce((soma, digito) => soma + Number(digito), 0);
  }

  return numero;
}

function partesData(dataISO: string): {
  dia: number;
  mes: number;
  ano: number;
} {
  const [ano, mes, dia] = dataISO.split("-").map(Number);
  return { dia, mes, ano };
}

export function calcularCiclos(
  dataNascimento: string,
  hoje: Date = new Date()
): CiclosPessoais {
  const nasc = partesData(dataNascimento);
  const diaAtual = hoje.getDate();
  const mesAtual = hoje.getMonth() + 1;
  const anoAtual = hoje.getFullYear();

  const anoPessoal = reduzirCiclo(
    reduzirCiclo(nasc.dia) +
      reduzirCiclo(nasc.mes) +
      reduzirCiclo(diaAtual) +
      reduzirCiclo(mesAtual) +
      reduzirCiclo(anoAtual)
  );

  const mesPessoal = reduzirCiclo(
    anoPessoal + reduzirCiclo(mesAtual)
  );

  const diaPessoal = reduzirCiclo(
    mesPessoal + reduzirCiclo(diaAtual)
  );

  return {
    anoPessoal,
    mesPessoal,
    diaPessoal,
    anoAtual,
    mesAtual,
    diaAtual,
  };
}
