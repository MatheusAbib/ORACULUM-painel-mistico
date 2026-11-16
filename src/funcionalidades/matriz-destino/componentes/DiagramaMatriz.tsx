import { useId, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import type { PontosMatriz } from "../servicos/matrizDestino";
import { ARCANOS } from "../dados/arcanos";
import "./DiagramaMatriz.scss";

interface Props {
  pontos: PontosMatriz;
}

type ChavePonto = keyof PontosMatriz;

interface PosicaoPonto {
  chave: ChavePonto;
  x: number;
  y: number;
  rotulo: string;
}

const PONTOS_POSICAO: PosicaoPonto[] = [
  { chave: "C", x: 50, y: 10, rotulo: "Céu (Talento)" },
  { chave: "L", x: 50, y: 28, rotulo: "Dharma" },
  { chave: "D", x: 85, y: 22, rotulo: "Direita (Mãe)" },
  { chave: "E", x: 15, y: 22, rotulo: "Esquerda (Pai)" },
  { chave: "A", x: 50, y: 50, rotulo: "Eu (Personalidade)" },
  { chave: "M", x: 85, y: 50, rotulo: "Propósito" },
  { chave: "F", x: 15, y: 50, rotulo: "Passado" },
  { chave: "B", x: 50, y: 72, rotulo: "Futuro" },
  { chave: "K", x: 50, y: 62, rotulo: "Karma" },
  { chave: "I", x: 85, y: 78, rotulo: "Finanças" },
  { chave: "G", x: 15, y: 78, rotulo: "Saúde" },
  { chave: "H", x: 50, y: 90, rotulo: "Terra (Missão)" },
  { chave: "J", x: 50, y: 40, rotulo: "Ancestral" },
];

export function DiagramaMatriz({ pontos }: Props) {
  const [selecionado, setSelecionado] = useState<ChavePonto | null>(null);
  const detalheRef = useRef<HTMLElement>(null);
  const rolagemPendenteRef = useRef(false);
  const idBase = useId().replace(/:/g, "");

  const idGradiente = `${idBase}-gradiente`;
  const idCentro = `${idBase}-centro`;

  const pontoSelecionado = selecionado
    ? PONTOS_POSICAO.find((ponto) => ponto.chave === selecionado)
    : null;

  const arcanoSelecionado = selecionado
    ? ARCANOS[pontos[selecionado]]
    : null;

  const rolarParaInterpretacao = (elemento: HTMLElement | null) => {
    detalheRef.current = elemento;

    if (!elemento || !rolagemPendenteRef.current) {
      return;
    }

    rolagemPendenteRef.current = false;

    requestAnimationFrame(() => {
      const movimentoReduzido = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      elemento.scrollIntoView({
        behavior: movimentoReduzido ? "auto" : "smooth",
        block: "start",
      });
    });
  };

  const selecionarPonto = (chave: ChavePonto) => {
    if (selecionado === chave && detalheRef.current) {
      const movimentoReduzido = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      detalheRef.current.scrollIntoView({
        behavior: movimentoReduzido ? "auto" : "smooth",
        block: "start",
      });

      return;
    }

    rolagemPendenteRef.current = true;
    setSelecionado(chave);
  };

  return (
    <section className="diagrama-matriz">
      <div className="diagrama-matriz__quadro">
        <div className="diagrama-matriz__quadro-cabecalho">
          <span>FIGURA GEOMÉTRICA</span>
          <Icon icon="mdi:rhombus-outline" />
          <span>XIII POSIÇÕES</span>
        </div>

        <div className="diagrama-matriz__svg-wrapper">
          <svg
            viewBox="0 0 100 100"
            className="diagrama-matriz__svg"
            preserveAspectRatio="xMidYMid meet"
            role="group"
            aria-label="Diagrama interativo da Matriz do Destino com treze pontos"
          >
            <defs>
              <radialGradient id={idCentro} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#D7AD68" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#D7AD68" stopOpacity="0" />
              </radialGradient>

              <linearGradient
                id={idGradiente}
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#D7AD68" />
                <stop offset="100%" stopColor="#B9764E" />
              </linearGradient>
            </defs>

            <circle
              cx="50"
              cy="50"
              r="47"
              className="diagrama-matriz__circulo-externo"
            />

            <circle
              cx="50"
              cy="50"
              r="44"
              className="diagrama-matriz__circulo-interno"
            />

            <circle
              cx="50"
              cy="50"
              r="39"
              className="diagrama-matriz__circulo-guia"
            />

            <rect
              x="18"
              y="18"
              width="64"
              height="64"
              className="diagrama-matriz__geometria"
            />

            <rect
              x="18"
              y="18"
              width="64"
              height="64"
              transform="rotate(45 50 50)"
              className="diagrama-matriz__geometria"
            />

            <line
              x1="50"
              y1="5"
              x2="50"
              y2="95"
              className="diagrama-matriz__eixo"
            />

            <line
              x1="5"
              y1="50"
              x2="95"
              y2="50"
              className="diagrama-matriz__eixo"
            />

            <line
              x1="15"
              y1="22"
              x2="85"
              y2="78"
              className="diagrama-matriz__eixo-secundario"
            />

            <line
              x1="85"
              y1="22"
              x2="15"
              y2="78"
              className="diagrama-matriz__eixo-secundario"
            />

            <circle
              cx="50"
              cy="50"
              r="16"
              fill={`url(#${idCentro})`}
            />

            <circle
              cx="50"
              cy="50"
              r="9"
              className="diagrama-matriz__centro-anel"
            />

            <text
              x="50"
              y="4"
              textAnchor="middle"
              className="diagrama-matriz__marcacao"
            >
              N
            </text>

            <text
              x="96"
              y="51"
              textAnchor="middle"
              className="diagrama-matriz__marcacao"
            >
              L
            </text>

            <text
              x="50"
              y="98"
              textAnchor="middle"
              className="diagrama-matriz__marcacao"
            >
              S
            </text>

            <text
              x="4"
              y="51"
              textAnchor="middle"
              className="diagrama-matriz__marcacao"
            >
              O
            </text>

            {PONTOS_POSICAO.map((ponto) => {
              const ativo = selecionado === ponto.chave;
              const valor = pontos[ponto.chave];
              const central = ponto.chave === "A";
              const raio = central ? 7 : 6;

              return (
                <g
                  key={ponto.chave}
                  className={`diagrama-matriz__ponto ${
                    ativo ? "ativo" : ""
                  } ${central ? "central" : ""}`}
                  role="button"
                  tabIndex={0}
                  aria-label={`Ponto ${ponto.chave}, ${ponto.rotulo}, arcano ${valor}`}
                  aria-pressed={ativo}
                  onClick={() => selecionarPonto(ponto.chave)}
                  onKeyDown={(evento) => {
                    if (evento.key === "Enter" || evento.key === " ") {
                      evento.preventDefault();
                      selecionarPonto(ponto.chave);
                    }
                  }}
                >
                  <title>
                    {`Ponto ${ponto.chave} — ${ponto.rotulo}: arcano ${valor}`}
                  </title>

                  <circle
                    cx={ponto.x}
                    cy={ponto.y}
                    r={raio + 0.9}
                    className="diagrama-matriz__ponto-anel"
                  />

                  <circle
                    cx={ponto.x}
                    cy={ponto.y}
                    r={raio}
                    className="diagrama-matriz__ponto-fundo"
                    fill={ativo ? `url(#${idGradiente})` : undefined}
                  />

                  <text
                    x={ponto.x}
                    y={ponto.y - 1.1}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="diagrama-matriz__ponto-letra"
                    pointerEvents="none"
                  >
                    {ponto.chave}
                  </text>

                  <text
                    x={ponto.x}
                    y={ponto.y + 2.6}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="diagrama-matriz__ponto-valor"
                    pointerEvents="none"
                  >
                    {valor}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        <div className="diagrama-matriz__quadro-rodape">
          <span>ORACULVM</span>
          <span>MATRIZ DOS XXII ARCANOS</span>
        </div>
      </div>

      <p className="diagrama-matriz__instrucao">
        <Icon icon="mdi:cursor-default-click-outline" />
        <span>
          Selecione um dos treze pontos para consultar sua interpretação.
        </span>
      </p>

      {arcanoSelecionado && pontoSelecionado && (
        <article
          ref={rolarParaInterpretacao}
          className="diagrama-matriz__detalhe"
          style={{ scrollMarginTop: "110px" }}
          aria-live="polite"
        >
          <div className="diagrama-matriz__detalhe-moldura">
            <div className="diagrama-matriz__detalhe-identificacao">
              <span>INTERPRETAÇÃO · PONTO {pontoSelecionado.chave}</span>
              <span>ARCANO {arcanoSelecionado.numero}</span>
            </div>

            <header className="diagrama-matriz__detalhe-cabecalho">
              <div className="diagrama-matriz__detalhe-numero">
                {arcanoSelecionado.numero}
              </div>

              <div className="diagrama-matriz__detalhe-titulos">
                <span className="diagrama-matriz__detalhe-posicao">
                  {pontoSelecionado.rotulo}
                </span>

                <h3 className="diagrama-matriz__detalhe-titulo">
                  {arcanoSelecionado.nome}
                </h3>
              </div>
            </header>

            <div className="diagrama-matriz__destaque">
              <h4 className="diagrama-matriz__destaque-titulo">
                {arcanoSelecionado.titulo}
              </h4>

              <p className="diagrama-matriz__destaque-subtitulo">
                {arcanoSelecionado.subtitulo}
              </p>
            </div>

            <div className="diagrama-matriz__texto">
              {arcanoSelecionado.texto.map((paragrafo, indice) => (
                <p key={indice} className="diagrama-matriz__paragrafo">
                  {paragrafo}
                </p>
              ))}
            </div>

            <footer className="diagrama-matriz__detalhe-rodape">
              <span />
              <Icon icon="mdi:star-four-points" />
              <span />
            </footer>
          </div>
        </article>
      )}
    </section>
  );
}