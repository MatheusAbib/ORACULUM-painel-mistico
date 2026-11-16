
import { Icon } from "@iconify/react";
import { usePerfil } from "../../../nucleo/contextos/PerfilContexto";
import { BotaoPerfil } from "../../../compartilhado/componentes/BotaoPerfil";
import { calcularFaseLua } from "../../calendario-lunar/servicos/lunar";
import { IconeFaseLua } from "../../calendario-lunar/componentes/IconeFaseLua";
import { calcularCiclos } from "../../numerologia/servicos/ciclos";
import { DIA_PESSOAL } from "../../numerologia/dados/interpretacoes/ciclos";
import type { AbaId } from "../../../compartilhado/componentes/AbasInline";
import "./PainelInicio.scss";

interface Props {
  onMudar: (id: AbaId) => void;
}

interface Oraculo {
  id: AbaId;
  numero: string;
  nome: string;
  categoria: string;
  descricao: string;
  acao: string;
  classe: string;
}

const ORACULOS: Oraculo[] = [
  {
    id: "tarot",
    numero: "01",
    nome: "Tarô",
    categoria: "Cartomancia",
    descricao: "22 arcanos maiores e três modalidades de tiragem.",
    acao: "Consultar as cartas",
    classe: "tarot",
  },
  {
    id: "astrologia",
    numero: "02",
    nome: "Mapa Astral",
    categoria: "Astrologia",
    descricao: "Posições planetárias, casas astrológicas, aspectos e sinastria.",
    acao: "Calcular meu mapa",
    classe: "astrologia",
  },
  {
    id: "numerologia",
    numero: "03",
    nome: "Numerologia",
    categoria: "Números pessoais",
    descricao: "Caminho de Vida, Expressão, Alma e ciclos numerológicos.",
    acao: "Consultar meus números",
    classe: "numerologia",
  },
  {
    id: "matriz-destino",
    numero: "04",
    nome: "Matriz do Destino",
    categoria: "22 arcanos",
    descricao: "Diagrama de 13 pontos calculado pela data de nascimento.",
    acao: "Calcular a matriz",
    classe: "matriz",
  },
  {
    id: "signos",
    numero: "05",
    nome: "Os Signos",
    categoria: "Zodíaco",
    descricao: "Os 12 signos, seus elementos, características e relações.",
    acao: "Conhecer os signos",
    classe: "signos",
  },
  {
    id: "calendario-lunar",
    numero: "06",
    nome: "Calendário Lunar",
    categoria: "Astronomia lunar",
    descricao: "As oito fases da Lua e o calendário de cada mês.",
    acao: "Consultar o calendário",
    classe: "lunar",
  },
  {
    id: "biblioteca",
    numero: "07",
    nome: "Biblioteca Oculta",
    categoria: "Catálogo de referências",
    descricao: "Cristais, ervas, incensos, velas, chakras e elementos.",
    acao: "Abrir a biblioteca",
    classe: "biblioteca",
  },
];

function MolduraCelestial() {
  return (
    <svg
      className="painel-inicio__gravura-celestial"
      viewBox="0 0 560 620"
      fill="none"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="oraculum-pontos"
          width="22"
          height="22"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="11" cy="11" r="0.8" fill="currentColor" />
        </pattern>
      </defs>
      <path d="M280 18C137 18 36 116 36 276V582H524V276C524 116 423 18 280 18Z" />
      <path d="M280 34C147 34 52 129 52 279V566H508V279C508 129 413 34 280 34Z" />
      <path d="M280 52C159 52 70 141 70 281V546H490V281C490 141 401 52 280 52Z" />
      <circle cx="280" cy="284" r="190" />
      <circle cx="280" cy="284" r="174" />
      <circle cx="280" cy="284" r="150" strokeDasharray="2 9" />
      <circle cx="280" cy="284" r="122" />
      <circle cx="280" cy="284" r="105" />
      <path d="M280 94V474M90 284H470M145 149L415 419M415 149L145 419" />
      <path d="M280 120L444 284L280 448L116 284Z" />
      <path d="M280 151L395 350H165Z" />
      <path d="M280 417L165 218H395Z" />
      {Array.from({ length: 12 }, (_, index) => {
        const angle = (index * Math.PI) / 6 - Math.PI / 2;
        const x = 280 + Math.cos(angle) * 136;
        const y = 284 + Math.sin(angle) * 136;
        return <circle key={index} cx={x} cy={y} r="3" />;
      })}
      <path d="M92 510H468M108 524H452M126 536H434" />
      <path d="M280 12V42M265 27H295M280 474V560M264 492H296" />
      <path d="M36 276H12M524 276H548M20 260V292M540 260V292" />
      <rect x="88" y="66" width="384" height="488" fill="url(#oraculum-pontos)" opacity="0.18" />
    </svg>
  );
}

