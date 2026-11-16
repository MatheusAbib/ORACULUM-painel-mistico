import { useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import type { PlanetaCalculado } from "../servicos/astrologia";
import { calcularAspectos } from "../servicos/aspectos";
import type { TipoAspecto } from "../servicos/aspectos";
import { obterTextoAspecto } from "../dados/aspectos/index";
import { IconePlaneta } from "./IconePlaneta";
import "./ListaAspectos.scss";

interface Props {
  planetas: PlanetaCalculado[];
}

type Filtro = "todos" | TipoAspecto;

const NOMES: Record<TipoAspecto, string> = {
  conjuncao: "Conjunção",
  sextil: "Sextil",
  quadratura: "Quadratura",
  trigono: "Trígono",
  oposicao: "Oposição",
};

const ICONES: Record<TipoAspecto, string> = {
  conjuncao: "mdi:circle-double",
  sextil: "mdi:star-six-points-outline",
  quadratura: "mdi:square-outline",
  trigono: "mdi:triangle-outline",
  oposicao: "mdi:arrow-left-right",
};

const FILTROS: { id: Filtro; rotulo: string }[] = [
  { id: "todos", rotulo: "Todos" },
  { id: "conjuncao", rotulo: "Conjunção" },
  { id: "sextil", rotulo: "Sextil" },
  { id: "quadratura", rotulo: "Quadratura" },
  { id: "trigono", rotulo: "Trígono" },
  { id: "oposicao", rotulo: "Oposição" },
];

const ROMANOS = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
  "IX",
  "X",
  "XI",
  "XII",
];

