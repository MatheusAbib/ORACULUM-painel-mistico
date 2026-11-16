import { useEffect } from "react";
import { Icon } from "@iconify/react";
import { useAstrologia } from "./ganchos/useAstrologia";
import { usePerfil } from "../../nucleo/contextos/PerfilContexto";
import { AvisoPreencherPerfil } from "../../compartilhado/componentes/AvisoPreencherPerfil";
import { MapaAstral } from "./componentes/MapaAstral";
import { ResumoPlanetas } from "./componentes/ResumoPlanetas";
import { Interpretacoes } from "./componentes/Interpretacoes";
import { ListaAspectos } from "./componentes/ListaAspectos";
import { MapaAstralSkeleton } from "./componentes/MapaAstralSkeleton";
import { Sinastria } from "./componentes/Sinastria";
import "./PainelAstrologia.scss";

export function PainelAstrologia() {
  const { perfil, completo } = usePerfil();
  const { resultado, carregando, erro, calcular } = useAstrologia();

  useEffect(() => {
    if (completo && perfil && !resultado) {
      calcular({
        nome: perfil.nome,
        data: perfil.dataNascimento,
        hora: perfil.horaNascimento,
        cidadeNome: perfil.cidadeNome,
        cidadeUf: perfil.cidadeUf,
      });
    }
  }, [completo, perfil, resultado, calcular]);

  if (!completo) {
    return (
      <section className="painel-astrologia">
        <AvisoPreencherPerfil
          titulo="Mapa Astral"
          descricao="Para calcular seu mapa astral, precisamos da sua data, hora e cidade de nascimento."
          icone="fa-solid fa-star"
        />
      </section>
    );
  }

  const nome = perfil?.nome?.trim().split(/\s+/)[0] || "Você";

  return (
    <section className="painel-astrologia">
      <header className="painel-astrologia__cabecalho">
        <div className="painel-astrologia__cabecalho-superior">
          <span>ORACULVM · ASTROLOGIA</span>
          <span>TRATADO CELESTE</span>
        </div>

        <div className="painel-astrologia__apresentacao">
          <div className="painel-astrologia__emblema" aria-hidden="true">
            <span className="painel-astrologia__emblema-anel">
              <Icon icon="game-icons:astrolabe" />
            </span>
          </div>

          <span className="painel-astrologia__sobretitulo">
            O CÉU NO INSTANTE DO NASCIMENTO
          </span>

          <h1 className="painel-astrologia__titulo">
            Seu Mapa Astral
          </h1>

          <div className="painel-astrologia__divisor" aria-hidden="true">
            <span />
            <Icon icon="mdi:star-four-points" />
            <span />
          </div>

          <p className="painel-astrologia__descricao">
            Uma representação das posições dos astros no momento do
            seu nascimento, acompanhada de interpretações sobre
            signos, planetas, casas e aspectos astrológicos.
          </p>
        </div>

        <div className="painel-astrologia__registro">
          <div className="painel-astrologia__registro-item">
            <Icon icon="mdi:account-outline" />

            <div>
              <span>MAPA DE NASCIMENTO</span>
              <strong>{nome}</strong>
            </div>
          </div>

          <span className="painel-astrologia__registro-divisor" />

          <div className="painel-astrologia__registro-item">
            <Icon icon="mdi:calendar-star" />

            <div>
              <span>DATA DE NASCIMENTO</span>
              <strong>
                {perfil?.dataNascimento
                  ? perfil.dataNascimento.split("-").reverse().join("/")
                  : "Não informada"}
              </strong>
            </div>
          </div>

          <span className="painel-astrologia__registro-divisor" />

          <div className="painel-astrologia__registro-item">
            <Icon icon="mdi:map-marker-outline" />

            <div>
              <span>LOCAL DE NASCIMENTO</span>
              <strong>
                {perfil?.cidadeNome}
                {perfil?.cidadeUf ? `, ${perfil.cidadeUf}` : ""}
              </strong>
            </div>
          </div>
        </div>
      </header>

      <div className="painel-astrologia__conteudo">
        {erro && (
          <div className="painel-astrologia__erro" role="alert">
            <Icon icon="mdi:alert-circle-outline" />

            <div>
              <strong>Não foi possível calcular o mapa</strong>
              <p>{erro}</p>
            </div>
          </div>
        )}

        {(carregando || (!resultado && !erro)) && (
          <div className="painel-astrologia__carregamento">
            <div className="painel-astrologia__carregamento-cabecalho">
              <Icon icon="mdi:star-four-points" />
              <span>PREPARANDO SUA CARTOGRAFIA CELESTE</span>
              <Icon icon="mdi:star-four-points" />
            </div>

            <MapaAstralSkeleton />
          </div>
        )}

        {resultado && !carregando && (
          <>
            <section className="painel-astrologia__secao">
              <div className="painel-astrologia__secao-cabecalho">
                <span>FIGURA I · CARTOGRAFIA CELESTE</span>
                <span>MAPA NATAL</span>
              </div>

              <div className="painel-astrologia__secao-introducao">
                <span className="painel-astrologia__secao-rotulo">
                  A CONFIGURAÇÃO DO CÉU
                </span>

                <h2 className="painel-astrologia__secao-titulo">
                  Mapa Astral
                </h2>
              </div>

              <MapaAstral resultado={resultado} />
            </section>

            <div className="painel-astrologia__separador" aria-hidden="true">
              <span />
              <Icon icon="mdi:star-four-points" />
              <span />
            </div>

            <section className="painel-astrologia__secao">
              <div className="painel-astrologia__secao-cabecalho">
                <span>FIGURA II · POSIÇÕES PLANETÁRIAS</span>
                <span>ASTROS E SIGNOS</span>
              </div>

              <div className="painel-astrologia__secao-introducao">
                <span className="painel-astrologia__secao-rotulo">
                  OS CORPOS CELESTES
                </span>

                <h2 className="painel-astrologia__secao-titulo">
                  Posições dos Planetas
                </h2>
              </div>

              <ResumoPlanetas resultado={resultado} />
            </section>

            <div className="painel-astrologia__separador" aria-hidden="true">
              <span />
              <Icon icon="mdi:star-four-points" />
              <span />
            </div>

            <section className="painel-astrologia__secao">
              <div className="painel-astrologia__secao-cabecalho">
                <span>FIGURA III · COMPARAÇÃO CELESTE</span>
                <span>SINASTRIA</span>
              </div>

              <div className="painel-astrologia__secao-introducao">
                <span className="painel-astrologia__secao-rotulo">
                  A RELAÇÃO ENTRE DOIS MAPAS
                </span>

                <h2 className="painel-astrologia__secao-titulo">
                  Sinastria
                </h2>
              </div>

              <Sinastria
                mapaA={resultado}
                nomeA={perfil?.nome ?? "Você"}
              />
            </section>

            <div className="painel-astrologia__separador" aria-hidden="true">
              <span />
              <Icon icon="mdi:star-four-points" />
              <span />
            </div>

            <section className="painel-astrologia__secao">
              <div className="painel-astrologia__secao-cabecalho">
                <span>FIGURA IV · LEITURA ASTROLÓGICA</span>
                <span>INTERPRETAÇÕES</span>
              </div>

              <div className="painel-astrologia__secao-introducao">
                <span className="painel-astrologia__secao-rotulo">
                  OS SIGNIFICADOS DO MAPA
                </span>

                <h2 className="painel-astrologia__secao-titulo">
                  Interpretações
                </h2>
              </div>

              <Interpretacoes resultado={resultado} />
            </section>

            <div className="painel-astrologia__separador" aria-hidden="true">
              <span />
              <Icon icon="mdi:star-four-points" />
              <span />
            </div>

            <section className="painel-astrologia__secao">
              <div className="painel-astrologia__secao-cabecalho">
                <span>FIGURA V · RELAÇÕES PLANETÁRIAS</span>
                <span>ASPECTOS</span>
              </div>

              <div className="painel-astrologia__secao-introducao">
                <span className="painel-astrologia__secao-rotulo">
                  OS ÂNGULOS ENTRE OS ASTROS
                </span>

                <h2 className="painel-astrologia__secao-titulo">
                  Aspectos Astrológicos
                </h2>
              </div>

              <ListaAspectos planetas={resultado.planetas} />
            </section>

            <footer className="painel-astrologia__rodape">
              <span>ORACULVM</span>
              <Icon icon="game-icons:astrolabe" />
              <span>ASTROLOGIA NATAL</span>
            </footer>
          </>
        )}
      </div>
    </section>
  );
}