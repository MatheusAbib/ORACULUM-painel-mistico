
import { Icon } from "@iconify/react";
import type { Carta, Leitura, Tiragem } from "../../../nucleo/modelos/carta";
import { CartaTarot } from "./CartaTarot";
import { MesaLeque } from "./MesaLeque";
import "./MesaCartas.scss";

interface Props {
  aoVoltar?: () => void;
  tiragem: Tiragem;
  cartasDisponiveis: Carta[];
  leitura: Leitura;
  aoRevelarNaPosicao: (carta: Carta, posicao: number) => void;
  aoEscolherProxima: (carta: Carta) => void;
}

export function MesaCartas({
  aoVoltar,
  tiragem,
  cartasDisponiveis,
  leitura,
  aoRevelarNaPosicao,
}: Props) {
  const completa = leitura.every((carta) => carta !== null);
  const cartasEscolhidas = leitura.filter(
    (carta): carta is Carta => carta !== null
  );
  const proximaVazia = leitura.findIndex((carta) => carta === null);
  const proximaPosicao =
    proximaVazia !== -1 ? tiragem.posicoes[proximaVazia] : null;

  const ehLeque =
    tiragem.id === "uma-carta" || tiragem.id === "tres-cartas";

  const ehCruzCelta = tiragem.id === "cruz-celta";

  if (!ehLeque && !ehCruzCelta) return null;

  const cartasDoBaralho = cartasDisponiveis.filter(
    (carta) => !leitura.some((item) => item?.id === carta.id)
  );

  return (
    <section className="mesa-cartas">
      <div className="mesa-cartas__topo">
        {aoVoltar && (
          <button
            type="button"
            className="mesa-cartas__voltar"
            onClick={aoVoltar}
          >
            <Icon icon="mdi:arrow-left" />
            <span>Voltar às tiragens</span>
          </button>
        )}

        <span className="mesa-cartas__identificacao">
          <Icon icon="mdi:star-four-points" />
          {tiragem.nome}
        </span>
      </div>

      <div className="mesa-cartas__instrucao">
        <span className="mesa-cartas__instrucao-indice">
          {completa
            ? "CONSULTA CONCLUÍDA"
            : `POSIÇÃO ${String(proximaVazia + 1).padStart(2, "0")} DE ${String(
                tiragem.quantidadeCartas
              ).padStart(2, "0")}`}
        </span>

        <h2 className="mesa-cartas__instrucao-titulo">
          {completa ? (
            "Todas as cartas foram escolhidas"
          ) : (
            <>
              A carta de <strong>{proximaPosicao?.nome}</strong>
            </>
          )}
        </h2>

        {!completa && proximaPosicao?.descricao && (
          <p className="mesa-cartas__instrucao-descricao">
            {proximaPosicao.descricao}
          </p>
        )}

        <div className="mesa-cartas__instrucao-divisor" aria-hidden="true">
          <span />
          <Icon icon="mdi:star-four-points" />
          <span />
        </div>
      </div>

      {ehLeque && (
        <MesaLeque
          cartas={cartasDisponiveis}
          cartasEscolhidas={cartasEscolhidas}
          maxEscolhas={tiragem.quantidadeCartas}
          posicoesNomes={tiragem.posicoes.map((posicao) => posicao.nome)}
          aoEscolher={(carta) => {
            if (proximaVazia !== -1) {
              aoRevelarNaPosicao(carta, proximaVazia);
            }
          }}
        />
      )}

      {ehCruzCelta && (
        <>
          <div className="mesa-cartas__cruz-container">
            <div className="mesa-cartas__cruz-cabecalho">
              <span>DISPOSIÇÃO DOS ARCANOS</span>
              <Icon icon="mdi:star-four-points" />
              <span>CRUZ CELTA · X CARTAS</span>
            </div>

            <div className="mesa-cartas__campo mesa-cartas--cruz">
              <div className="mesa-cartas__campo-ornamento" aria-hidden="true">
                <Icon icon="game-icons:pentacle" />
              </div>

              {tiragem.posicoes.map((posicao, indice) => {
                const carta = leitura[indice];
                const ativa = indice === proximaVazia;

                return (
                  <div
                    key={indice}
                    className={`mesa-cartas__slot mesa-cartas__slot--${indice + 1} ${
                      carta ? "preenchido" : ""
                    } ${ativa ? "ativo" : ""}`}
                  >
                    <div className="mesa-cartas__slot-carta">
                      {carta ? (
                        <CartaTarot
                          carta={carta}
                          virada
                          desabilitada
                          posicao={posicao.nome}
                          indicePosicao={indice}
                          mostrarPosicao={false}
                        />
                      ) : (
                        <div className="mesa-cartas__slot-vazio">
                          <span>
                            {String(indice + 1).padStart(2, "0")}
                          </span>
                          <Icon icon="mdi:star-four-points" />
                        </div>
                      )}
                    </div>

                    <span className="mesa-cartas__slot-nome">
                      {posicao.nome}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mesa-cartas__cruz-rodape">
              <Icon icon="mdi:star-four-points" />
              <span>
                {String(cartasEscolhidas.length).padStart(2, "0")} /{" "}
                {String(tiragem.quantidadeCartas).padStart(2, "0")} CARTAS
                REVELADAS
              </span>
              <Icon icon="mdi:star-four-points" />
            </div>
          </div>

          {!completa && (
            <div className="mesa-cartas__baralho-container">
              <div className="mesa-cartas__baralho-cabecalho">
                <Icon icon="game-icons:card-pick" />

                <div>
                  <span>O BARALHO</span>
                  <p>
                    Selecione uma carta para ocupar a posição{" "}
                    <strong>{proximaPosicao?.nome}</strong>.
                  </p>
                </div>
              </div>

              <div className="mesa-cartas__baralho">
                {cartasDoBaralho.map((carta, indice) => (
                  <button
                    key={carta.id}
                    type="button"
                    className="mesa-cartas__baralho-carta"
                    onClick={() => {
                      if (proximaVazia === -1) return;
                      aoRevelarNaPosicao(carta, proximaVazia);
                    }}
                    aria-label={`Escolher carta ${indice + 1}`}
                  >
                    <span className="mesa-cartas__baralho-verso">
                      <Icon icon="mdi:star-four-points" />
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
