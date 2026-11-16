import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useNumerologia } from "./ganchos/useNumerologia";
import { useCiclos } from "./ganchos/useCiclos";
import { usePerfil } from "../../nucleo/contextos/PerfilContexto";
import { AvisoPreencherPerfil } from "../../compartilhado/componentes/AvisoPreencherPerfil";
import { ResultadoNumero } from "./componentes/ResultadoNumero";
import { MandalaNumeros } from "./componentes/MandalaNumeros";
import { ModalComoFunciona } from "./componentes/ModalComoFunciona";
import { CiclosPessoais } from "./componentes/CiclosPessoais";
import { Compatibilidade } from "./componentes/Compatibilidade";
import { CAMINHO_DE_VIDA } from "./dados/interpretacoes/caminho-de-vida";
import { EXPRESSAO } from "./dados/interpretacoes/expressao";
import { ALMA } from "./dados/interpretacoes/alma";
import { PERSONALIDADE } from "./dados/interpretacoes/personalidade";
import { ANIVERSARIO } from "./dados/interpretacoes/aniversario";
import { MATURIDADE } from "./dados/interpretacoes/maturidade";
import { KARMICO } from "./dados/interpretacoes/karmico";
import { RESUMOS } from "./dados/resumos";
import type { InterpretacaoNumero } from "./dados/interpretacoes/modelo";
import "./PainelNumerologia.scss";

export interface NumeroInfo {
  chave: string;
  numero: number;
  titulo: string;
  contexto: string;
}

const CAPITULOS: Record<
  string,
  { indice: string; descricao: string; icone: string }
> = {
  caminhoDeVida: {
    indice: "I",
    descricao: "Destino e propósito",
    icone: "mdi:compass-outline",
  },
  expressao: {
    indice: "II",
    descricao: "Identidade e expressão",
    icone: "mdi:creation-outline",
  },
  alma: {
    indice: "III",
    descricao: "Desejos interiores",
    icone: "mdi:heart-outline",
  },
  personalidade: {
    indice: "IV",
    descricao: "Imagem exterior",
    icone: "mdi:account-outline",
  },
  aniversario: {
    indice: "V",
    descricao: "Talentos de nascimento",
    icone: "mdi:star-four-points-outline",
  },
  maturidade: {
    indice: "VI",
    descricao: "Desenvolvimento pessoal",
    icone: "mdi:tree-outline",
  },
  karmico: {
    indice: "VII",
    descricao: "Aprendizados e desafios",
    icone: "mdi:scale-balance",
  },
};

function buscarInterpretacao(
  chave: string,
  numero: number
): InterpretacaoNumero | undefined {
  if (chave === "caminhoDeVida") return CAMINHO_DE_VIDA[numero];
  if (chave === "expressao") return EXPRESSAO[numero];
  if (chave === "alma") return ALMA[numero];
  if (chave === "personalidade") return PERSONALIDADE[numero];
  if (chave === "aniversario") return ANIVERSARIO[numero];
  if (chave === "maturidade") return MATURIDADE[numero];
  if (chave === "karmico") return KARMICO[numero];

  return undefined;
}

