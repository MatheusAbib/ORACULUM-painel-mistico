import { useState } from "react";
import { Icon } from "@iconify/react";
import type { InterpretacaoNumero } from "../dados/interpretacoes/modelo";
import "./ResultadoNumero.scss";

interface Props {
  numero: number;
  titulo: string;
  contexto?: string;
  resumo?: string;
  interpretacao: InterpretacaoNumero | undefined;
  destaque?: boolean;
  aberto?: boolean;
  aoClicar?: () => void;
}

interface SecaoProps {
  titulo: string;
  paragrafos: string[];
  indice: string;
  icone: string;
}

const SECOES = [
  {
    chave: "quemVoceE",
    titulo: "Quem você é",
    indice: "I",
    icone: "mdi:account-outline",
  },
  {
    chave: "desafio",
    titulo: "Seu maior desafio",
    indice: "II",
    icone: "mdi:scale-balance",
  },
  {
    chave: "ondeBrilha",
    titulo: "Onde você brilha",
    indice: "III",
    icone: "mdi:star-four-points-outline",
  },
  {
    chave: "naPratica",
    titulo: "Na prática",
    indice: "IV",
    icone: "mdi:compass-outline",
  },
] as const;

function Secao({ titulo, paragrafos, indice, icone }: SecaoProps) {
  const [expandido, setExpandido] = useState(false);

  return (
    <div
      className={`resultado-numero__secao-bloco ${
        expandido ? "expandido" : ""
      }`}
    >
      <h5 className="resultado-numero__secao-heading">
        <button
          type="button"
          className="resultado-numero__secao-cabecalho"
          aria-expanded={expandido}
          onClick={(evento) => {
            evento.stopPropagation();
            setExpandido((valor) => !valor);
          }}
        >
          <span className="resultado-numero__secao-indice">
            {indice}
          </span>

          <span className="resultado-numero__secao-icone">
            <Icon icon={icone} />
          </span>

          <span className="resultado-numero__secao-titulo">
            {titulo}
          </span>

          <Icon
            icon="mdi:chevron-down"
            className="resultado-numero__secao-seta"
          />
        </button>
      </h5>

      {expandido && (
        <div className="resultado-numero__secao-corpo">
          <div className="resultado-numero__secao-divisor">
            <span />
            <Icon icon="mdi:star-four-points" />
            <span />
          </div>

          {paragrafos.map((paragrafo, indiceParagrafo) => (
            <p
              key={indiceParagrafo}
              className="resultado-numero__paragrafo"
            >
              {paragrafo}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}

export function ResultadoNumero({
  numero,
  titulo,
  contexto,
  resumo,
  interpretacao,
  destaque = false,
  aberto = false,
  aoClicar,
}: Props) {
  return (
    <article
      className={`resultado-numero ${
        destaque ? "resultado-numero--destaque" : ""
      } ${aberto ? "resultado-numero--aberto" : ""}`}
      onClick={aoClicar}
    >
      <div className="resultado-numero__pagina-topo">
        <span>ORACULVM · REGISTRO NUMEROLÓGICO</span>
        <Icon icon="mdi:star-four-points" />
        <span>ESTUDO PESSOAL</span>
      </div>

      <header className="resultado-numero__cabecalho">
        <div className="resultado-numero__circulo">
          <span className="resultado-numero__circulo-ornamento">
            <Icon icon="mdi:creation" />
          </span>

          <span className="resultado-numero__valor">
            {numero}
          </span>
        </div>

        <div className="resultado-numero__info">
          <span className="resultado-numero__rotulo">
            NÚMERO PESSOAL
          </span>

          <h3 className="resultado-numero__titulo">
            {titulo}
          </h3>

          {contexto && (
            <p className="resultado-numero__contexto">
              {contexto}
            </p>
          )}
        </div>
      </header>

      {resumo && (
        <div className="resultado-numero__resumo">
          <Icon
            icon="mdi:format-quote-open"
            className="resultado-numero__resumo-icone"
          />

          <p className="resultado-numero__resumo-texto">
            {resumo}
          </p>
        </div>
      )}

      {!interpretacao && (
        <div className="resultado-numero__em-breve">
          <Icon icon="mdi:hourglass-empty" />
          <span>Texto em produção — em breve.</span>
        </div>
      )}

      {interpretacao && (
        <div className="resultado-numero__conteudo">
          <div className="resultado-numero__interpretacao-cabecalho">
            <span>LEITURA E INTERPRETAÇÃO</span>
            <Icon icon="mdi:star-four-points" />
          </div>

          <h4 className="resultado-numero__subtitulo-numero">
            {interpretacao.titulo}
          </h4>

          <p className="resultado-numero__descricao-curta">
            {interpretacao.subtitulo}
          </p>

          <div className="resultado-numero__secoes-cabecalho">
            <div>
              <span>OS QUATRO ASPECTOS</span>
              <h4>Interpretação detalhada</h4>
            </div>

            <span>01 — 04</span>
          </div>

          <div className="resultado-numero__secoes">
            {SECOES.map((secao) => (
              <Secao
                key={`${numero}-${titulo}-${secao.chave}`}
                titulo={secao.titulo}
                indice={secao.indice}
                icone={secao.icone}
                paragrafos={interpretacao[secao.chave]}
              />
            ))}
          </div>
        </div>
      )}

      <footer className="resultado-numero__rodape">
        <Icon icon="mdi:star-four-points" />
        <span>ORACULVM · TRATADO DOS NÚMEROS</span>
        <Icon icon="mdi:star-four-points" />
      </footer>
    </article>
  );
}