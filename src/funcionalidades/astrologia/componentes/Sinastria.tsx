import { useEffect, useId, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { Icon } from "@iconify/react";
import { carregarMunicipios } from "municipios-brasil";
import type { ApiMunicipios, Municipio } from "municipios-brasil";
import { useAstrologia } from "../ganchos/useAstrologia";
import type {
  DadosNascimento,
  ResultadoMapaAstral,
} from "../servicos/astrologia";
import { calcularSinastria, resumirSinastria } from "../servicos/sinastria";
import { obterTextoSinastria } from "../dados/sinastria";
import "./Sinastria.scss";

interface Props {
  mapaA: ResultadoMapaAstral;
  nomeA: string;
}

const NOMES: Record<string, string> = {
  conjuncao: "Conjunção",
  sextil: "Sextil",
  quadratura: "Quadratura",
  trigono: "Trígono",
  oposicao: "Oposição",
};

const ICONES: Record<string, string> = {
  conjuncao: "mdi:circle-double",
  sextil: "mdi:star-six-points-outline",
  quadratura: "mdi:square-outline",
  trigono: "mdi:triangle-outline",
  oposicao: "mdi:arrow-left-right",
};

function obterDataAtual() {
  const agora = new Date();
  const ano = agora.getFullYear();
  const mes = String(agora.getMonth() + 1).padStart(2, "0");
  const dia = String(agora.getDate()).padStart(2, "0");

  return `${ano}-${mes}-${dia}`;
}

export function Sinastria({ mapaA, nomeA }: Props) {
  const id = useId();
const {
  resultado: mapaB,
  carregando,
  erro,
  calcular,
  limpar,
} = useAstrologia();

  const [api, setApi] = useState<ApiMunicipios | null>(null);
  const [aberto, setAberto] = useState(false);
  const [nome, setNome] = useState("");
  const [nomeB, setNomeB] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [buscaCidade, setBuscaCidade] = useState("");
  const [cidadeSelecionada, setCidadeSelecionada] =
    useState<Municipio | null>(null);
  const [listaAberta, setListaAberta] = useState(false);
  const [indiceAtivo, setIndiceAtivo] = useState(-1);
const comparacao = mapaB
  ? {
      mapa: mapaB,
      nome: nomeB,
    }
  : null;

  useEffect(() => {
    let ativo = true;

    carregarMunicipios()
      .then((resultado) => {
        if (ativo) setApi(resultado);
      })
      .catch(() => {
        if (ativo) setApi(null);
      });

    return () => {
      ativo = false;
    };
  }, []);

  const sugestoes: Municipio[] =
    api && buscaCidade.trim().length >= 2 && !cidadeSelecionada
      ? api.buscar(buscaCidade, { limite: 8 })
      : [];

  const mostrarSugestoes = listaAberta && sugestoes.length > 0;

  const aspectos = comparacao
    ? calcularSinastria(mapaA, comparacao.mapa)
    : [];

  const resumo = resumirSinastria(aspectos);

  function selecionarCidade(cidade: Municipio) {
    setCidadeSelecionada(cidade);
    setBuscaCidade(`${cidade.nome} - ${cidade.uf}`);
    setListaAberta(false);
    setIndiceAtivo(-1);
  }

  function handleTeclado(evento: KeyboardEvent<HTMLInputElement>) {
    if (evento.key === "Escape") {
      setListaAberta(false);
      setIndiceAtivo(-1);
      return;
    }

    if (!mostrarSugestoes) return;

    if (evento.key === "ArrowDown") {
      evento.preventDefault();
      setIndiceAtivo((atual) =>
        atual >= sugestoes.length - 1 ? 0 : atual + 1
      );
    }

    if (evento.key === "ArrowUp") {
      evento.preventDefault();
      setIndiceAtivo((atual) =>
        atual <= 0 ? sugestoes.length - 1 : atual - 1
      );
    }

    if (evento.key === "Enter" && indiceAtivo >= 0) {
      evento.preventDefault();
      selecionarCidade(sugestoes[indiceAtivo]);
    }
  }

function handleSubmit(evento: FormEvent<HTMLFormElement>) {
  evento.preventDefault();

  if (
    carregando ||
    !nome.trim() ||
    !data ||
    !hora ||
    !cidadeSelecionada
  ) {
    return;
  }

  const dados: DadosNascimento = {
    nome: nome.trim(),
    data,
    hora,
    cidadeNome: cidadeSelecionada.nome,
    cidadeUf: cidadeSelecionada.uf,
  };

  setNomeB(dados.nome);
  calcular(dados);
}

  function limparFormulario() {
    setNome("");
    setData("");
    setHora("");
    setBuscaCidade("");
    setCidadeSelecionada(null);
    setListaAberta(false);
    setIndiceAtivo(-1);
  }

function novaComparacao() {
  limpar();
  limparFormulario();
  setNomeB("");
  setAberto(true);
}

  return (
    <section className="sinastria">
  

      {!aberto && !comparacao && (
        <div className="sinastria__convite">
          <div className="sinastria__convite-ornamento" aria-hidden="true">
            <Icon icon="mdi:star-four-points" />
          </div>

          <span className="sinastria__convite-capitulo">
            UMA SEGUNDA CARTOGRAFIA CELESTE
          </span>

          <h3>Dois céus, uma comparação</h3>

          <p>
            Seu mapa astral já está preparado. Informe os dados de
            nascimento de outra pessoa para examinar os aspectos
            formados entre os dois mapas.
          </p>

          <div className="sinastria__participantes">
            <div className="sinastria__participante">
              <Icon icon="mdi:account-outline" />
              <span>PRIMEIRO MAPA</span>
              <strong>{nomeA}</strong>
              <small>Já calculado</small>
            </div>

            <div className="sinastria__participantes-simbolo">
              <Icon icon="game-icons:linked-rings" />
            </div>

            <div className="sinastria__participante">
              <Icon icon="mdi:account-plus-outline" />
              <span>SEGUNDO MAPA</span>
              <strong>Outra pessoa</strong>
              <small>Aguardando dados</small>
            </div>
          </div>

          <button
            type="button"
            className="sinastria__btn"
            onClick={() => setAberto(true)}
          >
            <Icon icon="game-icons:astrolabe" />
            <span>Comparar com alguém</span>
            <Icon icon="mdi:arrow-right" />
          </button>
        </div>
      )}

      {aberto && !comparacao && (
        <div className="sinastria__formulario">
          <div className="sinastria__formulario-topo">
            <button
              type="button"
              className="sinastria__voltar"
              onClick={() => setAberto(false)}
              disabled={carregando}
            >
              <Icon icon="mdi:arrow-left" />
              Voltar
            </button>

            <span>SEGUNDO MAPA NATAL</span>
          </div>

          <div className="sinastria__formulario-conteudo">
            <div className="sinastria__formulario-cabecalho">
              <Icon icon="game-icons:astrolabe" />

              <span>REGISTRO DE NASCIMENTO</span>

              <h3>Dados da outra pessoa</h3>

              <p>
                Informe a data, a hora e o local de nascimento
                para calcular o segundo mapa astral.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="sinastria__campo">
                <label htmlFor={`${id}-nome`}>Nome</label>

                <div className="sinastria__input">
                  <Icon icon="mdi:account-outline" />

                  <input
                    id={`${id}-nome`}
                    type="text"
                    value={nome}
                    onChange={(evento) =>
                      setNome(evento.target.value)
                    }
                    placeholder="Nome da outra pessoa"
                    maxLength={120}
                    disabled={carregando}
                    required
                  />
                </div>
              </div>

              <div className="sinastria__linha">
                <div className="sinastria__campo">
                  <label htmlFor={`${id}-data`}>
                    Data de nascimento
                  </label>

                  <div className="sinastria__input">
                    <Icon icon="mdi:calendar-month-outline" />

                    <input
                      id={`${id}-data`}
                      type="date"
                      value={data}
                      onChange={(evento) =>
                        setData(evento.target.value)
                      }
                      max={obterDataAtual()}
                      disabled={carregando}
                      required
                    />
                  </div>
                </div>

                <div className="sinastria__campo">
                  <label htmlFor={`${id}-hora`}>
                    Hora de nascimento
                  </label>

                  <div className="sinastria__input">
                    <Icon icon="mdi:clock-outline" />

                    <input
                      id={`${id}-hora`}
                      type="time"
                      value={hora}
                      onChange={(evento) =>
                        setHora(evento.target.value)
                      }
                      disabled={carregando}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="sinastria__campo sinastria__cidade">
                <label htmlFor={`${id}-cidade`}>
                  Cidade de nascimento
                </label>

                <div className="sinastria__input">
                  <Icon icon="mdi:map-marker-outline" />

                  <input
                    id={`${id}-cidade`}
                    type="text"
                    role="combobox"
                    aria-autocomplete="list"
                    aria-expanded={mostrarSugestoes}
                    aria-controls={`${id}-sugestoes`}
                    aria-activedescendant={
                      mostrarSugestoes && indiceAtivo >= 0
                        ? `${id}-sugestao-${indiceAtivo}`
                        : undefined
                    }
                    value={buscaCidade}
                    onChange={(evento) => {
                      setBuscaCidade(evento.target.value);
                      setCidadeSelecionada(null);
                      setListaAberta(true);
                      setIndiceAtivo(-1);
                    }}
                    onFocus={() => setListaAberta(true)}
                    onBlur={() => {
                      setListaAberta(false);
                      setIndiceAtivo(-1);
                    }}
                    onKeyDown={handleTeclado}
                    placeholder="Digite o nome da cidade"
                    autoComplete="off"
                    disabled={carregando}
                    required
                  />

                  {cidadeSelecionada && (
                    <Icon
                      icon="mdi:check-circle-outline"
                      className="sinastria__cidade-confirmada"
                    />
                  )}
                </div>

                {mostrarSugestoes && (
                  <ul
                    id={`${id}-sugestoes`}
                    className="sinastria__sugestoes"
                    role="listbox"
                  >
                    {sugestoes.map((cidade, indice) => (
                      <li
                        key={cidade.codigoIbge}
                        id={`${id}-sugestao-${indice}`}
                        role="option"
                        aria-selected={indice === indiceAtivo}
                      >
                        <button
                          type="button"
                          tabIndex={-1}
                          className={
                            indice === indiceAtivo
                              ? "sinastria__sugestao-ativa"
                              : ""
                          }
                          onMouseDown={(evento) => {
                            evento.preventDefault();
                            selecionarCidade(cidade);
                          }}
                          onClick={() => selecionarCidade(cidade)}
                        >
                          <Icon icon="mdi:map-marker-outline" />
                          <span>{cidade.nome}</span>
                          <small>{cidade.uf}</small>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <p className="sinastria__ajuda">
                  Selecione uma cidade da lista.
                </p>
              </div>

              <div className="sinastria__formulario-nota">
                <Icon icon="mdi:information-outline" />
                <p>
                  Os dados informados serão utilizados para
                  calcular o mapa astral da segunda pessoa e
                  comparar seus aspectos com o seu.
                </p>
              </div>

              {erro && (
                <div className="sinastria__erro" role="alert">
                  <Icon icon="mdi:alert-circle-outline" />
                  <span>{erro}</span>
                </div>
              )}

              <button
                type="submit"
                className="sinastria__btn sinastria__btn--formulario"
                disabled={carregando || !cidadeSelecionada}
              >
                {carregando ? (
                  <>
                    <Icon
                      icon="mdi:loading"
                      className="sinastria__girando"
                    />
                    <span>Calculando sinastria...</span>
                  </>
                ) : (
                  <>
                    <Icon icon="game-icons:linked-rings" />
                    <span>Calcular sinastria</span>
                    <Icon icon="mdi:arrow-right" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      )}

      {comparacao && (
        <div className="sinastria__resultado">
          <div className="sinastria__resultado-topo">
            <span>ANÁLISE DE COMPATIBILIDADE ASTROLÓGICA</span>

            <div className="sinastria__resultado-nomes">
              <strong>{nomeA}</strong>
              <Icon icon="game-icons:linked-rings" />
              <strong>{comparacao.nome}</strong>
            </div>
          </div>

          <div className="sinastria__resumo">
            <span className="sinastria__resumo-capitulo">
              SÍNTESE DA COMPARAÇÃO
            </span>

            <h3>Resumo da conexão</h3>

            <div className="sinastria__contadores">
              <div className="sinastria__contador sinastria__contador--total">
                <Icon icon="mdi:star-four-points" />
                <span>{resumo.total}</span>
                <small>Aspectos encontrados</small>
              </div>

              <div className="sinastria__contador sinastria__contador--harmonico">
                <Icon icon="mdi:creation" />
                <span>{resumo.harmonicos}</span>
                <small>Aspectos harmônicos</small>
              </div>

              <div className="sinastria__contador sinastria__contador--tenso">
                <Icon icon="mdi:scale-balance" />
                <span>{resumo.tensos}</span>
                <small>Aspectos tensos</small>
              </div>
            </div>

            <p className="sinastria__resumo-texto">
              {resumo.harmonicos > resumo.tensos
                ? "A comparação apresenta mais aspectos harmônicos do que tensos. Na interpretação astrológica, isso sugere áreas de afinidade e facilidade na convivência."
                : resumo.tensos > resumo.harmonicos
                  ? "A comparação apresenta mais aspectos tensos do que harmônicos. Na interpretação astrológica, isso aponta diferenças que podem exigir diálogo e compreensão."
                  : "A comparação apresenta um equilíbrio entre aspectos harmônicos e tensos, sugerindo uma combinação de afinidades e diferenças."}
            </p>
          </div>

          <div className="sinastria__lista-cabecalho">
            <span>REGISTRO DOS ASPECTOS</span>
            <h3>Os encontros planetários</h3>
            <p>
              Cada aspecto descreve uma relação angular entre
              os planetas dos dois mapas.
            </p>
          </div>

          <div className="sinastria__lista">
            {aspectos.map((asp, indice) => {
              const texto = obterTextoSinastria(
                asp.tipo,
                asp.planetaA,
                asp.planetaB
              );

              return (
                <article
                  key={`${asp.planetaA}-${asp.planetaB}-${asp.tipo}-${indice}`}
                  className={`sinastria__item sinastria__item--${asp.tipo}`}
                >
                  <div className="sinastria__item-cabecalho">
                    <div className="sinastria__item-simbolo">
                      <Icon
                        icon={
                          ICONES[asp.tipo] ||
                          "mdi:star-four-points"
                        }
                      />
                    </div>

                    <div className="sinastria__item-titulo">
                      <span>
                        ASPECTO {String(indice + 1).padStart(2, "0")}
                        {" · "}
                        {NOMES[asp.tipo] || asp.tipo}
                      </span>

                      <h4>
                        {asp.planetaA} de {nomeA} em{" "}
                        {(NOMES[asp.tipo] || asp.tipo).toLowerCase()}{" "}
                        com {asp.planetaB} de {comparacao.nome}
                      </h4>
                    </div>

                    <span className="sinastria__orbe">
                      ORBE {asp.orbe}°
                    </span>
                  </div>

                  <p className="sinastria__descricao">
                    {texto.descricao}
                  </p>

                  <div className="sinastria__blocos">
                    <div className="sinastria__bloco sinastria__bloco--bom">
                      <div className="sinastria__bloco-titulo">
                        <Icon icon="mdi:check-circle-outline" />
                        <strong>O que funciona</strong>
                      </div>

                      <p>{texto.funciona}</p>
                    </div>

                    <div className="sinastria__bloco sinastria__bloco--atencao">
                      <div className="sinastria__bloco-titulo">
                        <Icon icon="mdi:alert-circle-outline" />
                        <strong>O que observar</strong>
                      </div>

                      <p>{texto.vigiar}</p>
                    </div>
                  </div>

                  <div className="sinastria__conselho">
                    <Icon icon="game-icons:quill-ink" />

                    <p>
                      <strong>Para refletir</strong>
                      {texto.conselho}
                    </p>
                  </div>
                </article>
              );
            })}
          </div>

          <div className="sinastria__resultado-rodape">
            <p>
              A sinastria é uma interpretação simbólica dos
              aspectos astrológicos e não determina a qualidade
              ou o futuro de uma relação.
            </p>

            <button
              type="button"
              className="sinastria__btn sinastria__btn--secundario"
              onClick={novaComparacao}
            >
              <Icon icon="mdi:account-switch-outline" />
              <span>Comparar com outra pessoa</span>
              <Icon icon="mdi:arrow-right" />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}