function GravuraPrincipal() {
  return (
    <div className="painel-inicio__gravura" aria-hidden="true">
      <MolduraCelestial />
      <div className="painel-inicio__gravura-sol">
        <Icon icon="game-icons:sun" />
      </div>
      <div className="painel-inicio__gravura-lua">
        <Icon icon="game-icons:moon" />
      </div>
      <div className="painel-inicio__gravura-centro">
        <Icon icon="game-icons:all-seeing-eye" />
      </div>
      <span className="painel-inicio__gravura-astro painel-inicio__gravura-astro--a">
        <Icon icon="mdi:zodiac-aries" />
      </span>
      <span className="painel-inicio__gravura-astro painel-inicio__gravura-astro--b">
        <Icon icon="mdi:zodiac-scorpio" />
      </span>
      <span className="painel-inicio__gravura-astro painel-inicio__gravura-astro--c">
        <Icon icon="mdi:zodiac-leo" />
      </span>
      <span className="painel-inicio__gravura-astro painel-inicio__gravura-astro--d">
        <Icon icon="mdi:zodiac-pisces" />
      </span>
      <div className="painel-inicio__gravura-legenda">
        <span>FIG. I</span>
        <span>ASTRONOMIA · SIMBOLOGIA · CARTOMANCIA</span>
      </div>
    </div>
  );
}

function IlustracaoOraculo({ tipo }: { tipo: string }) {
  switch (tipo) {
    case "tarot":
      return (
        <div className="painel-inicio__ilustracao painel-inicio__ilustracao--tarot">
          <div className="painel-inicio__carta painel-inicio__carta--esquerda">
            <Icon icon="game-icons:moon" />
          </div>
          <div className="painel-inicio__carta painel-inicio__carta--direita">
            <Icon icon="game-icons:sun" />
          </div>
          <div className="painel-inicio__carta painel-inicio__carta--centro">
            <span>XVII</span>
            <Icon icon="game-icons:star-formation" />
            <small>AS ESTRELAS</small>
          </div>
        </div>
      );

    case "astrologia":
      return (
        <div className="painel-inicio__ilustracao painel-inicio__ilustracao--astrologia">
          <div className="painel-inicio__zodiaco">
            <div className="painel-inicio__zodiaco-anel" />
            {[
              "aries",
              "taurus",
              "gemini",
              "cancer",
              "leo",
              "virgo",
              "libra",
              "scorpio",
              "sagittarius",
              "capricorn",
              "aquarius",
              "pisces",
            ].map((signo, index) => (
              <span
                key={signo}
                style={{
                  transform: `rotate(${index * 30}deg) translateY(-112px) rotate(${-index * 30}deg)`,
                }}
              >
                <Icon icon={`mdi:zodiac-${signo}`} />
              </span>
            ))}
            <Icon
              icon="game-icons:sun"
              className="painel-inicio__zodiaco-sol"
            />
          </div>
        </div>
      );

    case "numerologia":
      return (
        <div className="painel-inicio__ilustracao painel-inicio__ilustracao--numerologia">
          <div className="painel-inicio__numero-gravura">
            <span className="painel-inicio__numero-pequeno">I · II · III</span>
            <strong>7</strong>
            <Icon icon="game-icons:seven-pointed-star" />
          </div>
        </div>
      );

    case "matriz":
      return (
        <div className="painel-inicio__ilustracao painel-inicio__ilustracao--matriz">
          <svg viewBox="0 0 280 280" fill="none" aria-hidden="true">
            <circle cx="140" cy="140" r="117" />
            <path d="M140 14L266 140L140 266L14 140Z" />
            <path d="M140 38L242 242H38Z" />
            <path d="M140 242L38 38H242Z" />
            <path d="M140 14V266M14 140H266" />
            {[
              [140, 14, "1"],
              [266, 140, "7"],
              [140, 266, "9"],
              [14, 140, "4"],
              [140, 140, "22"],
              [140, 73, "3"],
              [207, 140, "6"],
              [140, 207, "8"],
              [73, 140, "5"],
            ].map(([cx, cy, numero], index) => (
              <g key={index}>
                <circle cx={cx} cy={cy} r={numero === "22" ? 24 : 17} />
                <text x={cx} y={Number(cy) + 5} textAnchor="middle">
                  {numero}
                </text>
              </g>
            ))}
          </svg>
        </div>
      );

    case "signos":
      return (
        <div className="painel-inicio__ilustracao painel-inicio__ilustracao--signos">
          <div className="painel-inicio__signos-gravura">
            <Icon icon="game-icons:lion" />
            <span className="painel-inicio__signos-sol">
              <Icon icon="game-icons:sun" />
            </span>
            <span className="painel-inicio__signos-inscricao">♌ · LEO</span>
          </div>
        </div>
      );

    case "lunar":
      return (
        <div className="painel-inicio__ilustracao painel-inicio__ilustracao--lunar">
          <div className="painel-inicio__lunar-gravura">
            <Icon icon="game-icons:moon" />
            <span className="painel-inicio__lunar-estrelas">
              <Icon icon="game-icons:star-formation" />
            </span>
          </div>
          <div className="painel-inicio__lunar-fases">
            {[
              "mdi:moon-new",
              "mdi:moon-waxing-crescent",
              "mdi:moon-first-quarter",
              "mdi:moon-waxing-gibbous",
              "mdi:moon-full",
            ].map((icone) => (
              <Icon key={icone} icon={icone} />
            ))}
          </div>
        </div>
      );

    default:
      return (
        <div className="painel-inicio__ilustracao painel-inicio__ilustracao--biblioteca">
          <div className="painel-inicio__livro">
            <Icon icon="game-icons:open-book" />
            <span className="painel-inicio__livro-planta">
              <Icon icon="game-icons:herbs-bundle" />
            </span>
          </div>
          <Icon
            icon="game-icons:crystal-ball"
            className="painel-inicio__livro-cristal"
          />
        </div>
      );
  }
}

