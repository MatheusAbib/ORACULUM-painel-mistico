import { Icon } from "@iconify/react";
import { grauParaSigno } from "../servicos/astrologia";
import type { ResultadoMapaAstral } from "../servicos/astrologia";
import { IconePlaneta } from "./IconePlaneta";
import { IconeSigno } from "./IconeSigno";
import "./ResumoPlanetas.scss";

interface Props {
  resultado: ResultadoMapaAstral;
}

function formatarPosicao(grau: number) {
  const posicao = ((grau % 30) + 30) % 30;
  const graus = Math.floor(posicao);
  const minutos = Math.floor((posicao - graus) * 60);

  return `${String(graus).padStart(2, "0")}° ${String(minutos).padStart(2, "0")}′`;
}

export function ResumoPlanetas({ resultado }: Props) {
  const signoAscendente = grauParaSigno(resultado.ascendente);
  const signoMeioDoCeu = grauParaSigno(resultado.meioDoCeu);

  const destaques = [
    {
      numero: "I",
      rotulo: "Ascendente",
      descricao: "O horizonte oriental",
      signo: signoAscendente,
      grau: formatarPosicao(resultado.ascendente),
      icone: "mdi:weather-sunset-up",
    },
    {
      numero: "II",
      rotulo: "Meio do Céu",
      descricao: "O ponto mais alto do mapa",
      signo: signoMeioDoCeu,
      grau: formatarPosicao(resultado.meioDoCeu),
      icone: "mdi:star-four-points-outline",
    },
  ];

  return (
    <section className="resumo-planetas">


      <div className="resumo-planetas__secao-cabecalho">
        <div>
          <span>CAPÍTULO I</span>
          <h4>Os ângulos do mapa</h4>
        </div>

        <span className="resumo-planetas__secao-indice">
          02 REGISTROS
        </span>
      </div>

      <div className="resumo-planetas__destaques">
        {destaques.map((destaque) => (
          <article
            key={destaque.rotulo}
            className="resumo-planetas__destaque"
          >
            <div className="resumo-planetas__destaque-topo">
              <span>ÂNGULO {destaque.numero}</span>
              <Icon icon={destaque.icone} />
            </div>

            <div className="resumo-planetas__destaque-corpo">
              <div className="resumo-planetas__destaque-info">
                <span className="resumo-planetas__destaque-rotulo">
                  {destaque.rotulo}
                </span>

                <strong className="resumo-planetas__destaque-signo">
                  {destaque.signo}
                </strong>

                <span className="resumo-planetas__destaque-grau">
                  {destaque.grau}
                </span>
              </div>

              <div
                className="resumo-planetas__destaque-icone"
                aria-hidden="true"
              >
                <IconeSigno
                  signo={destaque.signo}
                  tamanho={62}
                />
              </div>
            </div>

            <div className="resumo-planetas__destaque-rodape">
              <Icon icon="mdi:star-four-points" />
              <span>{destaque.descricao}</span>
            </div>
          </article>
        ))}
      </div>

      <div className="resumo-planetas__secao-cabecalho resumo-planetas__secao-cabecalho--planetas">
        <div>
          <span>CAPÍTULO II</span>
          <h4>O registro dos planetas</h4>
        </div>

        <span className="resumo-planetas__secao-indice">
          {String(resultado.planetas.length).padStart(2, "0")} CORPOS
        </span>
      </div>

      <div className="resumo-planetas__grade">
        {resultado.planetas.map((planeta, indice) => (
          <article
            key={`${planeta.nome}-${indice}`}
            className="resumo-planetas__card"
          >
            <div className="resumo-planetas__card-icone" aria-hidden="true">
              <IconePlaneta
                planeta={planeta.nome}
                tamanho={37}
              />
            </div>

            <div className="resumo-planetas__card-info">
              <span className="resumo-planetas__card-numero">
                CORPO CELESTE {String(indice + 1).padStart(2, "0")}
              </span>

              <h5 className="resumo-planetas__card-nome">
                {planeta.nome}
              </h5>

              <div className="resumo-planetas__card-posicao">
                <IconeSigno
                  signo={planeta.signo}
                  tamanho={20}
                />

                <span className="resumo-planetas__card-signo">
                  {planeta.signo}
                </span>
              </div>
            </div>

            <div className="resumo-planetas__card-coordenada">
              <span>POSIÇÃO</span>
              <strong>
                {formatarPosicao(planeta.grau)}
              </strong>
            </div>
          </article>
        ))}
      </div>

      <footer className="resumo-planetas__rodape">
        <Icon icon="mdi:star-four-points" />

        <p>
          As posições são apresentadas em graus e minutos
          dentro de cada signo do zodíaco.
        </p>

        <Icon icon="mdi:star-four-points" />
      </footer>
    </section>
  );
}