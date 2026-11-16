import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@iconify/react";
import "./ModalComoFunciona.scss";

interface Props {
  aberto: boolean;
  aoFechar: () => void;
}

const TABELA = [
  ["A", "B", "C", "D", "E", "F", "G", "H", "I"],
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  ["J", "K", "L", "M", "N", "O", "P", "Q", "R"],
  [1, 2, 3, 4, 5, 6, 7, 8, 9],
  ["S", "T", "U", "V", "W", "X", "Y", "Z", ""],
  [1, 2, 3, 4, 5, 6, 7, 8, ""],
];

const NUMEROS = [
  { numero: 1, vibracao: "Pioneirismo", significado: "Liderança, iniciativa, individualidade" },
  { numero: 2, vibracao: "Cooperação", significado: "Sensibilidade, parceria, diplomacia" },
  { numero: 3, vibracao: "Criatividade", significado: "Expressão, comunicação, alegria" },
  { numero: 4, vibracao: "Estrutura", significado: "Disciplina, trabalho, solidez" },
  { numero: 5, vibracao: "Liberdade", significado: "Mudança, aventura, versatilidade" },
  { numero: 6, vibracao: "Amor", significado: "Família, cuidado, responsabilidade" },
  { numero: 7, vibracao: "Sabedoria", significado: "Espiritualidade, introspecção, análise" },
  { numero: 8, vibracao: "Poder", significado: "Autoridade, realização, material" },
  { numero: 9, vibracao: "Compaixão", significado: "Humanitarismo, fim de ciclos, serviço" },
  { numero: 11, vibracao: "Mestre intuitivo", significado: "Intuição, inspiração, revelação" },
  { numero: 22, vibracao: "Mestre construtor", significado: "Grandes obras, sonho + execução" },
  { numero: 33, vibracao: "Mestre curador", significado: "Amor universal, cura, compaixão" },
];

const AREAS = [
  {
    titulo: "Caminho de Vida",
    descricao:
      "Vem da sua data de nascimento. Mostra sua missão de vida — o caminho que você veio trilhar e o propósito que orienta sua jornada.",
    exemplo:
      "Caminho de Vida 8 = sua missão é construir, liderar, realizar coisas concretas.",
  },
  {
    titulo: "Expressão",
    descricao:
      "Vem do seu nome completo. Mostra como você se expressa e age no mundo — seu jeito natural de se comunicar, de agir, de existir.",
    exemplo:
      "Expressão 8 = você se comunica com autoridade e lidera pelo exemplo.",
  },
  {
    titulo: "Alma",
    descricao:
      "Vem das vogais do nome. Mostra o que seu coração realmente deseja — a motivação profunda por trás das suas escolhas.",
    exemplo:
      "Alma 8 = seu desejo mais profundo é o poder, a realização, deixar marca.",
  },
  {
    titulo: "Personalidade",
    descricao:
      "Vem das consoantes do nome. Mostra como as pessoas te veem por fora — a imagem que você projeta sem perceber.",
    exemplo:
      "Personalidade 8 = as pessoas te veem como alguém forte, autoritário, poderoso.",
  },
  {
    titulo: "Aniversário",
    descricao:
      "Vem só do dia do nascimento. Mostra o talento especial que você trouxe ao nascer — um dom que te acompanha desde cedo.",
    exemplo:
      "Aniversário 8 = seu dom é materializar poder, transformar intenção em conquista.",
  },
  {
    titulo: "Maturidade",
    descricao:
      "Vem da soma do Caminho de Vida com a Expressão. Mostra quem você tende a se tornar na segunda metade da vida, geralmente após os 35 anos.",
    exemplo:
      "Maturidade 8 = você tende a se tornar mais poderoso, mais estratégico, mais realizado.",
  },
  {
    titulo: "Kármico",
    descricao:
      "Vem dos números que faltam no seu nome. Mostra uma lição que sua alma escolheu aprender nesta vida — uma área que precisa ser desenvolvida.",
    exemplo:
      "Kármico 1 = você veio aprender autonomia, a confiar em si mesmo sem apoio.",
  },
];