export function PainelInicio({ onMudar }: Props) {
  const { perfil } = usePerfil();
  const hoje = new Date();
  const luaHoje = calcularFaseLua(hoje);
  const ciclos = perfil?.dataNascimento
    ? calcularCiclos(perfil.dataNascimento, hoje)
    : null;
  const numeroDia = ciclos ? DIA_PESSOAL[ciclos.diaPessoal] : null;
  const primeiroNome = perfil?.nome?.trim().split(/\s+/)[0];

  const dataFormatada = new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(hoje);

  function irParaOraculos() {
    document.getElementById("oraculvm-oraculos")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }

  return (
    <div className="painel-inicio">
      <section className="painel-inicio__portal">
        <div className="painel-inicio__portal-textura" aria-hidden="true" />

        <div className="painel-inicio__portal-topo">
          <div className="painel-inicio__marca">
            <span className="painel-inicio__marca-simbolo">
              <Icon icon="game-icons:all-seeing-eye" />
            </span>
            <div className="painel-inicio__marca-texto">
              <strong>ORACULVM</strong>
              <span>ARQUIVO DE ARTES ESOTÉRICAS</span>
            </div>
          </div>

          <div className="painel-inicio__portal-perfil">
            <BotaoPerfil />
          </div>
        </div>

        <div className="painel-inicio__portal-corpo">
          <div className="painel-inicio__portal-texto">
            <div className="painel-inicio__portal-edicao">
              <span>COMPÊNDIO DIGITAL</span>
              <span>VOL. I — VII</span>
            </div>

            <span className="painel-inicio__portal-asterisco" aria-hidden="true">
              <Icon icon="game-icons:star-formation" />
            </span>

            <p className="painel-inicio__portal-sobretitulo">
              CARTOMANCIA · ASTROLOGIA · NUMEROLOGIA
            </p>

            <h1 className="painel-inicio__titulo">
              Artes
              <span>esotéricas</span>
              <small>e seus símbolos</small>
            </h1>

            <div className="painel-inicio__portal-descricao">
              <p>
                Consulte tiragens de tarô, calcule seu mapa astral,
                explore números pessoais e acompanhe as fases da Lua.
              </p>
              <p>
                Sete ferramentas reunidas em um catálogo de estudos
                e consultas.
              </p>
            </div>

            <button
              type="button"
              className="painel-inicio__portal-botao"
              onClick={irParaOraculos}
            >
              <span>VER OS SETE ORÁCULOS</span>
              <Icon icon="mdi:arrow-down-right" />
            </button>

            <div className="painel-inicio__portal-nota">
              <Icon icon="game-icons:quill-ink" />
              <span>CONSULTAS, CÁLCULOS E REFERÊNCIAS</span>
            </div>
          </div>

          <div className="painel-inicio__portal-arte">
            <GravuraPrincipal />
          </div>
        </div>

        <div className="painel-inicio__portal-rodape">
          <span>EST. MMXXVI</span>
          <span>
            <Icon icon="mdi:star-four-points" />
            SETE ÁREAS DE CONSULTA
            <Icon icon="mdi:star-four-points" />
          </span>
          <span>ORACULVM · I</span>
        </div>
      </section>

      <section className="painel-inicio__almanaque">
        <div className="painel-inicio__almanaque-decoracao" aria-hidden="true">
          <Icon icon="game-icons:sun" />
        </div>

        <div className="painel-inicio__almanaque-cabecalho">
          <div>
            <span className="painel-inicio__rotulo">
              <Icon icon="game-icons:quill-ink" />
              EDIÇÃO DIÁRIA
            </span>
            <h2>Almanaque celeste</h2>
            <p>Fase da Lua e ciclo numerológico pessoal</p>
          </div>
          <div className="painel-inicio__almanaque-data">
            <span>REGISTRO DE HOJE</span>
            <strong>{dataFormatada}</strong>
          </div>
        </div>

        <div className="painel-inicio__almanaque-corpo">
          <button
            type="button"
            className="painel-inicio__almanaque-lua"
            onClick={() => onMudar("calendario-lunar")}
          >
            <span className="painel-inicio__almanaque-indice">
              I — OBSERVAÇÃO LUNAR
            </span>
            <div className="painel-inicio__almanaque-lua-arte">
              <span className="painel-inicio__almanaque-lua-raios" />
              <IconeFaseLua fase={luaHoje.fase} tamanho={110} />
              <span className="painel-inicio__almanaque-lua-estrelas">
                <Icon icon="game-icons:star-formation" />
              </span>
            </div>
            <div className="painel-inicio__almanaque-lua-texto">
              <span>FASE ATUAL</span>
              <h3>{luaHoje.nomeFase}</h3>
              <p>{luaHoje.descricao}</p>
              <div className="painel-inicio__almanaque-dados">
                <span>{luaHoje.iluminacao}% iluminada</span>
                <span>{luaHoje.idadeDias} dias</span>
              </div>
              <strong>
                Abrir calendário lunar
                <Icon icon="mdi:arrow-top-right" />
              </strong>
            </div>
          </button>

          <div className="painel-inicio__almanaque-separador" aria-hidden="true">
            <Icon icon="game-icons:star-formation" />
          </div>

          <button
            type="button"
            className="painel-inicio__almanaque-numero"
            onClick={() => onMudar("numerologia")}
          >
            <span className="painel-inicio__almanaque-indice">
              II — CICLO NUMEROLÓGICO
            </span>
            <div className="painel-inicio__almanaque-numero-arte">
              <span>{ciclos?.diaPessoal ?? "?"}</span>
              <Icon icon="game-icons:seven-pointed-star" />
            </div>
            <div className="painel-inicio__almanaque-numero-texto">
              <span>
                {primeiroNome
                  ? `DIA PESSOAL DE ${primeiroNome.toUpperCase()}`
                  : "SEU DIA PESSOAL"}
              </span>
              <h3>{numeroDia?.titulo ?? "Número pessoal"}</h3>
              <p>
                {numeroDia?.significado ??
                  "Preencha sua data de nascimento no perfil para calcular seu dia pessoal."}
              </p>
              <strong>
                Abrir numerologia
                <Icon icon="mdi:arrow-top-right" />
              </strong>
            </div>
          </button>
        </div>

        <div className="painel-inicio__almanaque-rodape">
          <span>ORACULVM · ALMANAQUE</span>
          <Icon icon="game-icons:star-formation" />
          <span>ATUALIZADO CONFORME A DATA</span>
        </div>
      </section>

      <section
        className="painel-inicio__oraculos"
        id="oraculvm-oraculos"
      >
        <div className="painel-inicio__oraculos-cabecalho">
          <div className="painel-inicio__oraculos-ilustracao" aria-hidden="true">
            <Icon icon="game-icons:all-seeing-eye" />
          </div>
          <div>
            <span className="painel-inicio__rotulo">
              <Icon icon="mdi:star-four-points" />
              CATÁLOGO · VOL. I
            </span>
            <h2>Os sete oráculos</h2>
            <p>
              Escolha uma ferramenta para iniciar uma consulta ou
              acessar seu material de referência.
            </p>
          </div>
          <div className="painel-inicio__oraculos-selo" aria-hidden="true">
            <span>VII</span>
            <small>ÁREAS</small>
          </div>
        </div>

        <div className="painel-inicio__colecao">
          {ORACULOS.map((oraculo) => (
            <button
              key={oraculo.id}
              type="button"
              className={`painel-inicio__artefato painel-inicio__artefato--${oraculo.classe}`}
              onClick={() => onMudar(oraculo.id)}
            >
              <span className="painel-inicio__artefato-moldura" aria-hidden="true" />

              <div className="painel-inicio__artefato-topo">
                <span>ORACULVM</span>
                <span>FIG. {oraculo.numero}</span>
              </div>

              <IlustracaoOraculo tipo={oraculo.classe} />

              <div className="painel-inicio__artefato-conteudo">
                <span className="painel-inicio__artefato-categoria">
                  {oraculo.categoria}
                </span>
                <h3>{oraculo.nome}</h3>
                <p>{oraculo.descricao}</p>
                <span className="painel-inicio__artefato-acao">
                  {oraculo.acao}
                  <Icon icon="mdi:arrow-top-right" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
