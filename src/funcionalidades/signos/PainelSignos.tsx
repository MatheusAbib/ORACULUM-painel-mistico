import { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { SIGNOS } from "./dados/signos";
import type { Signo } from "./dados/signos";
import { signoPorData } from "./dados/signoPorData";
import { usePerfil } from "../../nucleo/contextos/PerfilContexto";
import { CardSigno } from "./componentes/CardSigno";
import { DetalheSigno } from "./componentes/DetalheSigno";
import { ModalSignos } from "./componentes/ModalSignos";
import "./PainelSignos.scss";

export function PainelSignos() {
  const { perfil, completo } = usePerfil();

  const [signoAtivo, setSignoAtivo] = useState<Signo | null>(null);
  const [modalAberto, setModalAberto] = useState(false);

  const detalheRef = useRef<HTMLDivElement>(null);
  const rolarParaDetalheRef = useRef(false);

  useEffect(() => {
    if (completo && perfil && !signoAtivo) {
      const signo = signoPorData(perfil.dataNascimento);

      if (signo) {
        setSignoAtivo(signo);
      }
    }
  }, [completo, perfil, signoAtivo]);

  useEffect(() => {
    if (!signoAtivo || !rolarParaDetalheRef.current) {
      return;
    }

    rolarParaDetalheRef.current = false;

    const frame = requestAnimationFrame(() => {
      detalheRef.current?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "start",
      });
    });

    return () => cancelAnimationFrame(frame);
  }, [signoAtivo]);

  const selecionarSigno = (signo: Signo) => {
    rolarParaDetalheRef.current = true;
    setSignoAtivo(signo);
  };

  return (
    <section className="painel-signos">
      <header className="painel-signos__cabecalho">
        <div className="painel-signos__identificacao">
          <span>ORACULVM · ESTUDO DOS SIGNOS</span>
          <span>TRATADO ZODIACAL</span>
        </div>

        <div className="painel-signos__apresentacao">
          <div className="painel-signos__emblema" aria-hidden="true">
            <Icon icon="mdi:zodiac-aries" />
            <span>XII</span>
          </div>

          <span className="painel-signos__rotulo">
            O CÍRCULO ZODIACAL
          </span>

          <h2 className="painel-signos__titulo">
            Os Doze Signos
          </h2>

          <div className="painel-signos__divisor" aria-hidden="true">
            <span />
            <Icon icon="mdi:star-four-points" />
            <span />
          </div>

          <p className="painel-signos__descricao">
            Os doze signos representam diferentes expressões da
            natureza humana. Cada um possui características,
            elementos e influências próprias dentro da tradição
            astrológica.
          </p>

          <button
            type="button"
            className="painel-signos__info"
            onClick={() => setModalAberto(true)}
          >
            <Icon icon="mdi:information-outline" />
            <span>Como funcionam os signos?</span>
            <Icon icon="mdi:arrow-right" />
          </button>
        </div>
      </header>

      <div className="painel-signos__conteudo">
        <div className="painel-signos__secao-cabecalho">
          <span>FIGURA I · OS DOZE SIGNOS</span>
          <span>CATÁLOGO ZODIACAL</span>
        </div>

        <div className="painel-signos__secao-introducao">
          <div>
            <span className="painel-signos__secao-rotulo">
              OS ARQUÉTIPOS CELESTES
            </span>

            <h3 className="painel-signos__secao-titulo">
              Explore o Zodíaco
            </h3>
          </div>
        </div>

        <div className="painel-signos__grade">
          {SIGNOS.map((signo) => (
            <CardSigno
              key={signo.nome}
              signo={signo}
              ativo={signoAtivo?.nome === signo.nome}
              aoClicar={() => selecionarSigno(signo)}
            />
          ))}
        </div>

        {signoAtivo && (
          <div
            ref={detalheRef}
            className="painel-signos__detalhe"
            key={signoAtivo.nome}
            style={{ scrollMarginTop: "120px" }}
          >
            <div className="painel-signos__detalhe-cabecalho">
              <span>FIGURA II · INTERPRETAÇÃO ZODIACAL</span>
              <span>SIGNO SELECIONADO</span>
            </div>

            <DetalheSigno signo={signoAtivo} />
          </div>
        )}

        <footer className="painel-signos__rodape">
          <Icon icon="mdi:star-four-points" />
          <span>ORACULVM · O CÍRCULO DOS DOZE SIGNOS</span>
          <Icon icon="mdi:star-four-points" />
        </footer>
      </div>

      <ModalSignos
        aberto={modalAberto}
        aoFechar={() => setModalAberto(false)}
      />
    </section>
  );
}