import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { useMatrizDestino } from "./ganchos/useMatrizDestino";
import { usePerfil } from "../../nucleo/contextos/PerfilContexto";
import { AvisoPreencherPerfil } from "../../compartilhado/componentes/AvisoPreencherPerfil";
import { DiagramaMatriz } from "./componentes/DiagramaMatriz";
import { ModalMatriz } from "./componentes/ModalMatriz";
import "./PainelMatrizDestino.scss";

export function PainelMatrizDestino() {
  const { perfil, completo } = usePerfil();
  const { resultado, erro, calcular } = useMatrizDestino();
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    if (completo && perfil && !resultado) {
      calcular({
        nome: perfil.nome,
        dataNascimento: perfil.dataNascimento,
      });
    }
  }, [completo, perfil, resultado, calcular]);

  if (!completo) {
    return (
      <div className="painel-matriz-destino">
        <AvisoPreencherPerfil
          titulo="Matriz do Destino"
          descricao="Informe seu nome e sua data de nascimento no perfil para calcular sua Matriz do Destino."
          icone="mdi:shape-outline"
        />
      </div>
    );
  }

  return (
    <section className="painel-matriz-destino">
      <header className="painel-matriz-destino__cabecalho">
        <div className="painel-matriz-destino__identificacao">
          <span>ORACULVM · ESTUDO DOS ARCANOS</span>
          <span>TRATADO IV</span>
        </div>

        <div className="painel-matriz-destino__apresentacao">
          <div
            className="painel-matriz-destino__emblema"
            aria-hidden="true"
          >
            <span className="painel-matriz-destino__emblema-anel">
              <Icon icon="mdi:shape-outline" />
            </span>

            <span className="painel-matriz-destino__emblema-numero">
              XXII
            </span>
          </div>

          <span className="painel-matriz-destino__rotulo">
            OS VINTE E DOIS ARCANOS
          </span>

          <h2 className="painel-matriz-destino__titulo">
            Matriz do Destino
          </h2>

          <div
            className="painel-matriz-destino__divisor"
            aria-hidden="true"
          >
            <span />
            <Icon icon="mdi:star-four-points" />
            <span />
          </div>

          <p className="painel-matriz-destino__descricao">
            Uma representação numerológica baseada nos vinte e dois
            arcanos maiores. Cada posição da matriz corresponde a
            uma área da vida e recebe um número calculado a partir
            da sua data de nascimento.
          </p>

          <button
            type="button"
            className="painel-matriz-destino__info"
            onClick={() => setModalAberto(true)}
          >
            <Icon icon="mdi:information-outline" />
            <span>Como funciona a Matriz do Destino?</span>
          </button>
        </div>
      </header>

      {erro && (
        <div className="painel-matriz-destino__erro" role="alert">
          <Icon icon="mdi:alert-circle-outline" />
          <span>{erro}</span>
        </div>
      )}

      {resultado && (
        <section className="painel-matriz-destino__conteudo">
          <div className="painel-matriz-destino__conteudo-cabecalho">
            <span>FIGURA I · DIAGRAMA DOS ARCANOS</span>
            <span>MAPA PESSOAL</span>
          </div>

          <div className="painel-matriz-destino__conteudo-introducao">
            <span className="painel-matriz-destino__conteudo-rotulo">
              A CONFIGURAÇÃO DOS ARCANOS
            </span>

            <h3 className="painel-matriz-destino__conteudo-titulo">
              Sua Matriz Pessoal
            </h3>
          </div>

          <DiagramaMatriz pontos={resultado} />

          <div className="painel-matriz-destino__conteudo-rodape">
            <Icon icon="mdi:star-four-points" />
            <span>ORACULVM · MATRIZ DO DESTINO</span>
            <Icon icon="mdi:star-four-points" />
          </div>
        </section>
      )}

      <ModalMatriz
        aberto={modalAberto}
        aoFechar={() => setModalAberto(false)}
        dataNascimento={perfil?.dataNascimento ?? ""}
      />
    </section>
  );
}