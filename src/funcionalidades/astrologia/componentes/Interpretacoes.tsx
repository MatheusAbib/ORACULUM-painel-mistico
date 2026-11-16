import { useId, useState } from "react";
import { Icon } from "@iconify/react";
import { grauParaSigno } from "../servicos/astrologia";
import type { ResultadoMapaAstral } from "../servicos/astrologia";
import type { InterpretacaoPlanetaSigno } from "../dados/interpretacoes/sol";
import { SOL } from "../dados/interpretacoes/sol";
import { LUA } from "../dados/interpretacoes/lua";
import { ASCENDENTE } from "../dados/interpretacoes/ascendente";
import { MERCURIO } from "../dados/interpretacoes/mercurio";
import { VENUS } from "../dados/interpretacoes/venus";
import { MARTE } from "../dados/interpretacoes/marte";
import { IconePlaneta } from "./IconePlaneta";
import { IconeSigno } from "./IconeSigno";
import "./Interpretacoes.scss";

interface Props {
  resultado: ResultadoMapaAstral;
}

type SecaoId =
  | "essencia"
  | "talentos"
  | "desafios"
  | "amor"
  | "carreira"
  | "espiritualidade";

interface Secao {
  id: SecaoId;
  titulo: string;
  icone: string;
}

const SECOES: Secao[] = [
  {
    id: "essencia",
    titulo: "Essência",
    icone: "mdi:fire",
  },
  {
    id: "talentos",
    titulo: "Talentos",
    icone: "mdi:star-four-points-outline",
  },
  {
    id: "desafios",
    titulo: "Desafios",
    icone: "mdi:mountain-outline",
  },
  {
    id: "amor",
    titulo: "Amor",
    icone: "mdi:heart-outline",
  },
  {
    id: "carreira",
    titulo: "Carreira",
    icone: "mdi:briefcase-outline",
  },
  {
    id: "espiritualidade",
    titulo: "Espiritualidade",
    icone: "mdi:creation",
  },
];

const FONTES: Record<
  string,
  Record<string, InterpretacaoPlanetaSigno>
> = {
  Sol: SOL,
  Lua: LUA,
  Ascendente: ASCENDENTE,
  Mercúrio: MERCURIO,
  Vênus: VENUS,
  Marte: MARTE,
};

const NUMEROS_ROMANOS = [
  "I",
  "II",
  "III",
  "IV",
  "V",
  "VI",
];