export function ListaAspectos({ planetas }: Props) {
  const aspectos = useMemo(
    () => calcularAspectos(planetas),
    [planetas]
  );

  const [filtro, setFiltro] = useState<Filtro>("todos");

  const filtrados = useMemo(
    () =>
      filtro === "todos"
        ? aspectos
        : aspectos.filter((aspecto) => aspecto.tipo === filtro),
    [aspectos, filtro]
  );

  const contagens = useMemo(() => {
    const resultado: Record<Filtro, number> = {
      todos: aspectos.length,
      conjuncao: 0,
      sextil: 0,
      quadratura: 0,
      trigono: 0,
      oposicao: 0,
    };

    aspectos.forEach((aspecto) => {
      resultado[aspecto.tipo] += 1;
    });

    return resultado;
  }, [aspectos]);

  return (
    <section className="lista-aspectos">

      <div className="lista-aspectos__sumario">
        <div className="lista-aspectos__sumario-icone">
          <Icon icon="mdi:vector-polyline" />
        </div>

        <div className="lista-aspectos__sumario-texto">
          <span>REGISTRO DE ASPECTOS</span>
          <strong>
            {aspectos.length === 1
              ? "1 relação identificada"
              : `${aspectos.length} relações identificadas`}
          </strong>
        </div>

        <span className="lista-aspectos__sumario-numero">
          {String(aspectos.length).padStart(2, "0")}
        </span>
      </div>

      <div className="lista-aspectos__filtros-cabecalho">
        <div>
          <span>CONSULTA DO REGISTRO</span>
          <h4>Filtrar por aspecto</h4>
        </div>

        <span>V CLASSIFICAÇÕES</span>
      </div>

      <div
        className="lista-aspectos__filtros"
        role="group"
        aria-label="Filtrar aspectos planetários"
      >
        {FILTROS.map((item) => {
          const ativo = item.id === filtro;

          return (
            <button
              key={item.id}
              type="button"
              className={`lista-aspectos__filtro ${
                ativo ? "ativo" : ""
              }`}
              aria-pressed={ativo}
              onClick={() => setFiltro(item.id)}
            >
              {item.id === "todos" ? (
                <Icon icon="mdi:apps" />
              ) : (
                <Icon icon={ICONES[item.id]} />
              )}

              <span>{item.rotulo}</span>

              <small>{contagens[item.id]}</small>
            </button>
          );
        })}
      </div>

      {filtrados.length === 0 ? (
        <div className="lista-aspectos__vazio">
          <Icon icon="game-icons:compass" />

          <h4>Nenhum aspecto encontrado</h4>

          <p>
            {aspectos.length === 0
              ? "Não foram identificados aspectos relevantes neste mapa."
              : "Não há registros dessa classificação no mapa."}
          </p>

          {filtro !== "todos" && (
            <button
              type="button"
              onClick={() => setFiltro("todos")}
            >
              <Icon icon="mdi:arrow-left" />
              Ver todos os aspectos
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="lista-aspectos__resultado-topo">
            <span>
              {filtro === "todos"
                ? "CATÁLOGO COMPLETO"
                : NOMES[filtro].toUpperCase()}
            </span>

            <span>
              {String(filtrados.length).padStart(2, "0")}{" "}
              {filtrados.length === 1
                ? "REGISTRO"
                : "REGISTROS"}
            </span>
          </div>

          <div className="lista-aspectos__grade">
            {filtrados.map((aspecto, indice) => {
              const texto = obterTextoAspecto(
                aspecto.tipo,
                aspecto.planetaA,
                aspecto.planetaB
              );

              return (
                <article
                  key={`${aspecto.planetaA}-${aspecto.planetaB}-${aspecto.tipo}-${indice}`}
                  className={`lista-aspectos__item lista-aspectos__item--${aspecto.tipo}`}
                >
                  <div className="lista-aspectos__item-topo">
                    <span>
                      ASPECTO{" "}
                      {ROMANOS[indice] ??
                        String(indice + 1).padStart(2, "0")}
                    </span>

                    <div className="lista-aspectos__item-classificacao">
                      <Icon icon={ICONES[aspecto.tipo]} />
                      <span>{NOMES[aspecto.tipo]}</span>
                    </div>
                  </div>

                  <div className="lista-aspectos__relacao">
                    <div className="lista-aspectos__planeta">
                      <div className="lista-aspectos__planeta-icone">
                        <IconePlaneta
                          planeta={aspecto.planetaA}
                          tamanho={36}
                        />
                      </div>

                      <strong>{aspecto.planetaA}</strong>
                    </div>

                    <div className="lista-aspectos__relacao-centro">
                      <span />
                      <Icon icon={ICONES[aspecto.tipo]} />
                      <span />
                    </div>

                    <div className="lista-aspectos__planeta">
                      <div className="lista-aspectos__planeta-icone">
                        <IconePlaneta
                          planeta={aspecto.planetaB}
                          tamanho={36}
                        />
                      </div>

                      <strong>{aspecto.planetaB}</strong>
                    </div>
                  </div>

                  <div className="lista-aspectos__titulo-linha">
                    <h4 className="lista-aspectos__titulo-item">
                      {aspecto.planetaA} em{" "}
                      {NOMES[aspecto.tipo].toLowerCase()}{" "}
                      com {aspecto.planetaB}
                    </h4>

                    <span className="lista-aspectos__orbe">
                      ORBE {aspecto.orbe}°
                    </span>
                  </div>

                  <p className="lista-aspectos__descricao">
                    {texto.descricao}
                  </p>

                  <div className="lista-aspectos__blocos">
                    <div className="lista-aspectos__bloco lista-aspectos__bloco--bom">
                      <div className="lista-aspectos__bloco-cabecalho">
                        <Icon icon="mdi:check-circle-outline" />
                        <strong>O que funciona</strong>
                      </div>

                      <p>{texto.funciona}</p>
                    </div>

                    <div className="lista-aspectos__bloco lista-aspectos__bloco--atencao">
                      <div className="lista-aspectos__bloco-cabecalho">
                        <Icon icon="mdi:alert-circle-outline" />
                        <strong>O que observar</strong>
                      </div>

                      <p>{texto.vigiar}</p>
                    </div>
                  </div>

                  <div className="lista-aspectos__conselho">
                    <Icon icon="game-icons:quill-ink" />

                    <p>
                      <strong>Para refletir</strong>
                      {texto.conselho}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}

      <footer className="lista-aspectos__rodape">
        <Icon icon="mdi:star-four-points" />

        <p>
          Os aspectos descrevem relações angulares e
          recebem interpretações simbólicas na astrologia.
        </p>

        <Icon icon="mdi:star-four-points" />
      </footer>
    </section>
  );
}