
import { useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { BotaoPerfil } from "./BotaoPerfil";
import "./AbasInline.scss";

export type AbaId =
  | "inicio"
  | "tarot"
  | "astrologia"
  | "numerologia"
  | "matriz-destino"
  | "signos"
  | "calendario-lunar"
  | "biblioteca";

interface Aba {
  id: AbaId;
  rotulo: string;
  icone: string;
}

const ABAS: Aba[] = [
  {
    id: "tarot",
    rotulo: "Tarô",
    icone: "game-icons:card-pick",
  },
  {
    id: "astrologia",
    rotulo: "Astrologia",
    icone: "game-icons:astrolabe",
  },
  {
    id: "numerologia",
    rotulo: "Numerologia",
    icone: "game-icons:abacus",
  },
  {
    id: "matriz-destino",
    rotulo: "Matriz",
    icone: "game-icons:pentacle",
  },
{
  id: "signos",
  rotulo: "Signos",
  icone: "game-icons:aries",
},
  {
    id: "calendario-lunar",
    rotulo: "Lua",
    icone: "game-icons:moon",
  },
  {
    id: "biblioteca",
    rotulo: "Biblioteca",
    icone: "game-icons:spell-book",
  },
];

interface Props {
  abaAtiva: AbaId;
  onMudar: (id: AbaId) => void;
}

export function AbasInline({ abaAtiva, onMudar }: Props) {
  const barraRef = useRef<HTMLDivElement>(null);
  const botoesRef = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const barra = barraRef.current;
    const botao = botoesRef.current[abaAtiva];

    if (!barra || !botao) return;

    const centroBotao = botao.offsetLeft + botao.offsetWidth / 2;
    const destino = centroBotao - barra.clientWidth / 2;

    barra.scrollTo({
      left: destino,
      behavior: "smooth",
    });
  }, [abaAtiva]);

  return (
    <nav className="abas-inline" aria-label="Navegação entre os oráculos">
      <div className="abas-inline__moldura">
        <div className="abas-inline__cabecalho">
          <button
            type="button"
            className="abas-inline__marca"
            onClick={() => onMudar("inicio")}
            aria-label="Voltar ao início"
          >
            <span>ORACULVM</span>
          </button>

          <div className="abas-inline__cabecalho-direita">
            <span className="abas-inline__inscricao">
              ARQUIVO DE ARTES ESOTÉRICAS
            </span>
            <BotaoPerfil />
          </div>
        </div>

        <div className="abas-inline__barra" ref={barraRef}>
          <ul className="abas-inline__lista">
            {ABAS.map((aba) => {
              const ativa = abaAtiva === aba.id;

              return (
                <li className="abas-inline__entrada" key={aba.id}>
                  <button
                    ref={(elemento) => {
                      botoesRef.current[aba.id] = elemento;
                    }}
                    type="button"
                    className={`abas-inline__item${ativa ? " ativa" : ""}`}
                    onClick={() => onMudar(aba.id)}
                    aria-current={ativa ? "page" : undefined}
                    title={aba.rotulo}
                  >

                    <span className="abas-inline__icone" aria-hidden="true">
                      <Icon icon={aba.icone} />
                    </span>

                    <span className="abas-inline__rotulo">
                      {aba.rotulo}
                    </span>

                    <span
                      className="abas-inline__marcador"
                      aria-hidden="true"
                    >
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