export function Interpretacoes({ resultado }: Props) {
  const id = useId();

  const ascendenteSigno = grauParaSigno(
    resultado.ascendente
  );

  const todos = [
    {
      nome: "Ascendente",
      signo: ascendenteSigno,
    },
    ...resultado.planetas
      .filter((planeta) => FONTES[planeta.nome])
      .map((planeta) => ({
        nome: planeta.nome,
        signo: planeta.signo,
      })),
  ];

  const [planetaAtivo, setPlanetaAtivo] =
    useState<string>("Ascendente");

  const ativo =
    todos.find((item) => item.nome === planetaAtivo) ??
    todos[0];

  const fonte = FONTES[ativo.nome];
  const dados = fonte?.[ativo.signo];

  const indiceAtivo = todos.findIndex(
    (item) => item.nome === ativo.nome
  );

  return (
    <section className="interpretacoes">

      <div className="interpretacoes__layout">
        <aside className="interpretacoes__navegacao">
          <div className="interpretacoes__menu-cabecalho">
            <Icon icon="game-icons:quill-ink" />

            <div>
              <span>ÍNDICE DO COMPÊNDIO</span>
              <strong>Corpos e posições</strong>
            </div>
          </div>

          <div
            className="interpretacoes__menu"
            role="tablist"
            aria-label="Selecionar interpretação astrológica"
            aria-orientation="vertical"
          >
            {todos.map(({ nome, signo }, indice) => {
              const selecionado = nome === ativo.nome;

              return (
                <button
                  key={nome}
                  id={`${id}-aba-${indice}`}
                  type="button"
                  role="tab"
                  aria-selected={selecionado}
                  aria-controls={`${id}-painel`}
                  tabIndex={selecionado ? 0 : -1}
                  className={`interpretacoes__aba ${
                    selecionado ? "ativa" : ""
                  }`}
                  onClick={() => setPlanetaAtivo(nome)}
                >
                  <span className="interpretacoes__aba-numero">
                    {NUMEROS_ROMANOS[indice] ??
                      String(indice + 1)}
                  </span>

                  <span className="interpretacoes__aba-icone">
                    {nome === "Ascendente" ? (
                      <IconeSigno
                        signo={signo}
                        tamanho={25}
                      />
                    ) : (
                      <IconePlaneta
                        planeta={nome}
                        tamanho={25}
                      />
                    )}
                  </span>

                  <span className="interpretacoes__aba-textos">
                    <strong>{nome}</strong>
                    <small>{signo}</small>
                  </span>

                  <Icon
                    icon="mdi:chevron-right"
                    className="interpretacoes__aba-seta"
                  />
                </button>
              );
            })}
          </div>

          <div className="interpretacoes__menu-rodape">
            <Icon icon="mdi:star-four-points" />
            <span>
              {String(todos.length).padStart(2, "0")}{" "}
              INTERPRETAÇÕES
            </span>
          </div>
        </aside>

        <div className="interpretacoes__conteudo">
          {dados ? (
            <article
              id={`${id}-painel`}
              role="tabpanel"
              aria-labelledby={`${id}-aba-${indiceAtivo}`}
              className="interpretacoes__cartao"
              key={ativo.nome}
            >
              <div className="interpretacoes__pagina-topo">
                <span>
                  CAPÍTULO{" "}
                  {NUMEROS_ROMANOS[indiceAtivo] ??
                    indiceAtivo + 1}
                </span>

                <Icon icon="mdi:star-four-points" />

                <span>INTERPRETAÇÃO NATAL</span>
              </div>

              <header className="interpretacoes__cartao-cabecalho">
                <div
                  className="interpretacoes__cartao-icone"
                  aria-hidden="true"
                >
                  {ativo.nome === "Ascendente" ? (
                    <IconeSigno
                      signo={ativo.signo}
                      tamanho={55}
                    />
                  ) : (
                    <IconePlaneta
                      planeta={ativo.nome}
                      tamanho={55}
                    />
                  )}
                </div>

                <span className="interpretacoes__cartao-rotulo">
                  POSIÇÃO ASTROLÓGICA
                </span>

                <h3 className="interpretacoes__cartao-planeta">
                  {ativo.nome} em {ativo.signo}
                </h3>

                <div className="interpretacoes__cartao-signo-linha">
                  <span />

                  <IconeSigno
                    signo={ativo.signo}
                    tamanho={23}
                  />

                  <span className="interpretacoes__cartao-signo">
                    {ativo.signo}
                  </span>

                  <span />
                </div>
              </header>

              <div className="interpretacoes__cartao-destaque">
                <span className="interpretacoes__destaque-rotulo">
                  NOTAS DE INTERPRETAÇÃO
                </span>

                <h4 className="interpretacoes__cartao-subtitulo">
                  {dados.titulo}
                </h4>

                <p className="interpretacoes__cartao-descricao">
                  {dados.subtitulo}
                </p>
              </div>

              <div className="interpretacoes__secoes-cabecalho">
                <div>
                  <span>OS SEIS DOMÍNIOS</span>
                  <h4>Leitura detalhada</h4>
                </div>

                <span>VI SEÇÕES</span>
              </div>

              <div className="interpretacoes__secoes">
                {SECOES.map((secao, indice) => (
                  <SecaoAcordeao
                    key={`${ativo.nome}-${secao.id}`}
                    numero={
                      NUMEROS_ROMANOS[indice] ??
                      String(indice + 1)
                    }
                    titulo={secao.titulo}
                    icone={secao.icone}
                    paragrafos={dados[secao.id]}
                    padraoAberto={indice === 0}
                  />
                ))}
              </div>

              <footer className="interpretacoes__cartao-rodape">
                <Icon icon="mdi:star-four-points" />

                <span>
                  ORACULVM · COMPÊNDIO ASTROLÓGICO
                </span>

                <Icon icon="mdi:star-four-points" />
              </footer>
            </article>
          ) : (
            <div className="interpretacoes__indisponivel">
              <Icon icon="game-icons:open-book" />

              <h3>Interpretação indisponível</h3>

              <p>
                Não foi encontrada uma interpretação para
                esta posição astrológica.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

interface SecaoAcordeaoProps {
  numero: string;
  titulo: string;
  icone: string;
  paragrafos: string[];
  padraoAberto?: boolean;
}

function SecaoAcordeao({
  numero,
  titulo,
  icone,
  paragrafos,
  padraoAberto = false,
}: SecaoAcordeaoProps) {
  const [aberto, setAberto] = useState(padraoAberto);
  const id = useId();

  return (
    <section
      className={`interpretacoes__secao-bloco ${
        aberto ? "expandido" : ""
      }`}
    >
      <h5 className="interpretacoes__secao-titulo">
        <button
          type="button"
          className="interpretacoes__secao-cabecalho"
          aria-expanded={aberto}
          aria-controls={`${id}-conteudo`}
          onClick={() => setAberto((atual) => !atual)}
        >
          <span className="interpretacoes__secao-numero">
            {numero}
          </span>

          <span className="interpretacoes__secao-icone">
            <Icon icon={icone} />
          </span>

          <span className="interpretacoes__secao-nome">
            {titulo}
          </span>

          <Icon
            icon="mdi:chevron-down"
            className="interpretacoes__secao-seta"
          />
        </button>
      </h5>

      {aberto && (
        <div
          id={`${id}-conteudo`}
          className="interpretacoes__secao-corpo"
        >
          <div className="interpretacoes__secao-divisor">
            <span />
            <Icon icon="mdi:star-four-points" />
            <span />
          </div>

          {paragrafos.map((paragrafo, indice) => (
            <p
              key={indice}
              className="interpretacoes__paragrafo"
            >
              {paragrafo}
            </p>
          ))}
        </div>
      )}
    </section>
  );
}