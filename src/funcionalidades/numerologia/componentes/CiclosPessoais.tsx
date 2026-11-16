import { useId, useState } from "react";
import { Icon } from "@iconify/react";
import type { CiclosPessoais as Ciclos } from "../servicos/ciclos";
import {
  ANO_PESSOAL,
  MES_PESSOAL,
  DIA_PESSOAL,
} from "../dados/interpretacoes/ciclos";
import "./CiclosPessoais.scss";

interface Props {
  ciclos: Ciclos;
}

type Chave = "ano" | "mes" | "dia";

const META: Record<
  Chave,
  {
    titulo: string;
    numero: (c: Ciclos) => number;
    textos: typeof ANO_PESSOAL;
    sufixo: string;
    identificacao: string;
    icone: string;
  }
> = {
  ano: {
    titulo: "Ano Pessoal",
    numero: (c) => c.anoPessoal,
    textos: ANO_PESSOAL,
    sufixo: "Tema do ano",
    identificacao: "CICLO I",
    icone: "mdi:weather-sunny",
  },
  mes: {
    titulo: "Mês Pessoal",
    numero: (c) => c.mesPessoal,
    textos: MES_PESSOAL,
    sufixo: "Tom do mês",
    identificacao: "CICLO II",
    icone: "mdi:moon-waning-crescent",
  },
  dia: {
    titulo: "Dia Pessoal",
    numero: (c) => c.diaPessoal,
    textos: DIA_PESSOAL,
    sufixo: "Energia do dia",
    identificacao: "CICLO III",
    icone: "mdi:star-four-points",
  },
};

const CHAVES: Chave[] = ["ano", "mes", "dia"];

