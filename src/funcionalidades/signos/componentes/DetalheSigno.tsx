import { useState } from "react";
import { Icon } from "@iconify/react";
import type { Signo } from "../dados/signos";
import { IconeSigno } from "../../astrologia/componentes/IconeSigno";
import "./DetalheSigno.scss";

interface Props {
  signo: Signo;
}

type SecaoId = "quemE" | "amor" | "trabalho" | "luz" | "sombra" | "jornada";

const SECOES: {
  id: SecaoId;
  titulo: string;
  icone: string;
}[] = [
  {
    id: "quemE",
    titulo: "Quem é",
    icone: "mdi:account-outline",
  },
  {
    id: "amor",
    titulo: "Amor e Relações",
    icone: "mdi:heart-outline",
  },
  {
    id: "trabalho",
    titulo: "Trabalho e Propósito",
    icone: "mdi:briefcase-outline",
  },
  {
    id: "luz",
    titulo: "Luz",
    icone: "mdi:white-balance-sunny",
  },
  {
    id: "sombra",
    titulo: "Sombra",
    icone: "mdi:moon-waning-crescent",
  },
  {
    id: "jornada",
    titulo: "Jornada",
    icone: "mdi:compass-outline",
  },
];

export function DetalheSigno({ signo }: Props) {
  return (
    <article className="detalhe-signo">
      <header className="detalhe-signo__cabecalho">
        <div className="detalhe-signo__simbolo" aria-hidden="true">
          <div className="detalhe-signo__simbolo-anel">
            <IconeSigno signo={signo.nome} tamanho={100} />
          </div>
        </div>

        <div className="detalhe-signo__info">
          <span className="detalhe-signo__rotulo">
            PERFIL ASTROLÓGICO
          </span>

          <h2 className="detalhe-signo__nome">
            {signo.nome}
          </h2>

          <p className="detalhe-signo__descricao">
            {signo.descricao}
          </p>

          <div className="detalhe-signo__tags">
            <span className="detalhe-signo__tag">
              {signo.elemento}
            </span>

            <span className="detalhe-signo__tag">
              {signo.modalidade}
            </span>

            <span className="detalhe-signo__tag">
              Regido por {signo.regente}
            </span>

            <span className="detalhe-signo__tag">
              {signo.dataInicio} — {signo.dataFim}
            </span>
          </div>
        </div>
      </header>

      <div className="detalhe-signo__resumo">
        <Icon
          icon="mdi:format-quote-open"
          className="detalhe-signo__resumo-icone"
        />

        <div className="detalhe-signo__resumo-conteudo">
          <span className="detalhe-signo__resumo-rotulo">
            A ESSÊNCIA DO SIGNO
          </span>

          <p className="detalhe-signo__resumo-texto">
            {signo.resumo}
          </p>
        </div>
      </div>

      <div className="detalhe-signo__capitulos">
        <div className="detalhe-signo__capitulos-cabecalho">
          <div>
            <span>TRATADO ASTROLÓGICO</span>
            <h3>Os Seis Capítulos</h3>
          </div>

          <span>VI CAPÍTULOS</span>
        </div>

        <div className="detalhe-signo__secoes">
          {SECOES.map((secao, indice) => (
            <SecaoAcordeao
              key={secao.id}
              numero={indice + 1}
              titulo={secao.titulo}
              icone={secao.icone}
              paragrafos={signo[secao.id]}
            />
          ))}
        </div>
      </div>

      <footer className="detalhe-signo__rodape">
        <Icon icon="mdi:star-four-points" />
        <span>
          ORACULVM · TRATADO DE {signo.nome.toUpperCase()}
        </span>
        <Icon icon="mdi:star-four-points" />
      </footer>
    </article>
  );
}

interface SecaoAcordeaoProps {
  numero: number;
  titulo: string;
  icone: string;
  paragrafos: string[];
}

function SecaoAcordeao({
  numero,
  titulo,
  icone,
  paragrafos,
}: SecaoAcordeaoProps) {
  const [aberto, setAberto] = useState(false);
  const ehLista = titulo === "Luz" || titulo === "Sombra";

  return (
    <section
      className={`detalhe-signo__secao-bloco ${
        aberto ? "expandido" : ""
      }`}
    >
      <button
        type="button"
        className="detalhe-signo__secao-cabecalho"
        onClick={() => setAberto((valor) => !valor)}
        aria-expanded={aberto}
      >
        <span className="detalhe-signo__secao-identificacao">
          <span className="detalhe-signo__secao-numero">
            {String(numero).padStart(2, "0")}
          </span>

          <span className="detalhe-signo__secao-icone">
            <Icon icon={icone} />
          </span>

          <span className="detalhe-signo__secao-titulo">
            {titulo}
          </span>
        </span>

        <span className="detalhe-signo__secao-acao">
          <span>{aberto ? "RECOLHER" : "EXPLORAR"}</span>
          <Icon
            icon="mdi:chevron-down"
            className="detalhe-signo__secao-seta"
          />
        </span>
      </button>

      {aberto && (
        <div className="detalhe-signo__secao-corpo">
          {ehLista ? (
            <ul
              className={`detalhe-signo__lista ${
                titulo === "Sombra"
                  ? "detalhe-signo__lista--negativa"
                  : "detalhe-signo__lista--positiva"
              }`}
            >
              {paragrafos.map((item, indice) => (
                <li key={indice}>{item}</li>
              ))}
            </ul>
          ) : (
            paragrafos.map((paragrafo, indice) => (
              <p
                key={indice}
                className="detalhe-signo__paragrafo"
              >
                {paragrafo}
              </p>
            ))
          )}
        </div>
      )}
    </section>
  );
}