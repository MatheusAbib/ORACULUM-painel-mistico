import { useMemo } from "react";
import { Icon } from "@iconify/react";
import { gerarCalendarioMensal, type DadosLua } from "../servicos/lunar";
import { IconeFaseLua } from "./IconeFaseLua";
import "./CalendarioMensal.scss";

interface Props {
  ano: number;
  mes: number;
  diaSelecionado: DadosLua;
  onSelecionarDia: (d: DadosLua) => void;
  onMesAnterior: () => void;
  onMesProximo: () => void;
  onIrParaHoje: () => void;
}

const NOMES_MESES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const DIAS_SEMANA = [
  { curto: "DOM", completo: "Domingo" },
  { curto: "SEG", completo: "Segunda-feira" },
  { curto: "TER", completo: "Terça-feira" },
  { curto: "QUA", completo: "Quarta-feira" },
  { curto: "QUI", completo: "Quinta-feira" },
  { curto: "SEX", completo: "Sexta-feira" },
  { curto: "SÁB", completo: "Sábado" },
];

function mesmaData(a: Date, b: Date): boolean {
  return (
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear()
  );
}

export function CalendarioMensal({
  ano,
  mes,
  diaSelecionado,
  onSelecionarDia,
  onMesAnterior,
  onMesProximo,
  onIrParaHoje,
}: Props) {
  const dias = useMemo(() => gerarCalendarioMensal(ano, mes), [ano, mes]);
  const primeiroDia = new Date(ano, mes - 1, 1).getDay();
  const hoje = new Date();
  const celulasVazias = Array.from(
    { length: primeiroDia },
    (_, indice) => indice
  );

  const mesAtual = NOMES_MESES[mes - 1];

  return (
    <div className="calendario-mensal">
      <header className="calendario-mensal__cabecalho">
        <div className="calendario-mensal__cabecalho-superior">
          <span>REGISTRO MENSAL</span>
          <span>ANNO {ano}</span>
        </div>

        <div className="calendario-mensal__navegacao">
          <button
            type="button"
            className="calendario-mensal__nav"
            onClick={onMesAnterior}
            aria-label="Mês anterior"
          >
            <Icon icon="mdi:chevron-left" />
          </button>

          <div className="calendario-mensal__titulo-area">
            <span className="calendario-mensal__titulo-rotulo">
              ALMANAQUE LUNAR
            </span>

            <h3 className="calendario-mensal__titulo">
              {mesAtual} <span>de {ano}</span>
            </h3>

            <button
              type="button"
              className="calendario-mensal__hoje-btn"
              onClick={onIrParaHoje}
            >
              <Icon icon="mdi:calendar-today" />
              <span>Ir para hoje</span>
            </button>
          </div>

          <button
            type="button"
            className="calendario-mensal__nav"
            onClick={onMesProximo}
            aria-label="Próximo mês"
          >
            <Icon icon="mdi:chevron-right" />
          </button>
        </div>
      </header>

      <div className="calendario-mensal__corpo">
        <div className="calendario-mensal__dias-semana">
          {DIAS_SEMANA.map((dia) => (
            <div
              key={dia.completo}
              className="calendario-mensal__dia-semana"
              title={dia.completo}
            >
              {dia.curto}
            </div>
          ))}
        </div>

        <div className="calendario-mensal__grade">
          {celulasVazias.map((indice) => (
            <div
              key={`vazio-${indice}`}
              className="calendario-mensal__celula-vazia"
              aria-hidden="true"
            />
          ))}

          {dias.map((dia) => {
            const ehHoje = mesmaData(dia.data, hoje);
            const ehSelecionado = mesmaData(
              dia.data,
              diaSelecionado.data
            );

            const classes = [
              "calendario-mensal__celula",
              ehHoje ? "hoje" : "",
              ehSelecionado ? "selecionado" : "",
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <button
                key={dia.data.toISOString()}
                type="button"
                className={classes}
                title={`${dia.nomeFase} — ${dia.iluminacao}% iluminada`}
                onClick={() => onSelecionarDia(dia)}
                aria-pressed={ehSelecionado}
                aria-label={`${dia.data.toLocaleDateString("pt-BR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}: ${dia.nomeFase}, ${dia.iluminacao}% iluminada${
                  ehHoje ? ", hoje" : ""
                }`}
              >
                <span className="calendario-mensal__celula-topo">
                  <span className="calendario-mensal__numero">
                    {dia.data.getDate()}
                  </span>

                  {ehHoje && (
                    <span
                      className="calendario-mensal__hoje-marcador"
                      aria-hidden="true"
                    />
                  )}
                </span>

                <span
                  className="calendario-mensal__fase"
                  aria-hidden="true"
                >
                  <IconeFaseLua fase={dia.fase} tamanho={26} />
                </span>

                <span className="calendario-mensal__iluminacao">
                  {dia.iluminacao}%
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <footer className="calendario-mensal__rodape">
        <div className="calendario-mensal__legenda">
          <span className="calendario-mensal__legenda-item">
            <span className="calendario-mensal__legenda-hoje" />
            Dia atual
          </span>

          <span className="calendario-mensal__legenda-item">
            <span className="calendario-mensal__legenda-selecionado" />
            Dia selecionado
          </span>
        </div>

        <span className="calendario-mensal__rodape-nota">
          ILUMINAÇÃO LUNAR POR DIA
        </span>
      </footer>
    </div>
  );
}