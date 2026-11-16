import { useState } from "react";
import { Icon } from "@iconify/react";
import type { Tiragem } from "../../../nucleo/modelos/carta";
import { BotaoMistico } from "../../../compartilhado/componentes/BotaoMistico";
import "./CampoPergunta.scss";

interface Props {
  tiragem: Tiragem;
  aoConfirmar: (pergunta: string) => void;
  aoCancelar: () => void;
}

export function CampoPergunta({
  tiragem,
  aoConfirmar,
  aoCancelar,
}: Props) {
  const [texto, setTexto] = useState("");

  return (
    <section className="campo-pergunta">
      <div className="campo-pergunta__topo">
        <button
          type="button"
          className="campo-pergunta__voltar"
          onClick={aoCancelar}
        >
          <Icon icon="mdi:arrow-left" />
          <span>Voltar às tiragens</span>
        </button>

        <span className="campo-pergunta__identificacao">
          <Icon icon="mdi:star-four-points" />
          {tiragem.nome}
        </span>
      </div>

      <div className="campo-pergunta__pagina">
        <div
          className="campo-pergunta__moldura"
          aria-hidden="true"
        />

        <header className="campo-pergunta__cabecalho">
          <span className="campo-pergunta__sobretitulo">
            ORACULVM · PREPARAÇÃO DA CONSULTA
          </span>

          <div
            className="campo-pergunta__emblema"
            aria-hidden="true"
          >
            <Icon icon="game-icons:quill-ink" />
          </div>

          <span className="campo-pergunta__capitulo">
            ANTES DE REVELAR OS ARCANOS
          </span>

          <h1 className="campo-pergunta__titulo">
            O que deseja saber?
          </h1>

          <div
            className="campo-pergunta__divisor"
            aria-hidden="true"
          >
            <span />
            <Icon icon="mdi:star-four-points" />
            <span />
          </div>

          <p className="campo-pergunta__descricao">
            Antes de consultar as cartas, você pode registrar
            uma pergunta ou um assunto sobre o qual deseja refletir.
            Suas palavras acompanharão a interpretação dos arcanos.
          </p>
        </header>

        <form
          className="campo-pergunta__formulario"
          onSubmit={(evento) => {
            evento.preventDefault();
            aoConfirmar(texto.trim());
          }}
        >
          <div className="campo-pergunta__campo">
            <div className="campo-pergunta__campo-cabecalho">
              <label
                htmlFor="pergunta"
                className="campo-pergunta__label"
              >
                SUA PERGUNTA
              </label>

              <span className="campo-pergunta__opcional">
                PREENCHIMENTO OPCIONAL
              </span>
            </div>

            <div className="campo-pergunta__area-escrita">
              <textarea
                id="pergunta"
                className="campo-pergunta__textarea"
                value={texto}
                onChange={(evento) =>
                  setTexto(evento.target.value)
                }
                placeholder="Escreva aqui sua pergunta ou o assunto que deseja explorar..."
                rows={5}
                maxLength={300}
              />

              <div className="campo-pergunta__campo-rodape">
                <Icon icon="game-icons:quill-ink" />

                <span className="campo-pergunta__contador">
                  {texto.length} / 300
                </span>
              </div>
            </div>
          </div>

          <div className="campo-pergunta__observacao">
            <Icon icon="mdi:information-outline" />

            <p>
              Você também pode continuar sem escrever uma
              pergunta. Nesse caso, a leitura será realizada
              de maneira geral.
            </p>
          </div>

          <div className="campo-pergunta__acoes">
            <BotaoMistico
              onClick={() => aoConfirmar(texto.trim())}
            >
              <Icon icon="game-icons:card-pick" />
              Tirar as cartas
            </BotaoMistico>

            <span className="campo-pergunta__acoes-legenda">
              SUA CONSULTA ESTÁ PRONTA PARA COMEÇAR
            </span>
          </div>
        </form>

        <footer className="campo-pergunta__rodape">
          <span>ORACULVM</span>
          <Icon icon="mdi:star-four-points" />
          <span>LIBER ARCANORUM</span>
        </footer>
      </div>
    </section>
  );
}