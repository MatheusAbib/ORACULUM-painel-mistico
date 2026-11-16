
import type { CSSProperties } from "react";
import { Icon } from "@iconify/react";
import type { Carta } from "../../../nucleo/modelos/carta";
import { CartaTarot } from "./CartaTarot";
import "./MesaLeque.scss";

interface Props {
  cartas: Carta[];
  cartasEscolhidas: Carta[];
  maxEscolhas: number;
  posicoesNomes: string[];
  aoEscolher: (carta: Carta) => void;
}

type EstiloCarta = CSSProperties & {
  "--rotacao": string;
  "--deslocamento-y": string;
  "--deslocamento-x": string;
};

const TOTAL = 18;

export function MesaLeque({
  cartas,
  cartasEscolhidas,
  maxEscolhas,
  posicoesNomes,
  aoEscolher,
}: Props) {
  const cartasVisiveis = cartas.slice(0, TOTAL);
  const totalVisivel = cartasVisiveis.length;
  const completa = cartasEscolhidas.length >= maxEscolhas;

  function angulo(index: number): number {
    if (totalVisivel <= 1) return 0;

    const meio = (totalVisivel - 1) / 2;
    return ((index - meio) / meio) * 32;
  }

  function deslocamentoY(index: number): number {
    const rotacao = angulo(index);
    return Math.abs(rotacao) * 1.25;
  }

  function deslocamentoX(index: number): number {
    if (totalVisivel <= 1) return 0;

    const meio = (totalVisivel - 1) / 2;
    return (index - meio) * 12;
  }

  function foiEscolhida(carta: Carta): boolean {
    return cartasEscolhidas.some((item) => item.id === carta.id);
  }

  return (
    <section className="mesa-leque">
      <header className="mesa-leque__cabecalho">
        {/* <span className="mesa-leque__sobretitulo">
          <Icon icon="mdi:star-four-points" />
          A ESCOLHA DOS ARCANOS
          <Icon icon="mdi:star-four-points" />
        </span>

        <h2 className="mesa-leque__titulo">A mesa das cartas</h2>

        <p className="mesa-leque__descricao">
          Observe as cartas dispostas diante de você e escolha aquelas
          que irão compor sua leitura.
        </p> */}

        <div className="mesa-leque__progresso">
          <span>CARTAS ESCOLHIDAS</span>
          <strong>
            {String(cartasEscolhidas.length).padStart(2, "0")}
            <span> / </span>
            {String(maxEscolhas).padStart(2, "0")}
          </strong>
        </div>
      </header>

      <div className="mesa-leque__superficie">
        <div className="mesa-leque__superficie-borda" aria-hidden="true" />

        <div className="mesa-leque__selo" aria-hidden="true">
          <div className="mesa-leque__selo-externo">
            <div className="mesa-leque__selo-interno">
              <Icon icon="game-icons:all-seeing-eye" />
            </div>
          </div>
        </div>

        <div className="mesa-leque__palco">
          {cartasVisiveis.map((carta, index) => {
            const escolhida = foiEscolhida(carta);
            const bloqueada = completa && !escolhida;

            const estilo: EstiloCarta = {
              "--rotacao": `${angulo(index)}deg`,
              "--deslocamento-y": `${deslocamentoY(index)}px`,
              "--deslocamento-x": `${deslocamentoX(index)}px`,
              zIndex: index + 1,
            };

            return (
              <button
                key={carta.id}
                type="button"
                className={`mesa-leque__carta ${
                  escolhida ? "escolhida" : ""
                } ${bloqueada ? "bloqueada" : ""}`}
                style={estilo}
                onClick={() => {
                  if (completa || escolhida) return;
                  aoEscolher(carta);
                }}
                disabled={completa || escolhida}
                aria-label={`Escolher carta ${index + 1}`}
              >
                <CartaTarot
                  carta={carta}
                  virada={false}
                  desabilitada={false}
                  mostrarPosicao={false}
                />
              </button>
            );
          })}
        </div>

        <div className="mesa-leque__superficie-inscricao" aria-hidden="true">
          <span>ARCANA</span>
          <Icon icon="mdi:star-four-points" />
          <span>XVIII CARTAE</span>
        </div>
      </div>

      {cartasEscolhidas.length > 0 && (
        <section className="mesa-leque__resultado">
          <div className="mesa-leque__resultado-cabecalho">
            <span>REGISTRO DA TIRAGEM</span>
            <Icon icon="mdi:star-four-points" />
            <span>
              {String(cartasEscolhidas.length).padStart(2, "0")} SELECIONADAS
            </span>
          </div>

          <div className="mesa-leque__escolhidas">
            {cartasEscolhidas.map((carta, indice) => (
              <div key={carta.id} className="mesa-leque__escolhida">
                <div className="mesa-leque__escolhida-numero">
                  {String(indice + 1).padStart(2, "0")}
                </div>

                <div className="mesa-leque__escolhida-slot">
                  <CartaTarot
                    carta={carta}
                    virada
                    desabilitada
                    mostrarPosicao={false}
                  />
                </div>

                <span className="mesa-leque__escolhida-posicao">
                  {posicoesNomes[indice]}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className={`mesa-leque__instrucao ${completa ? "completa" : ""}`}>
        <Icon
          icon={completa ? "game-icons:open-book" : "game-icons:card-pick"}
        />

        <div>
          <span>
            {completa ? "A TIRAGEM FOI CONCLUÍDA" : "PRÓXIMA POSIÇÃO"}
          </span>

          <p>
            {completa ? (
              "Todas as cartas foram escolhidas."
            ) : (
              <>
                Escolha uma carta para{" "}
                <strong>{posicoesNomes[cartasEscolhidas.length]}</strong>
              </>
            )}
          </p>
        </div>

        <Icon icon="mdi:star-four-points" />
      </div>
    </section>
  );
}
