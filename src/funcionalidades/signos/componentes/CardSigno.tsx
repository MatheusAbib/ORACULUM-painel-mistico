import type { Signo } from "../dados/signos";
import { IconeSigno } from "../../astrologia/componentes/IconeSigno";
import "./CardSigno.scss";

interface Props {
  signo: Signo;
  ativo: boolean;
  aoClicar: () => void;
}

export function CardSigno({ signo, ativo, aoClicar }: Props) {
  return (
    <button
      type="button"
      className={`card-signo ${ativo ? "ativo" : ""}`}
      onClick={aoClicar}
      aria-pressed={ativo}
    >
      <div className="card-signo__topo">
        <span className="card-signo__categoria">SIGNO ZODIACAL</span>
        <span className="card-signo__marcador" aria-hidden="true" />
      </div>

      <div className="card-signo__simbolo" aria-hidden="true">
        <span className="card-signo__simbolo-anel">
          <IconeSigno signo={signo.nome} tamanho={56} />
        </span>
      </div>

      <div className="card-signo__informacoes">
        <h3 className="card-signo__nome">{signo.nome}</h3>

        <p className="card-signo__elemento">
          {signo.elemento} <span aria-hidden="true">·</span> {signo.modalidade}
        </p>

        <div className="card-signo__separador" aria-hidden="true">
          <span />
          <span className="card-signo__losango" />
          <span />
        </div>

        <p className="card-signo__datas">
          {signo.dataInicio} — {signo.dataFim}
        </p>
      </div>

      <div className="card-signo__rodape">
        <span>{ativo ? "SIGNO SELECIONADO" : "EXPLORAR SIGNO"}</span>
        <span className="card-signo__seta" aria-hidden="true">
          {ativo ? "−" : "+"}
        </span>
      </div>
    </button>
  );
}