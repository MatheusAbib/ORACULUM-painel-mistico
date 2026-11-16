
import { Icon } from "@iconify/react";
import type { Leitura, Tiragem } from "../../../nucleo/modelos/carta";
import { BotaoMistico } from "../../../compartilhado/componentes/BotaoMistico";
import { IconeNaipe } from "./IconeNaipe";
import "./MensagemRevelada.scss";

interface Props {
  tiragem: Tiragem;
  leitura: Leitura;
  pergunta?: string;
  aoReiniciar: () => void;
}

const NUMEROS_ROMANOS = [
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
];

export function MensagemRevelada({
  tiragem,
  leitura,
  pergunta,
  aoReiniciar,
}: Props) {
  const perguntaValida = pergunta?.trim();

  return (
    <section className="mensagem-revelada">
      <div className="mesa-cartas__topo">
        <button
          type="button"
          className="mesa-cartas__voltar"
          onClick={aoReiniciar}
        >
          <Icon icon="mdi:arrow-left" />
          <span>Voltar às tiragens</span>
        </button>

        <span className="mesa-cartas__identificacao">
            <span>REGISTRO DA CONSULTA</span>
        </span>
      </div>
      <header className="mensagem-revelada__cabecalho">

        <div className="mensagem-revelada__emblema" aria-hidden="true">
          <Icon icon="game-icons:open-book" />
        </div>

        <span className="mensagem-revelada__sobretitulo">
          OS ARCANOS REVELADOS
        </span>

        <h1 className="mensagem-revelada__titulo">
          Sua leitura
        </h1>

        <div className="mensagem-revelada__divisor" aria-hidden="true">
          <span />
          <Icon icon="mdi:star-four-points" />
          <span />
        </div>

        <p className="mensagem-revelada__subtitulo">
          {tiragem.nome}
        </p>

        <p className="mensagem-revelada__introducao">
          As cartas foram reveladas. A seguir, você encontrará os
          significados de cada arcano e sua interpretação dentro
          da disposição escolhida.
        </p>

        {perguntaValida && (
          <div className="mensagem-revelada__pergunta">
            <Icon icon="game-icons:quill-ink" />

            <div>
              <span className="mensagem-revelada__pergunta-rotulo">
                A PERGUNTA REGISTRADA
              </span>

              <p className="mensagem-revelada__pergunta-texto">
                {perguntaValida}
              </p>
            </div>
          </div>
        )}

        <div className="mensagem-revelada__cabecalho-inferior">
          <span>
            <Icon icon="game-icons:scroll-unfurled" />
            INTERPRETAÇÃO DOS ARCANOS
          </span>

          <span>
            {String(leitura.filter(Boolean).length).padStart(2, "0")} CARTAS
          </span>
        </div>
      </header>

      <div className="mensagem-revelada__lista">
        {leitura.map((carta, indice) => {
          if (!carta) return null;

          const posicao = tiragem.posicoes[indice];
          const textoContexto = posicao
            ? carta.fortuna[posicao.contexto]
            : null;

          const numeroRomano =
            NUMEROS_ROMANOS[indice] ?? String(indice + 1);

          return (
            <article
              key={`${indice}-${carta.id}`}
              className="mensagem-revelada__item"
            >
              <div
                className="mensagem-revelada__item-moldura"
                aria-hidden="true"
              />

              <header className="mensagem-revelada__item-cabecalho">
                <div className="mensagem-revelada__posicao">
                  <span className="mensagem-revelada__posicao-indice">
                    {numeroRomano}
                  </span>

                  <div>
                    <span className="mensagem-revelada__posicao-rotulo">
                      POSIÇÃO {String(indice + 1).padStart(2, "0")}
                    </span>

                    <h2 className="mensagem-revelada__posicao-nome">
                      {posicao?.nome}
                    </h2>
                  </div>
                </div>

                <p className="mensagem-revelada__posicao-descricao">
                  {posicao?.descricao}
                </p>
              </header>

              <div className="mensagem-revelada__carta-info">
                <div className="mensagem-revelada__carta-simbolo">
                  <div className="mensagem-revelada__carta-simbolo-anel">
                    {carta.naipe ? (
                      <IconeNaipe naipe={carta.naipe} tamanho={74} />
                    ) : (
                      <Icon icon="game-icons:all-seeing-eye" />
                    )}
                  </div>
                </div>

                <div className="mensagem-revelada__carta-dados">
                  <span className="mensagem-revelada__carta-numero">
                    ARCANO {carta.numero}
                  </span>

                  <h3 className="mensagem-revelada__carta-titulo">
                    {carta.titulo}
                  </h3>

                  {carta.naipe && (
                    <span className="mensagem-revelada__carta-naipe">
                      {carta.naipe}
                    </span>
                  )}

                  <p className="mensagem-revelada__carta-descricao">
                    {carta.descricao}
                  </p>
                </div>
              </div>

              {textoContexto && (
                <div className="mensagem-revelada__contexto">
                  <div className="mensagem-revelada__contexto-cabecalho">
                    <Icon icon="mdi:star-four-points" />
                    <span>INTERPRETAÇÃO DESTA POSIÇÃO</span>
                  </div>

                  <p className="mensagem-revelada__contexto-texto">
                    {textoContexto}
                  </p>
                </div>
              )}

              <div className="mensagem-revelada__geral">
                <div className="mensagem-revelada__geral-cabecalho">
                  <span />
                  <Icon icon="game-icons:open-book" />
                  <strong>SOBRE ESTE ARCANO</strong>
                  <span />
                </div>

                {carta.fortuna.geral.map((paragrafo, i) => (
                  <p
                    key={i}
                    className="mensagem-revelada__paragrafo"
                  >
                    {paragrafo}
                  </p>
                ))}
              </div>

              <footer className="mensagem-revelada__item-rodape">
                <span>ORACULVM</span>
                <Icon icon="mdi:star-four-points" />
                <span>ARCANVM {numeroRomano}</span>
              </footer>
            </article>
          );
        })}
      </div>

      <footer className="mensagem-revelada__acoes">
        <div className="mensagem-revelada__acoes-ornamento">
          <span />
          <Icon icon="game-icons:quill-ink" />
          <span />
        </div>

        <h2>Fim da leitura</h2>

        <p className="mensagem-revelada__acoes-descricao">
          As interpretações apresentadas são simbólicas e podem servir
          como ponto de partida para suas próprias reflexões.
        </p>

        <BotaoMistico onClick={aoReiniciar}>
          <Icon icon="mdi:arrow-left" />
          Voltar às tiragens
        </BotaoMistico>

        <p className="mensagem-revelada__aviso">
          <Icon icon="mdi:clock-outline" />
          Esta leitura ficará disponível por 24 horas.
        </p>
      </footer>
    </section>
  );
}
