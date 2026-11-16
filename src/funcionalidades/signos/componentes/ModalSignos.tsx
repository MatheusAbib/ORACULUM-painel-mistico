import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@iconify/react";
import "./ModalSignos.scss";

interface Props {
  aberto: boolean;
  aoFechar: () => void;
}

const ELEMENTOS = [
  {
    nome: "Fogo",
    signos: "Áries, Leão, Sagitário",
    descricao:
      "Energia, ação, entusiasmo, iniciativa. Signos de fogo são movidos por impulso e paixão — precisam de movimento pra viver.",
    icone: "mdi:fire",
  },
  {
    nome: "Terra",
    signos: "Touro, Virgem, Capricórnio",
    descricao:
      "Solidez, constância, prática. Signos de terra são movidos por concretude — precisam construir, sentir, materializar.",
    icone: "mdi:earth",
  },
  {
    nome: "Ar",
    signos: "Gêmeos, Libra, Aquário",
    descricao:
      "Pensamento, comunicação, relação. Signos de ar são movidos por ideias — precisam entender, conectar, trocar.",
    icone: "mdi:weather-windy",
  },
  {
    nome: "Água",
    signos: "Câncer, Escorpião, Peixes",
    descricao:
      "Emoção, intuição, profundidade. Signos de água são movidos por sentimento — precisam sentir, intuir, se dissolver.",
    icone: "mdi:water-outline",
  },
];

const MODALIDADES = [
  {
    nome: "Cardinal",
    signos: "Áries, Câncer, Libra, Capricórnio",
    descricao:
      "Inicia. São os que começam coisas, abrem caminhos, tomam a frente. Movimento de arranque.",
    icone: "mdi:arrow-top-right",
  },
  {
    nome: "Fixo",
    signos: "Touro, Leão, Escorpião, Aquário",
    descricao:
      "Sustenta. São os que mantêm o rumo, resistem, aprofundam. Movimento de permanência.",
    icone: "mdi:anchor",
  },
  {
    nome: "Mutável",
    signos: "Gêmeos, Virgem, Sagitário, Peixes",
    descricao:
      "Adapta. São os que se ajustam, mudam, se transformam. Movimento de transição.",
    icone: "mdi:swap-horizontal",
  },
];

