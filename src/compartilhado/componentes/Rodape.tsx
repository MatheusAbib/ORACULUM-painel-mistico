
import { Icon } from "@iconify/react";
import "./Rodape.scss";

export function Rodape() {
  return (
    <footer className="rodape">
      <div className="rodape__ornamento-superior" aria-hidden="true">
        <span className="rodape__ornamento-linha" />
        <Icon icon="game-icons:star-formation" />
        <Icon icon="game-icons:sun" />
        <Icon icon="game-icons:star-formation" />
        <span className="rodape__ornamento-linha" />
      </div>

      <div className="rodape__conteudo">
        <div className="rodape__lateral rodape__lateral--esquerda">
          <span>COMPÊNDIO DIGITAL</span>
          <strong>MMXXVI</strong>
          <span>VOL. I — VII</span>
        </div>

        <div className="rodape__centro">
          <div className="rodape__emblema" aria-hidden="true">
            <span className="rodape__emblema-anel">
              <Icon icon="game-icons:all-seeing-eye" />
            </span>
            <Icon
              icon="game-icons:star-formation"
              className="rodape__emblema-estrela rodape__emblema-estrela--esquerda"
            />
            <Icon
              icon="game-icons:star-formation"
              className="rodape__emblema-estrela rodape__emblema-estrela--direita"
            />
          </div>

          <h2>ORACULVM</h2>

          <p className="rodape__subtitulo">
            ARQUIVO DE ARTES ESOTÉRICAS
          </p>

          <div className="rodape__divisor" aria-hidden="true">
            <span />
            <Icon icon="mdi:star-four-points" />
            <span />
          </div>

          <p className="rodape__descricao">
            Sete ferramentas de consulta e estudo reunindo cartomancia,
            astrologia, numerologia, simbolismo e referências esotéricas.
          </p>

          <div className="rodape__disciplinas">
            <span>Tarô</span>
            <span>Astrologia</span>
            <span>Numerologia</span>
            <span>Matriz do Destino</span>
            <span>Signos</span>
            <span>Calendário Lunar</span>
            <span>Biblioteca</span>
          </div>
        </div>

        <div className="rodape__lateral rodape__lateral--direita">
          <span>CATÁLOGO DE ESTUDOS</span>
          <strong>VII</strong>
          <span>ARTES & SÍMBOLOS</span>
        </div>
      </div>

      <div className="rodape__base">
        <span>ORACULVM · EST. MMXXVI</span>
        <span className="rodape__base-simbolo" aria-hidden="true">
          <Icon icon="game-icons:pentacle" />
        </span>
        <span>
          © {new Date().getFullYear()} ORACULVM. Todos os direitos reservados.
        </span>
      </div>
    </footer>
  );
}