export function PainelNumerologia() {
  const { perfil, completo } = usePerfil();
  const { resultado, erro, calcular } = useNumerologia();
  const ciclos = useCiclos(perfil?.dataNascimento);

  const [chaveSelecionada, setChaveSelecionada] =
    useState<string>("caminhoDeVida");

  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    if (completo && perfil && !resultado) {
      calcular({
        nomeCompleto: perfil.nome,
        dataNascimento: perfil.dataNascimento,
      });
    }
  }, [completo, perfil, resultado, calcular]);

  if (!completo) {
    return (
      <div className="painel-numerologia">
        <AvisoPreencherPerfil
          titulo="Numerologia"
          descricao="Informe seu nome completo e sua data de nascimento para calcular seus números pessoais."
          icone="fa-solid fa-hashtag"
        />
      </div>
    );
  }

  const numeros: NumeroInfo[] = resultado
    ? [
        {
          chave: "caminhoDeVida",
          numero: resultado.caminhoDeVida,
          titulo: "Caminho de Vida",
          contexto: "Seu propósito de vida e missão principal.",
        },
        {
          chave: "expressao",
          numero: resultado.expressao,
          titulo: "Expressão",
          contexto: "Como você se mostra e se comunica com o mundo.",
        },
        {
          chave: "alma",
          numero: resultado.alma,
          titulo: "Alma",
          contexto: "O que seu coração realmente deseja.",
        },
        {
          chave: "personalidade",
          numero: resultado.personalidade,
          titulo: "Personalidade",
          contexto: "Como as pessoas te percebem por fora.",
        },
        {
          chave: "aniversario",
          numero: resultado.aniversario,
          titulo: "Aniversário",
          contexto: "O talento especial que você trouxe ao nascer.",
        },
        {
          chave: "maturidade",
          numero: resultado.maturidade,
          titulo: "Maturidade",
          contexto: "Quem você se torna na segunda metade da vida.",
        },
        {
          chave: "karmico",
          numero: resultado.karmico,
          titulo: "Kármico",
          contexto: "Lições que sua alma escolheu aprender nesta vida.",
        },
      ]
    : [];

  const infoAtiva =
    numeros.find((numero) => numero.chave === chaveSelecionada) ??
    numeros[0];

  return (
    <section className="painel-numerologia">
      <header className="painel-numerologia__cabecalho">
        <div className="painel-numerologia__identificacao">
          <span>ORACULVM · TRATADO DOS NÚMEROS</span>
          <span>VOLUME II</span>
        </div>

        <div className="painel-numerologia__introducao">
          <div className="painel-numerologia__emblema" aria-hidden="true">
            <span className="painel-numerologia__emblema-anel">
              <Icon icon="mdi:creation" />
            </span>

            <span className="painel-numerologia__emblema-numero">
              VII
            </span>
          </div>

          <span className="painel-numerologia__sobretitulo">
            O ESTUDO SIMBÓLICO DOS NÚMEROS
          </span>

          <h2 className="painel-numerologia__titulo">
            Numerologia
          </h2>

          <div
            className="painel-numerologia__divisor"
            aria-hidden="true"
          >
            <span />
            <Icon icon="mdi:star-four-points" />
            <span />
          </div>

          <p className="painel-numerologia__descricao">
            Sete números pessoais extraídos do nome e da data de
            nascimento, reunidos em uma leitura sobre identidade,
            tendências, ciclos e relações.
          </p>

          <button
            type="button"
            className="painel-numerologia__info"
            onClick={() => setModalAberto(true)}
          >
            <Icon icon="mdi:information-outline" />
            <span>Como funciona a numerologia?</span>
          </button>
        </div>
      </header>

      {erro && (
        <div className="painel-numerologia__erro" role="alert">
          <Icon icon="mdi:alert-circle-outline" />
          <span>{erro}</span>
        </div>
      )}

      {resultado && infoAtiva && (
        <>
          <section className="painel-numerologia__secao">
            <div className="painel-numerologia__secao-cabecalho">
              <span>FIGURA I · COMPOSIÇÃO NUMÉRICA</span>
              <span>07 NÚMEROS</span>
            </div>

            <div className="painel-numerologia__secao-introducao">
              <span className="painel-numerologia__secao-rotulo">
                OS SETE NÚMEROS PESSOAIS
              </span>

              <h3 className="painel-numerologia__secao-titulo">
                Seu Mapa Numerológico
              </h3>
            </div>

            <MandalaNumeros
              numeros={numeros}
              chaveAtiva={chaveSelecionada}
              aoSelecionar={setChaveSelecionada}
            />
          </section>

          <section className="painel-numerologia__secao painel-numerologia__secao--leitura">
            <div className="painel-numerologia__secao-cabecalho">
              <span>FIGURA II · INTERPRETAÇÃO PESSOAL</span>
              <span>I — VII</span>
            </div>

            <div className="painel-numerologia__secao-introducao">
              <span className="painel-numerologia__secao-rotulo">
                OS SIGNIFICADOS DOS NÚMEROS
              </span>

              <h3 className="painel-numerologia__secao-titulo">
                O Tratado dos Sete Números
              </h3>
            </div>

            <div className="painel-numerologia__layout">
              <aside className="painel-numerologia__navegacao">
                <div className="painel-numerologia__menu-cabecalho">
                  <Icon icon="mdi:book-open-page-variant-outline" />

                  <div>
                    <span>ÍNDICE DO TRATADO</span>
                    <strong>Capítulos</strong>
                  </div>
                </div>

                <div
                  className="painel-numerologia__menu"
                  role="tablist"
                  aria-label="Números pessoais"
                >
                  {numeros.map((info) => {
                    const ativo = info.chave === chaveSelecionada;
                    const capitulo = CAPITULOS[info.chave];

                    return (
                      <button
                        key={info.chave}
                        type="button"
                        role="tab"
                        aria-selected={ativo}
                        className={`painel-numerologia__aba ${
                          ativo ? "ativa" : ""
                        }`}
                        onClick={() =>
                          setChaveSelecionada(info.chave)
                        }
                      >
                        <span className="painel-numerologia__aba-indice">
                          {capitulo.indice}
                        </span>

                        <span className="painel-numerologia__aba-icone">
                          <Icon icon={capitulo.icone} />
                        </span>

                        <span className="painel-numerologia__aba-textos">
                          <strong>{info.titulo}</strong>
                          <small>{capitulo.descricao}</small>
                        </span>

                        <span className="painel-numerologia__aba-numero">
                          {info.numero}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div className="painel-numerologia__menu-rodape">
                  <Icon icon="mdi:star-four-points" />
                  <span>SETE CHAVES DE LEITURA</span>
                </div>
              </aside>

              <div className="painel-numerologia__conteudo">
                <div className="painel-numerologia__conteudo-topo">
                  <span>
                    CAPÍTULO {CAPITULOS[infoAtiva.chave].indice}
                  </span>

                  <Icon icon="mdi:star-four-points" />

                  <span>LEITURA NUMEROLÓGICA</span>
                </div>

                <ResultadoNumero
                  numero={infoAtiva.numero}
                  titulo={infoAtiva.titulo}
                  contexto={infoAtiva.contexto}
                  resumo={
                    (
                      RESUMOS as unknown as Record<
                        string,
                        Record<number, string>
                      >
                    )[infoAtiva.chave]?.[infoAtiva.numero]
                  }
                  interpretacao={buscarInterpretacao(
                    infoAtiva.chave,
                    infoAtiva.numero
                  )}
                  destaque={infoAtiva.chave === "caminhoDeVida"}
                />
              </div>
            </div>
          </section>

          <section className="painel-numerologia__secao painel-numerologia__secao--ciclos">
            <div className="painel-numerologia__secao-cabecalho">
              <span>FIGURA III · O TEMPO E OS NÚMEROS</span>
              <span>CICLOS PESSOAIS</span>
            </div>

            <div className="painel-numerologia__secao-introducao">
              <span className="painel-numerologia__secao-rotulo">
                AS ETAPAS DA VIDA
              </span>

              <h3 className="painel-numerologia__secao-titulo">
                Ciclos Pessoais
              </h3>
            </div>

            {ciclos && <CiclosPessoais ciclos={ciclos} />}
          </section>

          <section className="painel-numerologia__secao painel-numerologia__secao--compatibilidade">
            <div className="painel-numerologia__secao-cabecalho">
              <span>FIGURA IV · RELAÇÕES NUMÉRICAS</span>
              <span>COMPATIBILIDADE</span>
            </div>

            <div className="painel-numerologia__secao-introducao">
              <span className="painel-numerologia__secao-rotulo">
                A RELAÇÃO ENTRE DOIS PERFIS
              </span>

              <h3 className="painel-numerologia__secao-titulo">
                Compatibilidade
              </h3>
            </div>

            <Compatibilidade
              nomeA={perfil?.nome ?? ""}
              dataA={perfil?.dataNascimento ?? ""}
            />
          </section>

          <footer className="painel-numerologia__rodape">
            <Icon icon="mdi:star-four-points" />

            <p>
              A numerologia é uma tradição interpretativa simbólica,
              não um método científico de previsão.
            </p>

            <Icon icon="mdi:star-four-points" />
          </footer>
        </>
      )}

      <ModalComoFunciona
        aberto={modalAberto}
        aoFechar={() => setModalAberto(false)}
      />
    </section>
  );
}