import { useState } from "react";
import type { FormEvent } from "react";
import { Icon } from "@iconify/react";
import {
  calcularCompatibilidade,
  type ResultadoCompatibilidade,
} from "../servicos/compatibilidade";
import "./Compatibilidade.scss";

interface Props {
  nomeA: string;
  dataA: string;
}

export function Compatibilidade({ nomeA, dataA }: Props) {
  const [aberto, setAberto] = useState(false);
  const [nomeB, setNomeB] = useState("");
  const [dataB, setDataB] = useState("");
  const [resultado, setResultado] =
    useState<ResultadoCompatibilidade | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  const percentual = resultado
    ? Math.max(0, Math.min(100, resultado.percentual))
    : 0;

  function calcular(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault();
    setErro(null);

    if (!nomeB.trim() || !dataB) {
      setErro("Preencha o nome e a data de nascimento da outra pessoa.");
      return;
    }

    try {
      const novoResultado = calcularCompatibilidade(
        {
          nome: nomeA,
          dataNascimento: dataA,
        },
        {
          nome: nomeB.trim(),
          dataNascimento: dataB,
        }
      );

      setResultado(novoResultado);
    } catch (erroCapturado) {
      setErro(
        erroCapturado instanceof Error
          ? erroCapturado.message
          : "Não foi possível calcular a compatibilidade."
      );
    }
  }

  function resetar() {
    setResultado(null);
    setNomeB("");
    setDataB("");
    setErro(null);
    setAberto(true);
  }

  function fechar() {
    setAberto(false);
    setResultado(null);
    setNomeB("");
    setDataB("");
    setErro(null);
  }

  return (
    <section className="compatibilidade">
      <p className="compatibilidade__subtitulo">
        Compare seu Caminho de Vida com o de outra pessoa para explorar
        afinidades, diferenças e possíveis pontos de equilíbrio entre
        os números de vocês.
      </p>

      {!aberto && !resultado && (
        <div className="compatibilidade__inicio">
          <div className="compatibilidade__inicio-texto">
            <Icon icon="mdi:account-multiple-outline" />

            <div>
              <strong>Estudo entre duas pessoas</strong>
              <span>
                Informe os dados da outra pessoa para iniciar
                a comparação.
              </span>
            </div>
          </div>

          <button
            type="button"
            className="compatibilidade__btn compatibilidade__btn--abrir"
            onClick={() => setAberto(true)}
          >
            <Icon icon="mdi:account-multiple-plus-outline" />
            <span>Comparar com alguém</span>
            <Icon icon="mdi:arrow-right" />
          </button>
        </div>
      )}

      {aberto && !resultado && (
        <div className="compatibilidade__painel">
          <div className="compatibilidade__painel-cabecalho">
            <div>
              <span className="compatibilidade__indice">
                REGISTRO DE CORRESPONDÊNCIA
              </span>
              <h4>Dados da segunda pessoa</h4>
            </div>

            <button
              type="button"
              className="compatibilidade__btn-fechar"
              onClick={fechar}
              aria-label="Fechar comparação"
            >
              <Icon icon="mdi:close" />
            </button>
          </div>

          <form
            className="compatibilidade__form"
            onSubmit={calcular}
          >
            <label className="compatibilidade__campo">
              <span>
                <Icon icon="mdi:account-outline" />
                Nome completo
              </span>

              <input
                type="text"
                value={nomeB}
                onChange={(evento) => {
                  setNomeB(evento.target.value);
                  if (erro) setErro(null);
                }}
                placeholder="Nome de nascimento"
                autoComplete="off"
                required
              />
            </label>

            <label className="compatibilidade__campo">
              <span>
                <Icon icon="mdi:calendar-month-outline" />
                Data de nascimento
              </span>

              <input
                type="date"
                value={dataB}
                onChange={(evento) => {
                  setDataB(evento.target.value);
                  if (erro) setErro(null);
                }}
                required
              />
            </label>

            {erro && (
              <p className="compatibilidade__erro" role="alert">
                <Icon icon="mdi:alert-circle-outline" />
                {erro}
              </p>
            )}

            <div className="compatibilidade__acoes">
              <button
                type="submit"
                className="compatibilidade__btn compatibilidade__btn--calcular"
              >
                <Icon icon="mdi:creation" />
                <span>Calcular compatibilidade</span>
                <Icon icon="mdi:arrow-right" />
              </button>
            </div>
          </form>
        </div>
      )}

      {resultado && (
        <div className="compatibilidade__resultado">
          <div className="compatibilidade__resumo">
            <div className="compatibilidade__resumo-superior">
              <span>RESULTADO DA CORRESPONDÊNCIA</span>
              <span>ESTUDO NUMEROLÓGICO</span>
            </div>

            <div className="compatibilidade__numeros">
              <div className="compatibilidade__numero">
                <span className="compatibilidade__numero-identificacao">
                  PRIMEIRO CAMINHO
                </span>

                <div className="compatibilidade__numero-valor">
                  <span>{resultado.numeroA}</span>
                </div>

                <span className="compatibilidade__numero-nome">
                  Você
                </span>
              </div>

              <div className="compatibilidade__conexao">
                <span className="compatibilidade__conexao-linha" />

                <div className="compatibilidade__conexao-simbolo">
                  <Icon icon="mdi:vector-intersection" />
                </div>

                <span className="compatibilidade__conexao-linha" />
              </div>

              <div className="compatibilidade__numero">
                <span className="compatibilidade__numero-identificacao">
                  SEGUNDO CAMINHO
                </span>

                <div className="compatibilidade__numero-valor">
                  <span>{resultado.numeroB}</span>
                </div>

                <span
                  className="compatibilidade__numero-nome"
                  title={nomeB}
                >
                  {nomeB}
                </span>
              </div>
            </div>

            <div className="compatibilidade__afinidade">
              <span className="compatibilidade__afinidade-rotulo">
                ÍNDICE SIMBÓLICO DE AFINIDADE
              </span>

              <div
                className="compatibilidade__barra"
                role="progressbar"
                aria-label="Índice simbólico de afinidade"
                aria-valuenow={percentual}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="compatibilidade__barra-fill"
                  style={{ width: `${percentual}%` }}
                />
              </div>

              <span className="compatibilidade__percentual">
                {resultado.percentual}% de afinidade
              </span>
            </div>

            <div className="compatibilidade__interpretacao">
              <span className="compatibilidade__indice">
                LEITURA DA RELAÇÃO
              </span>

              <h4 className="compatibilidade__subtitulo-relacao">
                {resultado.titulo}
              </h4>

              <p className="compatibilidade__resumo-texto">
                {resultado.resumo}
              </p>
            </div>
          </div>

          <div className="compatibilidade__blocos">
            <div className="compatibilidade__bloco compatibilidade__bloco--bom">
              <div className="compatibilidade__bloco-cabecalho">
                <Icon icon="mdi:check-circle-outline" />

                <div>
                  <span>ASPECTO I</span>
                  <strong>O que funciona</strong>
                </div>
              </div>

              <ul>
                {resultado.forcas.map((forca, indice) => (
                  <li key={`${indice}-${forca}`}>
                    {forca}
                  </li>
                ))}
              </ul>
            </div>

            <div className="compatibilidade__bloco compatibilidade__bloco--atencao">
              <div className="compatibilidade__bloco-cabecalho">
                <Icon icon="mdi:scale-balance" />

                <div>
                  <span>ASPECTO II</span>
                  <strong>O que precisa de atenção</strong>
                </div>
              </div>

              <ul>
                {resultado.atritos.map((atrito, indice) => (
                  <li key={`${indice}-${atrito}`}>
                    {atrito}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="compatibilidade__conselho">
            <div className="compatibilidade__conselho-icone">
              <Icon icon="mdi:compass-outline" />
            </div>

            <div>
              <span className="compatibilidade__indice">
                ORIENTAÇÃO DA LEITURA
              </span>

              <p>{resultado.conselho}</p>
            </div>
          </div>

          <div className="compatibilidade__resultado-rodape">
            <span>
              <Icon icon="mdi:star-four-points" />
              ORACULVM · ESTUDO DE COMPATIBILIDADE
            </span>

            <div className="compatibilidade__resultado-acoes">
              <button
                type="button"
                className="compatibilidade__btn compatibilidade__btn--secundario"
                onClick={resetar}
              >
                <Icon icon="mdi:account-switch-outline" />
                <span>Comparar com outra pessoa</span>
              </button>

              <button
                type="button"
                className="compatibilidade__btn-fechar"
                onClick={fechar}
                aria-label="Encerrar comparação"
              >
                <Icon icon="mdi:close" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}