export function CiclosPessoais({ ciclos }: Props) {
  const [chave, setChave] = useState<Chave>("ano");
  const idBase = useId();

  const meta = META[chave];
  const numero = meta.numero(ciclos);
  const texto = meta.textos[numero];

  return (
    <section className="ciclos-pessoais">
      <p className="ciclos-pessoais__introducao">
        Os ciclos pessoais representam diferentes períodos da sua
        trajetória. Selecione o ano, o mês ou o dia para consultar
        a interpretação numerológica correspondente.
      </p>

      <div
        className="ciclos-pessoais__seletor"
        role="tablist"
        aria-label="Selecionar ciclo pessoal"
      >
        {CHAVES.map((item) => {
          const configuracao = META[item];
          const ativo = item === chave;

          return (
            <button
              key={item}
              id={`${idBase}-${item}`}
              type="button"
              role="tab"
              aria-selected={ativo}
              aria-controls={`${idBase}-interpretacao`}
              tabIndex={ativo ? 0 : -1}
              className={`ciclos-pessoais__opcao ${
                ativo ? "ativa" : ""
              }`}
              onClick={() => setChave(item)}
              onKeyDown={(evento) => {
                if (
                  evento.key !== "ArrowRight" &&
                  evento.key !== "ArrowLeft" &&
                  evento.key !== "Home" &&
                  evento.key !== "End"
                ) {
                  return;
                }

                evento.preventDefault();

                const indice = CHAVES.indexOf(item);

                const proximo =
                  evento.key === "Home"
                    ? 0
                    : evento.key === "End"
                      ? CHAVES.length - 1
                      : evento.key === "ArrowRight"
                        ? (indice + 1) % CHAVES.length
                        : (indice - 1 + CHAVES.length) %
                          CHAVES.length;

                const proximaChave = CHAVES[proximo];

                setChave(proximaChave);

                document
                  .getElementById(`${idBase}-${proximaChave}`)
                  ?.focus();
              }}
            >
              <span className="ciclos-pessoais__opcao-superior">
                <span className="ciclos-pessoais__opcao-indice">
                  {configuracao.identificacao}
                </span>

                <Icon icon={configuracao.icone} />
              </span>

              <span className="ciclos-pessoais__opcao-conteudo">
                <span className="ciclos-pessoais__opcao-numero">
                  {configuracao.numero(ciclos)}
                </span>

                <span className="ciclos-pessoais__opcao-rotulo">
                  {configuracao.titulo}
                </span>
              </span>

              <span className="ciclos-pessoais__opcao-rodape">
                {configuracao.sufixo}
              </span>
            </button>
          );
        })}
      </div>

      {texto && (
        <article
          id={`${idBase}-interpretacao`}
          role="tabpanel"
          aria-labelledby={`${idBase}-${chave}`}
          tabIndex={0}
          className="ciclos-pessoais__texto"
          key={`${chave}-${numero}`}
        >
          <div className="ciclos-pessoais__texto-superior">
            <span>ORACULVM · INTERPRETAÇÃO DOS CICLOS</span>
            <span>{meta.identificacao}</span>
          </div>

          <header className="ciclos-pessoais__texto-cabecalho">
            <div className="ciclos-pessoais__medalhao">
              <Icon icon={meta.icone} />

              <span className="ciclos-pessoais__medalhao-numero">
                {numero}
              </span>
            </div>

            <div className="ciclos-pessoais__texto-identificacao">
              <span className="ciclos-pessoais__texto-sufixo">
                {meta.titulo} · {meta.sufixo}
              </span>

              <h4 className="ciclos-pessoais__texto-titulo">
                {texto.titulo}
              </h4>
            </div>
          </header>

          <div className="ciclos-pessoais__divisor">
            <span />
            <Icon icon="mdi:star-four-points" />
            <span />
          </div>

          <div className="ciclos-pessoais__bloco ciclos-pessoais__bloco--principal">
            <div className="ciclos-pessoais__bloco-cabecalho">
              <span className="ciclos-pessoais__bloco-indice">
                I
              </span>

              <div>
                <span className="ciclos-pessoais__rotulo">
                  O que significa
                </span>
                <span className="ciclos-pessoais__bloco-descricao">
                  A natureza deste ciclo
                </span>
              </div>
            </div>

            <p>{texto.significado}</p>
          </div>

          <div className="ciclos-pessoais__bloco ciclos-pessoais__bloco--principal">
            <div className="ciclos-pessoais__bloco-cabecalho">
              <span className="ciclos-pessoais__bloco-indice">
                II
              </span>

              <div>
                <span className="ciclos-pessoais__rotulo">
                  O que esperar
                </span>
                <span className="ciclos-pessoais__bloco-descricao">
                  Tendências e possibilidades
                </span>
              </div>
            </div>

            <p>{texto.esperar}</p>
          </div>

          <div className="ciclos-pessoais__dois-blocos">
            <div className="ciclos-pessoais__bloco ciclos-pessoais__bloco--fazer">
              <div className="ciclos-pessoais__bloco-cabecalho">
                <span className="ciclos-pessoais__bloco-icone">
                  <Icon icon="mdi:check-circle-outline" />
                </span>

                <div>
                  <span className="ciclos-pessoais__rotulo">
                    O que fazer
                  </span>
                  <span className="ciclos-pessoais__bloco-descricao">
                    Orientações do período
                  </span>
                </div>
              </div>

              <p>{texto.fazer}</p>
            </div>

            <div className="ciclos-pessoais__bloco ciclos-pessoais__bloco--evitar">
              <div className="ciclos-pessoais__bloco-cabecalho">
                <span className="ciclos-pessoais__bloco-icone">
                  <Icon icon="mdi:alert-circle-outline" />
                </span>

                <div>
                  <span className="ciclos-pessoais__rotulo">
                    O que evitar
                  </span>
                  <span className="ciclos-pessoais__bloco-descricao">
                    Pontos de atenção
                  </span>
                </div>
              </div>

              <p>{texto.evitar}</p>
            </div>
          </div>

          <footer className="ciclos-pessoais__rodape">
            <Icon icon="mdi:star-four-points" />
            <span>
              ORACULVM · {meta.titulo.toUpperCase()}
            </span>
            <Icon icon="mdi:star-four-points" />
          </footer>
        </article>
      )}
    </section>
  );
}