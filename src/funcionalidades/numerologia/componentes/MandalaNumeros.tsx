import { useId } from "react";
import { Icon } from "@iconify/react";
import type { NumeroInfo } from "../PainelNumerologia";
import "./MandalaNumeros.scss";

interface Props {
  numeros: NumeroInfo[];
  chaveAtiva: string;
  aoSelecionar: (chave: string) => void;
}

const POSICOES = [
  { x: 50, y: 13 },
  { x: 82, y: 31.5 },
  { x: 82, y: 68.5 },
  { x: 50, y: 87 },
  { x: 18, y: 68.5 },
  { x: 18, y: 31.5 },
];

const SIMBOLOS = [
  "mdi:star-four-points",
  "mdi:moon-waning-crescent",
  "mdi:creation",
  "mdi:weather-sunny",
  "mdi:star-four-points-outline",
  "mdi:moon-waxing-crescent",
];

export function MandalaNumeros({
  numeros,
  chaveAtiva,
  aoSelecionar,
}: Props) {
  const centro = numeros[0];
  const idBase = useId().replace(/:/g, "");

  function rolarPara(chave: string) {
    aoSelecionar(chave);

    window.requestAnimationFrame(() => {
      const elemento = document.querySelector(
        ".painel-numerologia__layout"
      );

      elemento?.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
          ? "auto"
          : "smooth",
        block: "start",
      });
    });
  }

  return (
    <div className="mandala-numeros">
      <div className="mandala-numeros__cabecalho">
        <span>DIAGRAMA DOS SETE NÚMEROS</span>
        <Icon icon="mdi:star-four-points" />
        <span>FIGURA I</span>
      </div>

      <div className="mandala-numeros__svg-wrapper">
        <svg
          viewBox="0 0 100 100"
          className="mandala-numeros__svg"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            <radialGradient
              id={`${idBase}-fundo`}
              cx="50%"
              cy="50%"
              r="50%"
            >
              <stop
                offset="0%"
                stopColor="#d7ad68"
                stopOpacity="0.12"
              />
              <stop
                offset="100%"
                stopColor="#d7ad68"
                stopOpacity="0"
              />
            </radialGradient>
          </defs>

          <circle
            cx="50"
            cy="50"
            r="48"
            className="mandala-numeros__circulo-externo"
          />

          <circle
            cx="50"
            cy="50"
            r="45"
            className="mandala-numeros__circulo-intermediario"
          />

          <circle
            cx="50"
            cy="50"
            r="37"
            className="mandala-numeros__circulo-principal"
          />

          <circle
            cx="50"
            cy="50"
            r="28"
            className="mandala-numeros__circulo-interno"
          />

          <circle
            cx="50"
            cy="50"
            r="19"
            className="mandala-numeros__circulo-central"
          />

          <circle
            cx="50"
            cy="50"
            r="37"
            fill={`url(#${idBase}-fundo)`}
          />

          {POSICOES.map((posicao, indice) => (
            <line
              key={`raio-${indice}`}
              x1="50"
              y1="50"
              x2={posicao.x}
              y2={posicao.y}
              className="mandala-numeros__linha-radial"
            />
          ))}

          {POSICOES.map((posicao, indice) => {
            const proxima =
              POSICOES[(indice + 1) % POSICOES.length];

            return (
              <line
                key={`hexagono-${indice}`}
                x1={posicao.x}
                y1={posicao.y}
                x2={proxima.x}
                y2={proxima.y}
                className="mandala-numeros__linha-hexagono"
              />
            );
          })}

          {POSICOES.map((posicao, indice) => {
            const oposta =
              POSICOES[(indice + 2) % POSICOES.length];

            return (
              <line
                key={`geometria-${indice}`}
                x1={posicao.x}
                y1={posicao.y}
                x2={oposta.x}
                y2={oposta.y}
                className="mandala-numeros__linha-geometrica"
              />
            );
          })}

          {Array.from({ length: 36 }, (_, indice) => {
            const angulo = (indice * 10 * Math.PI) / 180;
            const principal = indice % 3 === 0;
            const raioInterno = principal ? 45.5 : 46.5;

            return (
              <line
                key={`marca-${indice}`}
                x1={50 + Math.sin(angulo) * raioInterno}
                y1={50 - Math.cos(angulo) * raioInterno}
                x2={50 + Math.sin(angulo) * 47.5}
                y2={50 - Math.cos(angulo) * 47.5}
                className={
                  principal
                    ? "mandala-numeros__marca-principal"
                    : "mandala-numeros__marca-secundaria"
                }
              />
            );
          })}

          <path
            d="M50 3 L51.2 5.5 L50 8 L48.8 5.5 Z"
            className="mandala-numeros__ornamento"
          />

          <path
            d="M50 92 L51.2 94.5 L50 97 L48.8 94.5 Z"
            className="mandala-numeros__ornamento"
          />

          <path
            d="M3 50 L5.5 48.8 L8 50 L5.5 51.2 Z"
            className="mandala-numeros__ornamento"
          />

          <path
            d="M92 50 L94.5 48.8 L97 50 L94.5 51.2 Z"
            className="mandala-numeros__ornamento"
          />
        </svg>

        <div className="mandala-numeros__centro-decoracao">
          <Icon icon="mdi:star-four-points" />
        </div>

        {centro && (
          <button
            type="button"
            className={`mandala-numeros__no mandala-numeros__no--centro ${
              chaveAtiva === centro.chave ? "ativo" : ""
            }`}
            style={{ left: "50%", top: "50%" }}
            onClick={() => rolarPara(centro.chave)}
            aria-pressed={chaveAtiva === centro.chave}
            aria-label={`${centro.titulo}: ${centro.numero}`}
          >
            <span className="mandala-numeros__no-ornamento">
              <Icon icon="mdi:star-four-points" />
            </span>

            <span className="mandala-numeros__valor">
              {centro.numero}
            </span>

            <span className="mandala-numeros__rotulo">
              {centro.titulo}
            </span>
          </button>
        )}

        {numeros.slice(1, 7).map((info, indice) => {
          const posicao = POSICOES[indice];
          const ativo = chaveAtiva === info.chave;

          return (
            <button
              key={info.chave}
              type="button"
              className={`mandala-numeros__no ${
                ativo ? "ativo" : ""
              }`}
              style={{
                left: `${posicao.x}%`,
                top: `${posicao.y}%`,
              }}
              onClick={() => rolarPara(info.chave)}
              aria-pressed={ativo}
              aria-label={`${info.titulo}: ${info.numero}`}
            >
              <span className="mandala-numeros__no-ornamento">
                <Icon icon={SIMBOLOS[indice]} />
              </span>

              <span className="mandala-numeros__valor">
                {info.numero}
              </span>

              <span className="mandala-numeros__rotulo">
                {info.titulo}
              </span>
            </button>
          );
        })}
      </div>

      <div className="mandala-numeros__rodape">
        <Icon icon="mdi:star-four-points" />
        <span>SELECIONE UM NÚMERO PARA CONSULTAR SUA LEITURA</span>
        <Icon icon="mdi:star-four-points" />
      </div>
    </div>
  );
}