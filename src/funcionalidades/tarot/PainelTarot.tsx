import { useEffect } from "react";
import { Icon } from "@iconify/react";
import { useTarot } from "./ganchos/useTarot";
import { SeletorTiragem } from "./componentes/SeletorTiragem";
import { CampoPergunta } from "./componentes/CampoPergunta";
import { MesaCartas } from "./componentes/MesaCartas";
import { MensagemRevelada } from "./componentes/MensagemRevelada";
import "./PainelTarot.scss";

export function PainelTarot() {
  const {
    tiragens,
    tiragemAtiva,
    cartasDisponiveis,
    leitura,
    pergunta,
    leituraCompleta,
    dataUso,
    jaUsouHoje,
    escolherTiragem,
    visualizarSalva,
    confirmarPergunta,
    cancelarPergunta,
    escolherProximaCarta,
    revelarCartaNaPosicao,
    finalizar,
    reiniciar,
    mostrandoCampoPergunta,
    tiragemPendente,
  } = useTarot();

  useEffect(() => {
    if (leituraCompleta) {
      finalizar();
    }
  }, [leituraCompleta, finalizar]);

  const mostrandoCatalogo = !mostrandoCampoPergunta && !tiragemAtiva;

  return (
    <section className="painel-tarot">
      {mostrandoCatalogo && (
        <header className="painel-tarot__cabecalho">
          <div className="painel-tarot__identificacao">
            <span>ORACULVM · ARCANOS</span>
            <span>LIVRO PRIMEIRO</span>
          </div>

          <div className="painel-tarot__apresentacao">
            <div className="painel-tarot__emblema" aria-hidden="true">
              <Icon icon="game-icons:card-pick" />
            </div>

            <span className="painel-tarot__rotulo">
              O LIVRO DAS CARTAS
            </span>

            <h2 className="painel-tarot__titulo">O Tarô</h2>

            <div className="painel-tarot__ornamento" aria-hidden="true">
              <span />
              <Icon icon="mdi:star-four-points" />
              <span />
            </div>

            <p className="painel-tarot__descricao">
              Escolha uma disposição de cartas para iniciar sua leitura.
              Cada tiragem possui uma estrutura própria e pode ser
              realizada uma vez a cada 24 horas.
            </p>
          </div>
        </header>
      )}

      <div className="painel-tarot__conteudo">
        {mostrandoCampoPergunta && tiragemPendente ? (
          <CampoPergunta
            tiragem={tiragemPendente}
            aoConfirmar={confirmarPergunta}
            aoCancelar={cancelarPergunta}
          />
        ) : !tiragemAtiva ? (
          <section className="painel-tarot__secao">
            <div className="painel-tarot__secao-cabecalho">
              <span>FIGURA I · CONSULTA AOS ARCANOS</span>
              <span>CATÁLOGO DE TIRAGENS</span>
            </div>

            <div className="painel-tarot__secao-introducao">
              <span className="painel-tarot__secao-rotulo">
                OS MÉTODOS DE LEITURA
              </span>

              <h3 className="painel-tarot__secao-titulo">
                Escolha sua Tiragem
              </h3>
            </div>

            <SeletorTiragem
              tiragens={tiragens}
              aoEscolher={escolherTiragem}
              aoVisualizar={visualizarSalva}
              jaUsouHoje={jaUsouHoje}
              dataUso={dataUso}
            />
          </section>
        ) : leituraCompleta ? (
          <MensagemRevelada
            tiragem={tiragemAtiva}
            leitura={leitura}
            pergunta={pergunta}
            aoReiniciar={reiniciar}
          />
        ) : (
          <MesaCartas
            aoVoltar={reiniciar}
            tiragem={tiragemAtiva}
            cartasDisponiveis={cartasDisponiveis}
            leitura={leitura}
            aoRevelarNaPosicao={revelarCartaNaPosicao}
            aoEscolherProxima={escolherProximaCarta}
          />
        )}
      </div>

      {mostrandoCatalogo && (
        <footer className="painel-tarot__rodape">
          <Icon icon="game-icons:quill-ink" />
          <p>
            As cartas oferecem interpretações simbólicas. A leitura
            não determina acontecimentos futuros nem substitui suas
            próprias decisões.
          </p>
          <Icon icon="game-icons:quill-ink" />
        </footer>
      )}
    </section>
  );
}