export function ModalSignos({ aberto, aoFechar }: Props) {
  const tituloId = useId();
  const caixaRef = useRef<HTMLDivElement>(null);
  const fecharRef = useRef<HTMLButtonElement>(null);
  const aoFecharRef = useRef(aoFechar);

  useEffect(() => {
    aoFecharRef.current = aoFechar;
  }, [aoFechar]);

  useEffect(() => {
    if (!aberto) return;

    const elementoAnterior = document.activeElement as HTMLElement | null;
    const overflowAnterior = document.body.style.overflow;

    document.body.classList.add("modal-aberto");
    document.body.style.overflow = "hidden";

    fecharRef.current?.focus();

    const aoPressionarTecla = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") {
        evento.preventDefault();
        aoFecharRef.current();
        return;
      }

      if (evento.key !== "Tab" || !caixaRef.current) return;

      const elementos = Array.from(
        caixaRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        )
      );

      if (elementos.length === 0) return;

      const primeiro = elementos[0];
      const ultimo = elementos[elementos.length - 1];

      if (evento.shiftKey && document.activeElement === primeiro) {
        evento.preventDefault();
        ultimo.focus();
      } else if (
        !evento.shiftKey &&
        document.activeElement === ultimo
      ) {
        evento.preventDefault();
        primeiro.focus();
      }
    };

    document.addEventListener("keydown", aoPressionarTecla);

    return () => {
      document.removeEventListener("keydown", aoPressionarTecla);
      document.body.classList.remove("modal-aberto");
      document.body.style.overflow = overflowAnterior;
      elementoAnterior?.focus();
    };
  }, [aberto]);

  if (!aberto) return null;

  return createPortal(
    <div
      className="modal-signos"
      onMouseDown={(evento) => {
        if (evento.target === evento.currentTarget) {
          aoFechar();
        }
      }}
    >
      <div
        ref={caixaRef}
        className="modal-signos__caixa"
        role="dialog"
        aria-modal="true"
        aria-labelledby={tituloId}
      >
        <button
          ref={fecharRef}
          type="button"
          className="modal-signos__fechar"
          onClick={aoFechar}
          aria-label="Fechar modal"
        >
          <Icon icon="mdi:close" />
        </button>

        <header className="modal-signos__cabecalho">
          <div className="modal-signos__emblema" aria-hidden="true">
            <Icon icon="mdi:zodiac-aries" />
            <span>XII</span>
          </div>

          <span className="modal-signos__rotulo">
            MANUAL DE INTERPRETAÇÃO
          </span>

          <h2 id={tituloId} className="modal-signos__titulo">
            Os Doze Signos
          </h2>

          <div className="modal-signos__divisor" aria-hidden="true">
            <span />
            <Icon icon="mdi:star-four-points" />
            <span />
          </div>

          <p className="modal-signos__introducao">
            Um guia para compreender a organização do zodíaco,
            seus elementos, modalidades e influências astrológicas.
          </p>
        </header>

        <div className="modal-signos__corpo">
          <section className="modal-signos__secao">
            <div className="modal-signos__secao-cabecalho">
              <span>CAPÍTULO I</span>
              <h3>O que são os signos?</h3>
            </div>

            <p className="modal-signos__texto">
              Os signos do zodíaco são doze divisões do céu,
              cada uma com cerca de 30 graus. Quando alguém diz
              "sou de Áries" ou "sou de Peixes", geralmente está
              se referindo ao <strong>signo solar</strong> — a
              posição que o Sol ocupava no céu no momento do
              nascimento.
            </p>

            <p className="modal-signos__texto">
              Mas há outras camadas: a Lua, o Ascendente e todos
              os planetas também têm signos. Por isso, o signo
              solar representa apenas uma parte da interpretação
              astrológica.
            </p>
          </section>

          <section className="modal-signos__secao">
            <div className="modal-signos__secao-cabecalho">
              <span>CAPÍTULO II</span>
              <h3>A composição de cada signo</h3>
            </div>

            <p className="modal-signos__texto">
              Cada signo combina um <strong>elemento</strong>,
              que mostra sua natureza básica, uma{" "}
              <strong>modalidade</strong>, que representa sua
              maneira de agir, e um{" "}
              <strong>planeta regente</strong>, associado às
              suas características.
            </p>

            <div className="modal-signos__conceitos">
              <div className="modal-signos__conceito">
                <span className="modal-signos__conceito-numero">
                  I
                </span>
                <div>
                  <h4>Elemento</h4>
                  <p>
                    Representa a natureza e as tendências
                    fundamentais do signo.
                  </p>
                </div>
              </div>

              <div className="modal-signos__conceito">
                <span className="modal-signos__conceito-numero">
                  II
                </span>
                <div>
                  <h4>Modalidade</h4>
                  <p>
                    Indica como o signo inicia, sustenta ou
                    transforma suas ações.
                  </p>
                </div>
              </div>

              <div className="modal-signos__conceito">
                <span className="modal-signos__conceito-numero">
                  III
                </span>
                <div>
                  <h4>Regência</h4>
                  <p>
                    Associa o signo a um planeta e aos
                    significados atribuídos a ele.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="modal-signos__secao">
            <div className="modal-signos__secao-cabecalho">
              <span>CAPÍTULO III</span>
              <h3>Os quatro elementos</h3>
            </div>

            <p className="modal-signos__texto">
              Na tradição astrológica, os doze signos são
              distribuídos entre quatro elementos. Cada
              elemento reúne três signos que compartilham
              determinadas características.
            </p>

            <div className="modal-signos__lista modal-signos__lista--elementos">
              {ELEMENTOS.map((elemento, indice) => (
                <article
                  key={elemento.nome}
                  className="modal-signos__item"
                >
                  <div className="modal-signos__item-cabecalho">
                    <span className="modal-signos__item-icone">
                      <Icon icon={elemento.icone} />
                    </span>

                    <div>
                      <span className="modal-signos__item-indice">
                        ELEMENTO {String(indice + 1).padStart(2, "0")}
                      </span>
                      <h4 className="modal-signos__item-titulo">
                        {elemento.nome}
                      </h4>
                    </div>
                  </div>

                  <span className="modal-signos__item-signos">
                    {elemento.signos}
                  </span>

                  <p className="modal-signos__item-descricao">
                    {elemento.descricao}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="modal-signos__secao">
            <div className="modal-signos__secao-cabecalho">
              <span>CAPÍTULO IV</span>
              <h3>As três modalidades</h3>
            </div>

            <p className="modal-signos__texto">
              As modalidades descrevem a forma como cada
              signo expressa sua energia: iniciando,
              mantendo ou adaptando-se às circunstâncias.
            </p>

            <div className="modal-signos__lista modal-signos__lista--modalidades">
              {MODALIDADES.map((modalidade, indice) => (
                <article
                  key={modalidade.nome}
                  className="modal-signos__item"
                >
                  <div className="modal-signos__item-cabecalho">
                    <span className="modal-signos__item-icone">
                      <Icon icon={modalidade.icone} />
                    </span>

                    <div>
                      <span className="modal-signos__item-indice">
                        MODALIDADE {String(indice + 1).padStart(2, "0")}
                      </span>
                      <h4 className="modal-signos__item-titulo">
                        {modalidade.nome}
                      </h4>
                    </div>
                  </div>

                  <span className="modal-signos__item-signos">
                    {modalidade.signos}
                  </span>

                  <p className="modal-signos__item-descricao">
                    {modalidade.descricao}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>

        <footer className="modal-signos__rodape">
          <Icon icon="mdi:star-four-points" />
          <span>ORACULVM · TRATADO DO ZODÍACO</span>
          <Icon icon="mdi:star-four-points" />
        </footer>
      </div>
    </div>,
    document.body
  );
}