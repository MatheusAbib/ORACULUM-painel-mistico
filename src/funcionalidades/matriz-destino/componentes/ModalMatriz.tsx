import { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@iconify/react";
import { ARCANOS } from "../dados/arcanos";
import "./ModalMatriz.scss";

interface Props {
  aberto: boolean;
  aoFechar: () => void;
  dataNascimento: string;
}

const PONTOS = [
  {
    letra: "A",
    nome: "Eu (Personalidade)",
    descricao:
      "O centro da Matriz. Representa quem você é por dentro, sua essência mais profunda.",
  },
  {
    letra: "B",
    nome: "Futuro",
    descricao:
      "O que está à sua frente. As tendências do seu caminho, o que você tende a se tornar.",
  },
  {
    letra: "C",
    nome: "Céu (Talento)",
    descricao:
      "Seu dom divino. O que você trouxe ao nascer, sua conexão com o alto.",
  },
  {
    letra: "D",
    nome: "Direita (Mãe)",
    descricao:
      "Sua linhagem materna. O que você herdou da sua mãe e das mulheres da família.",
  },
  {
    letra: "E",
    nome: "Esquerda (Pai)",
    descricao:
      "Sua linhagem paterna. O que você herdou do seu pai e dos homens da família.",
  },
  {
    letra: "F",
    nome: "Passado",
    descricao:
      "O que você deixou para trás. As lições aprendidas, o que já foi superado.",
  },
  {
    letra: "G",
    nome: "Saúde",
    descricao:
      "Sua relação com o corpo e a saúde. O que precisa de atenção nessa área.",
  },
  {
    letra: "H",
    nome: "Terra (Missão)",
    descricao:
      "Sua missão neste mundo. O que você veio realizar, o seu propósito concreto.",
  },
  {
    letra: "I",
    nome: "Finanças",
    descricao:
      "Sua relação com dinheiro e prosperidade. Os padrões que regem sua abundância.",
  },
  {
    letra: "J",
    nome: "Ancestral",
    descricao:
      "O que vem dos seus ancestrais. As heranças espirituais e comportamentais.",
  },
  {
    letra: "K",
    nome: "Karma",
    descricao:
      "Suas lições cármicas. O que você veio resolver nesta vida.",
  },
  {
    letra: "L",
    nome: "Dharma",
    descricao:
      "Seu caminho de realização. Como você cumpre seu propósito no mundo.",
  },
  {
    letra: "M",
    nome: "Propósito",
    descricao:
      "A síntese dos seus propósitos. O que orienta sua jornada maior.",
  },
];

const ARCANOS_LISTA = [
  { numero: 1, nome: "O Mago", resumo: "Manifestação, poder pessoal, capacidade de transformar ideia em realidade." },
  { numero: 2, nome: "A Sacerdotisa", resumo: "Intuição, sabedoria oculta, conexão com o sagrado." },
  { numero: 3, nome: "A Imperatriz", resumo: "Criatividade, fertilidade, abundância, poder de nutrir." },
  { numero: 4, nome: "O Imperador", resumo: "Estrutura, autoridade, disciplina, construção sólida." },
  { numero: 5, nome: "O Hierofante", resumo: "Ensinamento, tradição, conexão entre humano e divino." },
  { numero: 6, nome: "Os Enamorados", resumo: "Escolhas do coração, união, relações que transformam." },
  { numero: 7, nome: "O Carro", resumo: "Vitória pela vontade, movimento, determinação." },
  { numero: 8, nome: "A Justiça", resumo: "Equilíbrio, karma, integridade, discernimento." },
  { numero: 9, nome: "O Eremita", resumo: "Introspecção, sabedoria, busca da luz interior." },
  { numero: 10, nome: "A Roda da Fortuna", resumo: "Ciclos, destino, confiança no fluxo, recomeços." },
  { numero: 11, nome: "A Força", resumo: "Coragem serena, domínio dos instintos, força interior." },
  { numero: 12, nome: "O Enforcado", resumo: "Pausa, nova perspectiva, transformação pela rendição." },
  { numero: 13, nome: "A Morte", resumo: "Transformação radical, fim de ciclos, renascimento." },
  { numero: 14, nome: "A Temperança", resumo: "Equilíbrio, cura, harmonização de opostos." },
  { numero: 15, nome: "O Diabo", resumo: "Sombra, instintos, poder oculto, libertação das correntes." },
  { numero: 16, nome: "A Torre", resumo: "Ruptura, colapso, libertação, recomeço radical." },
  { numero: 17, nome: "A Estrela", resumo: "Esperança, inspiração, cura pela fé." },
  { numero: 18, nome: "A Lua", resumo: "Intuição, inconsciente, mistério, travessia interna." },
  { numero: 19, nome: "O Sol", resumo: "Clareza, alegria, vitalidade, brilho pessoal." },
  { numero: 20, nome: "O Julgamento", resumo: "Despertar, renovação, perdão, chamado interior." },
  { numero: 21, nome: "O Mundo", resumo: "Realização, integração, celebração, totalidade." },
  { numero: 22, nome: "O Louco", resumo: "Liberdade, fé, salto no desconhecido, começos." },
];

function reduzir(numero: number): number {
  while (numero > 22) {
    numero = String(numero)
      .split("")
      .reduce((soma, digito) => soma + Number(digito), 0);
  }

  return numero;
}

function somaDigitos(texto: string): number {
  return texto
    .replace(/\D/g, "")
    .split("")
    .reduce((soma, digito) => soma + Number(digito), 0);
}

export function ModalMatriz({
  aberto,
  aoFechar,
  dataNascimento,
}: Props) {
  const tituloId = useId();
  const fecharRef = useRef<HTMLButtonElement>(null);
  const caixaRef = useRef<HTMLDivElement>(null);
  const aoFecharRef = useRef(aoFechar);

  useEffect(() => {
    aoFecharRef.current = aoFechar;
  }, [aoFechar]);

  useEffect(() => {
    if (!aberto) return;

    const elementoAnterior = document.activeElement as HTMLElement | null;
    const overflowAnterior = document.body.style.overflow;

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
      document.body.style.overflow = overflowAnterior;
      document.removeEventListener("keydown", aoPressionarTecla);
      elementoAnterior?.focus();
    };
  }, [aberto]);

  if (!aberto) return null;

  const [ano = "", mes = "", dia = ""] = dataNascimento.split("-");

  const diaStr = dia.padStart(2, "0");
  const mesStr = mes.padStart(2, "0");

  const A = reduzir(somaDigitos(diaStr));
  const B = reduzir(somaDigitos(mesStr));
  const C = reduzir(somaDigitos(ano));
  const D = reduzir(A + B + C);
  const E = reduzir(A + B);
  const F = reduzir(B + C);
  const G = reduzir(C + D);
  const H = reduzir(D + A);
  const I = reduzir(A + D);
  const J = reduzir(B + D);
  const K = reduzir(E + F);
  const L = reduzir(G + H);
  const M = reduzir(K + L);

  const calculos = [
    { letra: "A", formula: `Dia ${diaStr} → ${diaStr.split("").join(" + ")} = ${A}`, arcano: ARCANOS[A]?.nome },
    { letra: "B", formula: `Mês ${mesStr} → ${mesStr.split("").join(" + ")} = ${B}`, arcano: ARCANOS[B]?.nome },
    { letra: "C", formula: `Ano ${ano} → ${ano.split("").join(" + ")} = ${C}`, arcano: ARCANOS[C]?.nome },
    { letra: "D", formula: `A + B + C = ${A} + ${B} + ${C} = ${D}`, arcano: ARCANOS[D]?.nome },
    { letra: "E", formula: `A + B = ${A} + ${B} = ${E}`, arcano: ARCANOS[E]?.nome },
    { letra: "F", formula: `B + C = ${B} + ${C} = ${F}`, arcano: ARCANOS[F]?.nome },
    { letra: "G", formula: `C + D = ${C} + ${D} = ${G}`, arcano: ARCANOS[G]?.nome },
    { letra: "H", formula: `D + A = ${D} + ${A} = ${H}`, arcano: ARCANOS[H]?.nome },
    { letra: "I", formula: `A + D = ${A} + ${D} = ${I}`, arcano: ARCANOS[I]?.nome },
    { letra: "J", formula: `B + D = ${B} + ${D} = ${J}`, arcano: ARCANOS[J]?.nome },
    { letra: "K", formula: `E + F = ${E} + ${F} = ${K}`, arcano: ARCANOS[K]?.nome },
    { letra: "L", formula: `G + H = ${G} + ${H} = ${L}`, arcano: ARCANOS[L]?.nome },
    { letra: "M", formula: `K + L = ${K} + ${L} = ${M}`, arcano: ARCANOS[M]?.nome },
  ];

  return createPortal(
    <div
      className="modal-matriz"
      onMouseDown={(evento) => {
        if (evento.target === evento.currentTarget) {
          aoFechar();
        }
      }}
    >
      <div
        ref={caixaRef}
        className="modal-matriz__caixa"
        role="dialog"
        aria-modal="true"
        aria-labelledby={tituloId}
      >
        <button
          ref={fecharRef}
          type="button"
          className="modal-matriz__fechar"
          onClick={aoFechar}
          aria-label="Fechar modal"
        >
          <Icon icon="mdi:close" />
        </button>

        <header className="modal-matriz__cabecalho">
          <div className="modal-matriz__emblema" aria-hidden="true">
            <Icon icon="mdi:shape-outline" />
          </div>

          <span className="modal-matriz__rotulo">
            MANUAL DE INTERPRETAÇÃO
          </span>

          <h2 id={tituloId} className="modal-matriz__titulo">
            A Matriz do Destino
          </h2>

          <div className="modal-matriz__divisor" aria-hidden="true">
            <span />
            <Icon icon="mdi:star-four-points" />
            <span />
          </div>

          <p className="modal-matriz__introducao">
            Um guia sobre a composição, os cálculos e os significados
            dos vinte e dois arcanos utilizados na Matriz do Destino.
          </p>
        </header>

        <div className="modal-matriz__corpo">
          <section className="modal-matriz__secao">
            <div className="modal-matriz__secao-cabecalho">
              <span>CAPÍTULO I</span>
              <h3>O que é a Matriz do Destino?</h3>
            </div>

            <p className="modal-matriz__texto">
              A Matriz do Destino é um sistema russo de autoconhecimento
              baseado nos <strong>22 Arcanos Maiores do Tarô</strong>.
              Ela combina o tarô tradicional com a numerologia,
              gerando um mapa simbólico para interpretar diferentes
              aspectos da vida.
            </p>

            <p className="modal-matriz__texto">
              Cada posição da matriz representa uma área específica,
              enquanto o número associado a ela corresponde a um
              arcano e à sua interpretação.
            </p>
          </section>

          <section className="modal-matriz__secao">
            <div className="modal-matriz__secao-cabecalho">
              <span>CAPÍTULO II</span>
              <h3>Como funciona o cálculo?</h3>
            </div>

            <p className="modal-matriz__texto">
              A matriz é calculada a partir da sua{" "}
              <strong>data de nascimento</strong>. Os dígitos são
              somados e os resultados são reduzidos a valores de{" "}
              <strong>1 a 22</strong>, correspondentes aos arcanos.
              Os demais pontos são obtidos por meio de combinações
              desses valores.
            </p>

            <div className="modal-matriz__nota">
              <Icon icon="mdi:information-outline" />
              <p>
                <strong>Regra da redução:</strong> quando uma soma
                ultrapassa 22, seus dígitos são somados novamente
                até que o resultado esteja dentro do intervalo.
                Por exemplo, 26 → 2 + 6 = 8.
              </p>
            </div>
          </section>

          <section className="modal-matriz__secao">
            <div className="modal-matriz__secao-cabecalho">
              <span>CAPÍTULO III</span>
              <h3>O cálculo da sua matriz</h3>
            </div>

            <p className="modal-matriz__texto">
              A tabela abaixo apresenta os treze cálculos realizados
              a partir da sua data de nascimento.
            </p>

            <div className="modal-matriz__calculo">
              {calculos.map((calculo) => (
                <div
                  key={calculo.letra}
                  className="modal-matriz__calculo-linha"
                >
                  <span className="modal-matriz__calculo-letra">
                    {calculo.letra}
                  </span>

                  <div className="modal-matriz__calculo-conteudo">
                    <span className="modal-matriz__calculo-formula">
                      {calculo.formula}
                    </span>

                    <strong className="modal-matriz__calculo-arcano">
                      {calculo.arcano ?? "Arcano não identificado"}
                    </strong>
                  </div>
                </div>
              ))}
            </div>

            <p className="modal-matriz__texto">
              No diagrama, cada ponto apresenta sua letra e o número
              correspondente. Ao selecionar um ponto, você pode
              consultar a interpretação completa do arcano.
            </p>
          </section>

          <section className="modal-matriz__secao">
            <div className="modal-matriz__secao-cabecalho">
              <span>CAPÍTULO IV</span>
              <h3>Os treze pontos da matriz</h3>
            </div>

            <p className="modal-matriz__texto">
              As letras de A a M identificam as posições da matriz.
              Cada uma corresponde a um aspecto específico da vida.
            </p>

            <div className="modal-matriz__lista">
              {PONTOS.map((ponto) => (
                <div key={ponto.letra} className="modal-matriz__item">
                  <span className="modal-matriz__item-letra">
                    {ponto.letra}
                  </span>

                  <div className="modal-matriz__item-info">
                    <strong className="modal-matriz__item-nome">
                      {ponto.nome}
                    </strong>

                    <p className="modal-matriz__item-descricao">
                      {ponto.descricao}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="modal-matriz__secao">
            <div className="modal-matriz__secao-cabecalho">
              <span>CAPÍTULO V</span>
              <h3>Os vinte e dois arcanos</h3>
            </div>

            <p className="modal-matriz__texto">
              Cada número de 1 a 22 corresponde a um Arcano Maior
              do Tarô. A interpretação depende do arcano e da
              posição que ele ocupa na matriz.
            </p>

            <div className="modal-matriz__lista">
              {ARCANOS_LISTA.map((arcano) => (
                <div key={arcano.numero} className="modal-matriz__item">
                  <span className="modal-matriz__item-letra">
                    {arcano.numero}
                  </span>

                  <div className="modal-matriz__item-info">
                    <strong className="modal-matriz__item-nome">
                      {arcano.nome}
                    </strong>

                    <p className="modal-matriz__item-descricao">
                      {arcano.resumo}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <footer className="modal-matriz__rodape">
            <Icon icon="mdi:star-four-points" />
            <p>
              A Matriz do Destino é uma tradição interpretativa
              simbólica, não um método científico de previsão.
            </p>
            <Icon icon="mdi:star-four-points" />
          </footer>
        </div>
      </div>
    </div>,
    document.body
  );
}