export function ModalComoFunciona({ aberto, aoFechar }: Props) {
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
        aoFecharRef.current();
      }

      if (evento.key === "Tab" && caixaRef.current) {
        const elementos = Array.from(
          caixaRef.current.querySelectorAll<HTMLElement>(
            'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
          )
        );

        if (elementos.length === 0) {
          evento.preventDefault();
          return;
        }

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
      }
    };

    document.addEventListener("keydown", aoPressionarTecla);

    return () => {
      document.body.classList.remove("modal-aberto");
      document.body.style.overflow = overflowAnterior;
      document.removeEventListener("keydown", aoPressionarTecla);
      elementoAnterior?.focus();
    };
  }, [aberto]);

  if (!aberto) return null;

  return createPortal(
    <div
      className="modal-como-funciona"
      onMouseDown={(evento) => {
        if (evento.target === evento.currentTarget) {
          aoFechar();
        }
      }}
    >
      <div
        ref={caixaRef}
        className="modal-como-funciona__caixa"
        role="dialog"
        aria-modal="true"
        aria-labelledby={tituloId}
      >
        <button
          ref={fecharRef}
          type="button"
          className="modal-como-funciona__fechar"
          onClick={aoFechar}
          aria-label="Fechar modal"
        >
          <Icon icon="mdi:close" />
        </button>

        <header className="modal-como-funciona__cabecalho">
          <div className="modal-como-funciona__emblema" aria-hidden="true">
            <Icon icon="mdi:creation" />
          </div>

          <span className="modal-como-funciona__rotulo">
            MANUAL DE INTERPRETAÇÃO
          </span>

          <h2 id={tituloId} className="modal-como-funciona__titulo">
            Como a numerologia funciona
          </h2>

          <div
            className="modal-como-funciona__divisor"
            aria-hidden="true"
          >
            <span />
            <Icon icon="mdi:star-four-points" />
            <span />
          </div>

          <p className="modal-como-funciona__introducao">
            A numerologia atribui um valor de 1 a 9 para cada letra do
            alfabeto, seguindo a <strong>tabela pitagórica</strong>.
            Somamos os valores das letras do seu nome e os dígitos da
            sua data de nascimento. O resultado é reduzido até virar
            um único dígito — exceto <strong>11, 22 e 33</strong>,
            que são números mestres.
          </p>
        </header>

        <div className="modal-como-funciona__corpo">
          <section className="modal-como-funciona__secao">
            <div className="modal-como-funciona__secao-cabecalho">
              <span>CAPÍTULO I</span>
              <h3>Tabela pitagórica</h3>
            </div>

            <p className="modal-como-funciona__texto">
              Cada letra recebe um valor numérico conforme sua posição
              na tabela abaixo.
            </p>

            <div className="modal-como-funciona__tabela">
              {TABELA.map((linha, indice) => (
                <div
                  key={indice}
                  className={`modal-como-funciona__linha ${
                    indice % 2 === 0
                      ? "modal-como-funciona__linha--letras"
                      : "modal-como-funciona__linha--valores"
                  }`}
                >
                  {linha.map((celula, indiceCelula) => (
                    <span
                      key={indiceCelula}
                      className="modal-como-funciona__celula"
                    >
                      {celula}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </section>

          <section className="modal-como-funciona__secao">
            <div className="modal-como-funciona__secao-cabecalho">
              <span>CAPÍTULO II</span>
              <h3>O que cada número significa</h3>
            </div>

            <p className="modal-como-funciona__texto">
              Cada número tem uma vibração específica que define o
              significado das interpretações em qualquer área.
            </p>

            <div className="modal-como-funciona__numeros">
              {NUMEROS.map((item) => (
                <div
                  key={item.numero}
                  className="modal-como-funciona__numero-card"
                >
                  <span className="modal-como-funciona__numero-destaque">
                    {item.numero}
                  </span>

                  <div className="modal-como-funciona__numero-info">
                    <strong>{item.vibracao}</strong>
                    <span>{item.significado}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="modal-como-funciona__secao">
            <div className="modal-como-funciona__secao-cabecalho">
              <span>CAPÍTULO III</span>
              <h3>O que cada área analisa</h3>
            </div>

            <p className="modal-como-funciona__texto">
              O mesmo número significa coisas diferentes dependendo
              de onde aparece.
            </p>

            <div className="modal-como-funciona__areas">
              {AREAS.map((area, indice) => (
                <div
                  key={area.titulo}
                  className="modal-como-funciona__area"
                >
                  <div className="modal-como-funciona__area-cabecalho">
                    <span>
                      {String(indice + 1).padStart(2, "0")}
                    </span>
                    <h4>{area.titulo}</h4>
                  </div>

                  <p>{area.descricao}</p>

                  <p className="modal-como-funciona__area-exemplo">
                    {area.exemplo}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="modal-como-funciona__secao">
            <div className="modal-como-funciona__secao-cabecalho">
              <span>CAPÍTULO IV</span>
              <h3>Exemplo prático</h3>
            </div>

            <p className="modal-como-funciona__texto">
              Nascimento em <strong>20/09/2004</strong>:
            </p>

            <div className="modal-como-funciona__exemplo">
              2 + 0 + 0 + 9 + 2 + 0 + 0 + 4 = 17 → 1 + 7 ={" "}
              <strong>8</strong>
            </div>

            <p className="modal-como-funciona__texto">
              O Caminho de Vida é <strong>8</strong> — missão de
              construir, liderar, realizar coisas concretas que durem.
            </p>
          </section>

          <section className="modal-como-funciona__secao">
            <div className="modal-como-funciona__secao-cabecalho">
              <span>CAPÍTULO V</span>
              <h3>Ciclos Pessoais (Ano, Mês e Dia)</h3>
            </div>

            <p className="modal-como-funciona__texto">
              Além dos números fixos, a numerologia calcula{" "}
              <strong>ciclos que mudam com o tempo</strong>.
              Eles mostram o "clima" de cada período:
            </p>

            <ul className="modal-como-funciona__lista">
              <li>
                <strong>Ano Pessoal</strong> — o tema macro do ano
                (1 a 9). Um ciclo completo dura 9 anos.
              </li>
              <li>
                <strong>Mês Pessoal</strong> — o tom do mês dentro
                desse ano.
              </li>
              <li>
                <strong>Dia Pessoal</strong> — a energia específica
                do dia.
              </li>
            </ul>

            <p className="modal-como-funciona__texto">
              Diferente dos números fixos, os ciclos{" "}
              <strong>nunca usam números mestres</strong>.
              São sempre reduzidos a 1 dígito.
            </p>

            <h4 className="modal-como-funciona__subtitulo-menor">
              Como a conta é feita
            </h4>

            <div className="modal-como-funciona__exemplo">
              <div>
                Ano Pessoal = red(dia_nasc + mês_nasc + dia_hoje +
                mês_hoje + ano_hoje)
              </div>
              <div>
                Mês Pessoal = red(Ano Pessoal + mês_hoje)
              </div>
              <div>
                Dia Pessoal = red(Mês Pessoal + dia_hoje)
              </div>
            </div>

            <p className="modal-como-funciona__texto">
              <code>red()</code> = reduzir somando os algarismos
              até sobrar 1 dígito. Ex.: 14 → 1 + 4 ={" "}
              <strong>5</strong>.
            </p>

            <h4 className="modal-como-funciona__subtitulo-menor">
              Exemplo prático dos ciclos
            </h4>

            <p className="modal-como-funciona__texto">
              Nascido em <strong>20/09/2004</strong>, consultando em{" "}
              <strong>19/10/2026</strong>:
            </p>

            <div className="modal-como-funciona__exemplo">
              <div>
                20 → 2 · 9 → 9 · 19 → 1 · 10 → 1 · 2026 → 1
              </div>
              <div>
                Ano Pessoal = red(2 + 9 + 1 + 1 + 1) = red(14) ={" "}
                <strong>5</strong>
              </div>
              <div>
                Mês Pessoal = red(5 + 1) = <strong>6</strong>
              </div>
              <div>
                Dia Pessoal = red(6 + 1) = <strong>7</strong>
              </div>
            </div>

            <p className="modal-como-funciona__texto">
              <strong>Ano 5</strong> é o tema do ano: liberdade,
              mudança, movimento. O <strong>Mês 6</strong> pede
              cuidado com casa e afetos. O <strong>Dia 7</strong>{" "}
              é de silêncio e introspecção.
            </p>
          </section>

          <footer className="modal-como-funciona__rodape">
            <Icon icon="mdi:star-four-points" />
            <p>ORACULVM · TRATADO DOS NÚMEROS</p>
            <Icon icon="mdi:star-four-points" />
          </footer>
        </div>
      </div>
    </div>,
    document.body
  );
}