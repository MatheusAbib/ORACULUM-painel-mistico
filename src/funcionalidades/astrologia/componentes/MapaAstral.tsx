import { useId, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import type { ResultadoMapaAstral } from "../servicos/astrologia";
import { IconePlaneta } from "./IconePlaneta";
import { IconeSigno } from "./IconeSigno";
import { calcularAspectos } from "../servicos/aspectos";
import "./MapaAstral.scss";

interface Props {
  resultado: ResultadoMapaAstral;
}

const NOMES_SIGNOS = [
  "Áries",
  "Touro",
  "Gêmeos",
  "Câncer",
  "Leão",
  "Virgem",
  "Libra",
  "Escorpião",
  "Sagitário",
  "Capricórnio",
  "Aquário",
  "Peixes",
];

const CORES_ASPECTOS: Record<string, string> = {
  conjuncao: "#d7ad68",
  sextil: "#56827b",
  quadratura: "#b9764e",
  trigono: "#86a9b2",
  oposicao: "#89535d",
};

const NOMES_ASPECTOS: Record<string, string> = {
  conjuncao: "Conjunção",
  sextil: "Sextil",
  quadratura: "Quadratura",
  trigono: "Trígono",
  oposicao: "Oposição",
};

const TAMANHO = 700;
const CENTRO = TAMANHO / 2;
const RAIO_EXTERNO = 320;
const RAIO_ZODIACO = 264;
const RAIO_CASAS = 205;
const RAIO_ASPECTOS = 143;
const RAIO_PLANETAS = 182;

function normalizarGrau(grau: number) {
  return ((grau % 360) + 360) % 360;
}

function pontoNoCirculo(grau: number, raio: number) {
  const rad = ((grau - 90) * Math.PI) / 180;

  return {
    x: CENTRO + Math.cos(rad) * raio,
    y: CENTRO + Math.sin(rad) * raio,
  };
}

function distanciaAngular(a: number, b: number) {
  const diferenca = Math.abs(normalizarGrau(a - b));
  return Math.min(diferenca, 360 - diferenca);
}

function formatarGrau(grau: number) {
  const posicao = ((grau % 30) + 30) % 30;
  const graus = Math.floor(posicao);
  const minutos = Math.floor((posicao - graus) * 60);

  return `${String(graus).padStart(2, "0")}° ${String(minutos).padStart(2, "0")}′`;
}

function distribuirPlanetas(
  planetas: ResultadoMapaAstral["planetas"]
) {
  const ordenados = planetas
    .map((planeta, indice) => ({
      indice,
      longitude: normalizarGrau(planeta.longitude),
    }))
    .sort((a, b) => a.longitude - b.longitude);

  const posicoes = new Map<
    number,
    { grau: number; raio: number }
  >();

  const grupos: typeof ordenados[] = [];

  for (const planeta of ordenados) {
    const ultimoGrupo = grupos[grupos.length - 1];

    if (
      ultimoGrupo &&
      distanciaAngular(
        ultimoGrupo[ultimoGrupo.length - 1].longitude,
        planeta.longitude
      ) < 12
    ) {
      ultimoGrupo.push(planeta);
    } else {
      grupos.push([planeta]);
    }
  }

  if (grupos.length > 1) {
    const primeiro = grupos[0];
    const ultimo = grupos[grupos.length - 1];

    if (
      distanciaAngular(
        ultimo[ultimo.length - 1].longitude,
        primeiro[0].longitude
      ) < 12
    ) {
      ultimo.push(...primeiro);
      grupos.shift();
    }
  }

  for (const grupo of grupos) {
    if (grupo.length === 1) {
      posicoes.set(grupo[0].indice, {
        grau: grupo[0].longitude,
        raio: RAIO_PLANETAS,
      });

      continue;
    }

    const centroGrupo = grupo.reduce(
      (soma, planeta) => soma + planeta.longitude,
      0
    ) / grupo.length;

    grupo.forEach((planeta, indice) => {
      const deslocamento =
        (indice - (grupo.length - 1) / 2) * 11;

      posicoes.set(planeta.indice, {
        grau: normalizarGrau(
          grupo.length > 2
            ? planeta.longitude
            : centroGrupo + deslocamento
        ),
        raio:
          RAIO_PLANETAS +
          (indice % 2 === 0 ? -15 : 15),
      });
    });
  }

  return posicoes;
}

export function MapaAstral({ resultado }: Props) {
  const id = useId().replace(/:/g, "");
  const [aspectosVisiveis, setAspectosVisiveis] = useState(true);
  const [casasVisiveis, setCasasVisiveis] = useState(true);
  const [planetaSelecionado, setPlanetaSelecionado] = useState<
    number | null
  >(null);

  const aspectos = useMemo(
    () => calcularAspectos(resultado.planetas),
    [resultado.planetas]
  );

  const planetasPorNome = useMemo(
    () =>
      Object.fromEntries(
        resultado.planetas.map((planeta) => [
          planeta.nome,
          planeta,
        ])
      ),
    [resultado.planetas]
  );

  const posicoesPlanetas = useMemo(
    () => distribuirPlanetas(resultado.planetas),
    [resultado.planetas]
  );

  const planetaAtivo =
    planetaSelecionado !== null
      ? resultado.planetas[planetaSelecionado]
      : null;

  const aspectosAtivos = planetaAtivo
    ? aspectos.filter(
        (aspecto) =>
          aspecto.planetaA === planetaAtivo.nome ||
          aspecto.planetaB === planetaAtivo.nome
      )
    : aspectos;

  const gradienteFundo = `${id}-fundo`;
  const gradienteAnel = `${id}-anel`;
  const padraoPapel = `${id}-papel`;

  return (
    <section className="mapa-astral">


      <div className="mapa-astral__moldura">
        <div className="mapa-astral__moldura-topo">
          <span>FIGURA I · RODA ZODIACAL</span>
          <Icon icon="mdi:star-four-points" />
          <span>360° · XII SIGNOS</span>
        </div>

        <div className="mapa-astral__area">
          <div className="mapa-astral__roda">
            <svg
              className="mapa-astral__svg"
              viewBox={`0 0 ${TAMANHO} ${TAMANHO}`}
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Roda zodiacal com signos, casas, planetas e aspectos astrológicos"
            >
              <defs>
                <radialGradient
                  id={gradienteFundo}
                  cx="50%"
                  cy="50%"
                  r="50%"
                >
                  <stop
                    offset="0%"
                    stopColor="#f4e8cd"
                  />
                  <stop
                    offset="75%"
                    stopColor="#e9d8b4"
                  />
                  <stop
                    offset="100%"
                    stopColor="#cbb48b"
                  />
                </radialGradient>

                <linearGradient
                  id={gradienteAnel}
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="100%"
                >
                  <stop
                    offset="0%"
                    stopColor="#d7ad68"
                  />
                  <stop
                    offset="50%"
                    stopColor="#89535d"
                  />
                  <stop
                    offset="100%"
                    stopColor="#b9764e"
                  />
                </linearGradient>

                <pattern
                  id={padraoPapel}
                  width="8"
                  height="8"
                  patternUnits="userSpaceOnUse"
                >
                  <circle
                    cx="2"
                    cy="3"
                    r="0.35"
                    fill="#70564d"
                    opacity="0.12"
                  />
                  <circle
                    cx="6"
                    cy="7"
                    r="0.25"
                    fill="#70564d"
                    opacity="0.1"
                  />
                </pattern>
              </defs>

              <circle
                cx={CENTRO}
                cy={CENTRO}
                r={RAIO_EXTERNO + 14}
                fill="#201827"
                stroke="#b9764e"
                strokeWidth="2"
              />

              <circle
                cx={CENTRO}
                cy={CENTRO}
                r={RAIO_EXTERNO + 7}
                fill="none"
                stroke="#d7ad68"
                strokeWidth="0.8"
                strokeOpacity="0.65"
              />

              <circle
                cx={CENTRO}
                cy={CENTRO}
                r={RAIO_EXTERNO}
                fill={`url(#${gradienteFundo})`}
                stroke={`url(#${gradienteAnel})`}
                strokeWidth="2"
              />

              <circle
                cx={CENTRO}
                cy={CENTRO}
                r={RAIO_EXTERNO}
                fill={`url(#${padraoPapel})`}
              />

              <circle
                cx={CENTRO}
                cy={CENTRO}
                r={RAIO_ZODIACO}
                fill="none"
                stroke="#89535d"
                strokeWidth="1.5"
              />

              <circle
                cx={CENTRO}
                cy={CENTRO}
                r={RAIO_CASAS}
                fill="none"
                stroke="#b9764e"
                strokeWidth="1.2"
              />

              <circle
                cx={CENTRO}
                cy={CENTRO}
                r={RAIO_ASPECTOS}
                fill="#f4e8cd"
                fillOpacity="0.6"
                stroke="#b9764e"
                strokeWidth="1"
              />

              {Array.from({ length: 72 }, (_, indice) => {
                const grau = indice * 5;
                const principal = indice % 6 === 0;
                const inicio = pontoNoCirculo(
                  grau,
                  principal
                    ? RAIO_EXTERNO - 13
                    : RAIO_EXTERNO - 7
                );
                const fim = pontoNoCirculo(
                  grau,
                  RAIO_EXTERNO
                );

                return (
                  <line
                    key={`marca-${indice}`}
                    x1={inicio.x}
                    y1={inicio.y}
                    x2={fim.x}
                    y2={fim.y}
                    stroke="#70564d"
                    strokeWidth={principal ? 1.5 : 0.6}
                    strokeOpacity={principal ? 0.8 : 0.45}
                  />
                );
              })}

              {NOMES_SIGNOS.map((_, indice) => {
                const grau = indice * 30;
                const inicio = pontoNoCirculo(
                  grau,
                  RAIO_ZODIACO
                );
                const fim = pontoNoCirculo(
                  grau,
                  RAIO_EXTERNO
                );

                return (
                  <line
                    key={`signo-${indice}`}
                    x1={inicio.x}
                    y1={inicio.y}
                    x2={fim.x}
                    y2={fim.y}
                    stroke="#89535d"
                    strokeWidth="1.2"
                    strokeOpacity="0.8"
                  />
                );
              })}

              {casasVisiveis &&
                resultado.casas.map((cuspide, indice) => {
                  const proxima =
                    resultado.casas[(indice + 1) % 12];

                  const diferenca =
                    (proxima - cuspide + 360) % 360;

                  const inicio = pontoNoCirculo(
                    cuspide,
                    RAIO_ZODIACO
                  );

                  const fim = pontoNoCirculo(
                    cuspide,
                    RAIO_ASPECTOS
                  );

                  const meio = cuspide + diferenca / 2;

                  const numero = pontoNoCirculo(
                    meio,
                    RAIO_CASAS - 14
                  );

                  const casaAngular = [0, 3, 6, 9].includes(
                    indice
                  );

                  return (
                    <g key={`casa-${indice}`}>
                      <line
                        x1={inicio.x}
                        y1={inicio.y}
                        x2={fim.x}
                        y2={fim.y}
                        stroke={
                          casaAngular
                            ? "#89535d"
                            : "#b9764e"
                        }
                        strokeWidth={
                          casaAngular ? 2 : 0.9
                        }
                        strokeOpacity={
                          casaAngular ? 0.85 : 0.5
                        }
                      />

                      <text
                        x={numero.x}
                        y={numero.y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize="13"
                        fill="#70564d"
                        fontFamily="Cinzel, serif"
                        fontWeight={
                          casaAngular ? 700 : 500
                        }
                      >
                        {indice + 1}
                      </text>
                    </g>
                  );
                })}

              {aspectosVisiveis &&
                aspectosAtivos.map((aspecto, indice) => {
                  const planetaA =
                    planetasPorNome[aspecto.planetaA];

                  const planetaB =
                    planetasPorNome[aspecto.planetaB];

                  if (!planetaA || !planetaB) return null;

                  const a = pontoNoCirculo(
                    planetaA.longitude,
                    RAIO_ASPECTOS
                  );

                  const b = pontoNoCirculo(
                    planetaB.longitude,
                    RAIO_ASPECTOS
                  );

                  const tracejado =
                    aspecto.tipo === "quadratura" ||
                    aspecto.tipo === "oposicao";

                  return (
                    <line
                      key={`aspecto-${indice}`}
                      x1={a.x}
                      y1={a.y}
                      x2={b.x}
                      y2={b.y}
                      stroke={
                        CORES_ASPECTOS[aspecto.tipo] ||
                        "#b9764e"
                      }
                      strokeWidth={
                        planetaAtivo ? 2 : 1.3
                      }
                      strokeOpacity={
                        planetaAtivo ? 0.9 : 0.65
                      }
                      strokeDasharray={
                        tracejado ? "5 4" : undefined
                      }
                    />
                  );
                })}

              <circle
                cx={CENTRO}
                cy={CENTRO}
                r="30"
                fill="#e9d8b4"
                stroke="#b9764e"
                strokeWidth="1"
              />

              <circle
                cx={CENTRO}
                cy={CENTRO}
                r="22"
                fill="none"
                stroke="#89535d"
                strokeWidth="0.8"
              />

              <path
                d={`M ${CENTRO} ${CENTRO - 15} L ${CENTRO + 15} ${CENTRO} L ${CENTRO} ${CENTRO + 15} L ${CENTRO - 15} ${CENTRO} Z`}
                fill="none"
                stroke="#89535d"
                strokeWidth="1"
              />

              <circle
                cx={CENTRO}
                cy={CENTRO}
                r="3"
                fill="#89535d"
              />
            </svg>

            <div className="mapa-astral__sobreposicao">
              {NOMES_SIGNOS.map((nome, indice) => {
                const posicao = pontoNoCirculo(
                  indice * 30 + 15,
                  RAIO_ZODIACO + 27
                );

                return (
                  <div
                    key={nome}
                    className="mapa-astral__signo"
                    style={{
                      left: `${(posicao.x / TAMANHO) * 100}%`,
                      top: `${(posicao.y / TAMANHO) * 100}%`,
                    }}
                    title={nome}
                  >
                    <IconeSigno
                      signo={nome}
                      tamanho={32}
                    />
                  </div>
                );
              })}

              {resultado.planetas.map((planeta, indice) => {
                const posicaoVisual =
                  posicoesPlanetas.get(indice);

                const posicao = pontoNoCirculo(
                  posicaoVisual?.grau ??
                    planeta.longitude,
                  posicaoVisual?.raio ??
                    RAIO_PLANETAS
                );

                const selecionado =
                  planetaSelecionado === indice;

                const esmaecido =
                  planetaSelecionado !== null &&
                  !selecionado;

                return (
                  <button
                    key={`${planeta.nome}-${indice}`}
                    type="button"
                    className={[
                      "mapa-astral__planeta",
                      selecionado
                        ? "mapa-astral__planeta--selecionado"
                        : "",
                      esmaecido
                        ? "mapa-astral__planeta--esmaecido"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    style={{
                      left: `${(posicao.x / TAMANHO) * 100}%`,
                      top: `${(posicao.y / TAMANHO) * 100}%`,
                    }}
                    title={`${planeta.nome} em ${planeta.signo}, ${formatarGrau(planeta.grau)}`}
                    aria-label={`Selecionar ${planeta.nome} em ${planeta.signo}`}
                    aria-pressed={selecionado}
                    onClick={() =>
                      setPlanetaSelecionado(
                        selecionado ? null : indice
                      )
                    }
                  >
                    <IconePlaneta
                      planeta={planeta.nome}
                      tamanho={25}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mapa-astral__moldura-rodape">
          <span>CÍRCULO DE 360 GRAUS</span>
          <Icon icon="mdi:star-four-points" />
          <span>REPRESENTAÇÃO NATAL</span>
        </div>
      </div>

      <div className="mapa-astral__controles">
        <div className="mapa-astral__controles-titulo">
          <Icon icon="mdi:tune-variant" />
          <span>ELEMENTOS DO MAPA</span>
        </div>

        <div className="mapa-astral__controles-acoes">
          <button
            type="button"
            className={
              aspectosVisiveis
                ? "mapa-astral__controle mapa-astral__controle--ativo"
                : "mapa-astral__controle"
            }
            aria-pressed={aspectosVisiveis}
            onClick={() =>
              setAspectosVisiveis((atual) => !atual)
            }
          >
            <Icon icon="mdi:vector-line" />
            Aspectos
          </button>

          <button
            type="button"
            className={
              casasVisiveis
                ? "mapa-astral__controle mapa-astral__controle--ativo"
                : "mapa-astral__controle"
            }
            aria-pressed={casasVisiveis}
            onClick={() =>
              setCasasVisiveis((atual) => !atual)
            }
          >
            <Icon icon="mdi:circle-slice-8" />
            Casas
          </button>

          {planetaSelecionado !== null && (
            <button
              type="button"
              className="mapa-astral__controle mapa-astral__controle--limpar"
              onClick={() =>
                setPlanetaSelecionado(null)
              }
            >
              <Icon icon="mdi:close" />
              Limpar seleção
            </button>
          )}
        </div>
      </div>

      {planetaAtivo && (
        <div className="mapa-astral__detalhe">
          <div className="mapa-astral__detalhe-icone">
            <IconePlaneta
              planeta={planetaAtivo.nome}
              tamanho={40}
            />
          </div>

          <div className="mapa-astral__detalhe-info">
            <span>PLANETA SELECIONADO</span>

            <h4>{planetaAtivo.nome}</h4>

            <p>
              {planetaAtivo.signo} ·{" "}
              {formatarGrau(planetaAtivo.grau)}
            </p>
          </div>

          <div className="mapa-astral__detalhe-aspectos">
            <strong>{aspectosAtivos.length}</strong>
            <span>
              {aspectosAtivos.length === 1
                ? "Aspecto"
                : "Aspectos"}
            </span>
          </div>
        </div>
      )}

      <div className="mapa-astral__legenda">
        <div className="mapa-astral__legenda-cabecalho">
          <span>CHAVE DE LEITURA</span>
          <h4>Aspectos astrológicos</h4>
        </div>

        <div className="mapa-astral__legenda-itens">
          {Object.entries(NOMES_ASPECTOS).map(
            ([tipo, nome]) => (
              <div
                key={tipo}
                className="mapa-astral__legenda-item"
              >
                <span
                  className="mapa-astral__legenda-linha"
                  style={{
                    backgroundColor:
                      CORES_ASPECTOS[tipo],
                  }}
                />

                <span>{nome}</span>
              </div>
            )
          )}
        </div>
      </div>

      <p className="mapa-astral__instrucao">
        <Icon icon="mdi:cursor-default-click-outline" />
        Selecione um planeta na roda para destacar seus
        aspectos astrológicos.
      </p>
    </section>
  );
}