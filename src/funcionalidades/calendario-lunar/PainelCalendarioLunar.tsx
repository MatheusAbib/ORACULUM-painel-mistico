import { Icon } from "@iconify/react";
import { CalendarioMensal } from "./componentes/CalendarioMensal";
import { IconeFaseLua } from "./componentes/IconeFaseLua";
import { useCalendarioLunar } from "./ganchos/useCalendarioLunar";
import "./PainelCalendarioLunar.scss";

export function PainelCalendarioLunar() {
  const {
    ano,
    mes,
    diaSelecionado,
    proximasFases,
    selecionarDia,
    ehHoje,
    mesAnterior,
    mesProximo,
    irParaHoje,
  } = useCalendarioLunar();

  const selecionadoEhHoje = ehHoje(diaSelecionado.data);

  const rotuloDia = selecionadoEhHoje
    ? "Hoje"
    : diaSelecionado.data.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

  return (
    <section className="painel-calendario">
      <header className="painel-calendario__cabecalho">
        <div className="painel-calendario__identificacao">
          <span>ORACULVM · OBSERVAÇÃO LUNAR</span>
          <span>ALMANAQUE CELESTE</span>
        </div>

        <div className="painel-calendario__apresentacao">
          <div className="painel-calendario__emblema" aria-hidden="true">
            <div className="painel-calendario__emblema-anel">
              <Icon icon="mdi:moon-waning-crescent" />
            </div>
            <span>☾</span>
          </div>

          <span className="painel-calendario__sobretitulo">
            OS CICLOS DA LUA
          </span>

          <h2 className="painel-calendario__titulo">
            Calendário Lunar
          </h2>

          <div className="painel-calendario__divisor" aria-hidden="true">
            <span />
            <Icon icon="mdi:star-four-points" />
            <span />
          </div>

          <p className="painel-calendario__subtitulo">
            Acompanhe as fases da Lua, observe suas transformações
            ao longo dos dias e conheça os significados atribuídos
            a cada etapa do ciclo lunar.
          </p>
        </div>
      </header>

      <div className="painel-calendario__conteudo">
        <div className="painel-calendario__secao-cabecalho">
          <span>FIGURA I · OBSERVAÇÃO DO DIA</span>
          <span>ESTADO LUNAR</span>
        </div>

        <div className="painel-calendario__secao-introducao">
          <div>
            <span className="painel-calendario__secao-rotulo">
              O CÉU NESTE MOMENTO
            </span>

            <h3 className="painel-calendario__secao-titulo">
              A Lua em Observação
            </h3>
          </div>


        </div>

        <div className="painel-calendario__detalhe">
          <div className="painel-calendario__detalhe-topo">
            <div className="painel-calendario__detalhe-icone">
              <div className="painel-calendario__detalhe-icone-anel">
                <IconeFaseLua
                  fase={diaSelecionado.fase}
                  tamanho={86}
                />
              </div>
            </div>

            <div className="painel-calendario__detalhe-info">
              <span className="painel-calendario__detalhe-rotulo">
                {rotuloDia}
              </span>

              <h3 className="painel-calendario__detalhe-fase">
                {diaSelecionado.nomeFase}
              </h3>

              <p className="painel-calendario__detalhe-desc">
                {diaSelecionado.descricao}
              </p>

              <div className="painel-calendario__detalhe-metricas">
                <div className="painel-calendario__metrica">
                  <Icon icon="mdi:moon-full" />
                  <div>
                    <span>ILUMINAÇÃO</span>
                    <strong>{diaSelecionado.iluminacao}%</strong>
                  </div>
                </div>

                <div className="painel-calendario__metrica">
                  <Icon icon="mdi:clock-outline" />
                  <div>
                    <span>IDADE LUNAR</span>
                    <strong>{diaSelecionado.idadeDias} dias</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="painel-calendario__blocos">
            <div className="painel-calendario__bloco">
              <div className="painel-calendario__bloco-cabecalho">
                <span className="painel-calendario__bloco-numero">
                  I
                </span>
                <span className="painel-calendario__rotulo">
                  O que significa
                </span>
              </div>

              <p>{diaSelecionado.significado}</p>
            </div>

            <div className="painel-calendario__bloco">
              <div className="painel-calendario__bloco-cabecalho">
                <span className="painel-calendario__bloco-numero">
                  II
                </span>
                <span className="painel-calendario__rotulo">
                  O que esperar
                </span>
              </div>

              <p>{diaSelecionado.esperar}</p>
            </div>

            <div className="painel-calendario__dois-blocos">
              <div className="painel-calendario__bloco painel-calendario__bloco--fazer">
                <div className="painel-calendario__bloco-cabecalho">
                  <Icon icon="mdi:check-circle-outline" />
                  <span className="painel-calendario__rotulo">
                    O que fazer
                  </span>
                </div>

                <p>{diaSelecionado.fazer}</p>
              </div>

              <div className="painel-calendario__bloco painel-calendario__bloco--evitar">
                <div className="painel-calendario__bloco-cabecalho">
                  <Icon icon="mdi:minus-circle-outline" />
                  <span className="painel-calendario__rotulo">
                    O que evitar
                  </span>
                </div>

                <p>{diaSelecionado.evitar}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="painel-calendario__calendario-secao">
          <div className="painel-calendario__secao-cabecalho">
            <span>FIGURA II · CICLO MENSAL</span>
            <span>CALENDÁRIO ASTRONÔMICO</span>
          </div>

          <div className="painel-calendario__secao-introducao">
            <div>
              <span className="painel-calendario__secao-rotulo">
                O MOVIMENTO DA LUA
              </span>

              <h3 className="painel-calendario__secao-titulo">
                Calendário do Mês
              </h3>
            </div>

            <p className="painel-calendario__secao-descricao">
              Navegue pelos meses e selecione uma data para
              consultar a fase lunar correspondente.
            </p>
          </div>

          <CalendarioMensal
            ano={ano}
            mes={mes}
            diaSelecionado={diaSelecionado}
            onSelecionarDia={selecionarDia}
            onMesAnterior={mesAnterior}
            onMesProximo={mesProximo}
            onIrParaHoje={irParaHoje}
          />
        </div>

        <div className="painel-calendario__proximas">
          <div className="painel-calendario__secao-cabecalho">
            <span>FIGURA III · EFEMÉRIDES LUNARES</span>
            <span>PRÓXIMOS EVENTOS</span>
          </div>

          <div className="painel-calendario__secao-introducao">
            <div>
              <span className="painel-calendario__secao-rotulo">
                OS MARCOS DO CICLO
              </span>

              <h3 className="painel-calendario__secao-titulo">
                Próximas Fases Principais
              </h3>
            </div>
          </div>

          <div className="painel-calendario__proximas-grade">
            {proximasFases.map((fase, indice) => (
              <div
                key={fase.fase}
                className="painel-calendario__proxima"
              >
                <div className="painel-calendario__proxima-topo">
                  <span>
                    FASE {String(indice + 1).padStart(2, "0")}
                  </span>
                  <Icon icon="mdi:star-four-points" />
                </div>

                <div className="painel-calendario__proxima-conteudo">
                  <div className="painel-calendario__proxima-icone">
                    <IconeFaseLua
                      fase={fase.fase}
                      tamanho={54}
                    />
                  </div>

                  <div className="painel-calendario__proxima-info">
                    <strong>{fase.nomeFase}</strong>
                    <span>
                      {fase.data.toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <footer className="painel-calendario__rodape">
          <Icon icon="mdi:star-four-points" />
          <span>ORACULVM · ALMANAQUE DOS CICLOS LUNARES</span>
          <Icon icon="mdi:star-four-points" />
        </footer>
      </div>
    </section>
  );
}