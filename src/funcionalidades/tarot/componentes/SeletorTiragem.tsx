import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import type { TipoTiragem, Tiragem } from "../../../nucleo/modelos/carta";
import "./SeletorTiragem.scss";

interface Props {
  tiragens: Tiragem[];
  aoEscolher: (tipo: TipoTiragem) => void;
  aoVisualizar: (tipo: TipoTiragem) => void;
  jaUsouHoje: (tipo: TipoTiragem) => boolean;
  dataUso: (tipo: TipoTiragem) => string | null;
}

const ILUSTRACOES = [
  "game-icons:all-seeing-eye",
  "game-icons:two-coins",
  "game-icons:triple-beak",
  "game-icons:moon-sun",
  "game-icons:crystal-ball",
  "game-icons:pentacle",
];

const NUMEROS_ROMANOS = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
  "VII",
  "VIII",
];

const VINTE_E_QUATRO = 24 * 60 * 60 * 1000;

function formatarTempo(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const horas = Math.floor(total / 3600);
  const minutos = Math.floor((total % 3600) / 60);
  const segundos = total % 60;

  return `${String(horas).padStart(2, "0")}h ${String(minutos).padStart(2, "0")}m ${String(segundos).padStart(2, "0")}s`;
}

export function SeletorTiragem({
  tiragens,
  aoEscolher,
  aoVisualizar,
  jaUsouHoje,
  dataUso,
}: Props) {
  const [agora, setAgora] = useState(() => Date.now());

  useEffect(() => {
    const intervalo = window.setInterval(() => {
      setAgora(Date.now());
    }, 1000);

    return () => window.clearInterval(intervalo);
  }, []);

  return (
    <section className="seletor-tiragem">
      <div className="seletor-tiragem__identificacao">
        <span>
          <Icon icon="game-icons:scroll-unfurled" />
          CATÁLOGO DE TIRAGENS
        </span>

        <span>
          {String(tiragens.length).padStart(2, "0")} MÉTODOS
        </span>
      </div>

      <div className="seletor-tiragem__grade">
        {tiragens.map((tiragem, indice) => {
          const bloqueada = jaUsouHoje(tiragem.id);
          const data = dataUso(tiragem.id);

          const tempoRestante = data
            ? Math.max(
                0,
                new Date(data).getTime() + VINTE_E_QUATRO - agora
              )
            : 0;

          const ilustracao =
            ILUSTRACOES[indice % ILUSTRACOES.length];

          const numero =
            NUMEROS_ROMANOS[indice] ?? String(indice + 1);

          return (
            <article
              key={tiragem.id}
              onClick={() => aoEscolher(tiragem.id)}
              className={`seletor-tiragem__cartao ${
                bloqueada ? "bloqueada" : ""
              }`}
            >
              <div
                className="seletor-tiragem__cartao-moldura"
                aria-hidden="true"
              />

              <div className="seletor-tiragem__cartao-topo">
                <span>ARCANVM {numero}</span>

                <Icon icon="mdi:star-four-points" />

                <span>
                  {String(tiragem.quantidadeCartas).padStart(2, "0")}{" "}
                  {tiragem.quantidadeCartas === 1
                    ? "CARTA"
                    : "CARTAS"}
                </span>
              </div>

              <div
                className="seletor-tiragem__gravura"
                aria-hidden="true"
              >
                <div className="seletor-tiragem__gravura-anel">
                  <Icon icon={ilustracao} />
                </div>

                <span className="seletor-tiragem__gravura-estrela seletor-tiragem__gravura-estrela--esquerda">
                  <Icon icon="mdi:star-four-points" />
                </span>

                <span className="seletor-tiragem__gravura-estrela seletor-tiragem__gravura-estrela--direita">
                  <Icon icon="mdi:star-four-points" />
                </span>
              </div>

              <div className="seletor-tiragem__cartao-conteudo">
                <span className="seletor-tiragem__indice">
                  MÉTODO {numero}
                </span>

                <h3 className="seletor-tiragem__nome">
                  {tiragem.nome}
                </h3>

                <div
                  className="seletor-tiragem__ornamento"
                  aria-hidden="true"
                >
                  <span />
                  <Icon icon="mdi:star-four-points" />
                  <span />
                </div>

                <p className="seletor-tiragem__descricao">
                  {tiragem.descricao}
                </p>
              </div>

              <div className="seletor-tiragem__cartao-rodape">
                {bloqueada ? (
                  <>
                    <div className="seletor-tiragem__contador">
                      <span>
                        <Icon icon="mdi:clock-outline" />
                        PRÓXIMA CONSULTA
                      </span>

                      <strong>
                        {formatarTempo(tempoRestante)}
                      </strong>
                    </div>

                    <button
                      type="button"
                      className="seletor-tiragem__acao seletor-tiragem__acao--salva"
                      onClick={() => aoVisualizar(tiragem.id)}
                    >
                      <span>Consultar leitura anterior</span>
                      <Icon icon="mdi:book-open-page-variant-outline" />
                    </button>
                  </>
                ) : (
                  <>
                    <span className="seletor-tiragem__disponivel">
                      <Icon icon="mdi:star-four-points" />
                      DISPONÍVEL PARA CONSULTA
                    </span>

                    <button
                      type="button"
                      className="seletor-tiragem__acao"
                      onClick={() => aoEscolher(tiragem.id)}
                    >
                      <span>Iniciar tiragem</span>
                      <Icon icon="mdi:arrow-right" />
                    </button>
                  </>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}