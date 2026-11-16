import { useMemo, useState, useEffect, useRef } from "react";
import { Icon } from "@iconify/react";
import { FichaBiblioteca, type FichaItem } from "./FichaBiblioteca";
import "./ListaBiblioteca.scss";

interface Props {
  titulo: string;
  subtitulo: string;
  itens: FichaItem[];
}

const POR_PAGINA_DESKTOP = 12;
const POR_PAGINA_MOBILE = 6;

function usarPorPagina() {
  const [porPagina, setPorPagina] = useState(
    typeof window !== "undefined" && window.innerWidth <= 768
      ? POR_PAGINA_MOBILE
      : POR_PAGINA_DESKTOP
  );

  useEffect(() => {
    function atualizar() {
      setPorPagina(
        window.innerWidth <= 768
          ? POR_PAGINA_MOBILE
          : POR_PAGINA_DESKTOP
      );
    }

    window.addEventListener("resize", atualizar);

    return () => window.removeEventListener("resize", atualizar);
  }, []);

  return porPagina;
}

export function ListaBiblioteca({ titulo, subtitulo, itens }: Props) {
  const [busca, setBusca] = useState("");
  const [pagina, setPagina] = useState(1);
  const porPagina = usarPorPagina();
  const listaRef = useRef<HTMLElement>(null);

  const filtrados = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");

    if (!termo) return itens;

    return itens.filter((item) => {
      const alvo = [
        item.nome,
        item.extra ?? "",
        ...item.propriedades,
        ...item.meta.map((meta) => meta.valor),
      ]
        .join(" ")
        .toLocaleLowerCase("pt-BR");

      return alvo.includes(termo);
    });
  }, [itens, busca]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(filtrados.length / porPagina)
  );

  const paginaAtual = Math.min(pagina, totalPaginas);
  const inicio = (paginaAtual - 1) * porPagina;
  const itensPagina = filtrados.slice(inicio, inicio + porPagina);

  useEffect(() => {
    setPagina(1);
  }, [busca, itens]);

  function irPara(novaPagina: number) {
    if (
      novaPagina < 1 ||
      novaPagina > totalPaginas ||
      novaPagina === paginaAtual
    ) {
      return;
    }

    setPagina(novaPagina);

    window.requestAnimationFrame(() => {
      listaRef.current?.scrollIntoView({
        behavior: window.matchMedia(
          "(prefers-reduced-motion: reduce)"
        ).matches
          ? "auto"
          : "smooth",
        block: "start",
      });
    });
  }

  function paginasVisiveis(): (number | "…")[] {
    if (totalPaginas <= 7) {
      return Array.from(
        { length: totalPaginas },
        (_, indice) => indice + 1
      );
    }

    const paginas: (number | "…")[] = [1];

    if (paginaAtual > 3) {
      paginas.push("…");
    }

    const inicio = Math.max(2, paginaAtual - 1);
    const fim = Math.min(totalPaginas - 1, paginaAtual + 1);

    for (let indice = inicio; indice <= fim; indice++) {
      paginas.push(indice);
    }

    if (paginaAtual < totalPaginas - 2) {
      paginas.push("…");
    }

    paginas.push(totalPaginas);

    return paginas;
  }

  return (
    <section className="lista-biblioteca" ref={listaRef}>
      <header className="lista-biblioteca__cabecalho">
        <div className="lista-biblioteca__cabecalho-info">
          <div className="lista-biblioteca__titulo-area">
            <span className="lista-biblioteca__sobretitulo">
              CATÁLOGO DE CONHECIMENTOS
            </span>

            <h2 className="lista-biblioteca__titulo">
              {titulo}
            </h2>
          </div>

          <div className="lista-biblioteca__contagem">
            <Icon icon="mdi:book-open-page-variant-outline" />

            <span>
              {filtrados.length}{" "}
              {filtrados.length === 1 ? "ficha" : "fichas"}
              {busca && ` de ${itens.length}`}
            </span>
          </div>
        </div>

        <p className="lista-biblioteca__subtitulo">
          {subtitulo}
        </p>
      </header>

      <div className="lista-biblioteca__ferramentas">
        <div className="lista-biblioteca__busca">
          <Icon
            icon="mdi:magnify"
            className="lista-biblioteca__busca-icone"
          />

          <input
            type="search"
            value={busca}
            onChange={(evento) => setBusca(evento.target.value)}
            placeholder={`Buscar em ${titulo.toLowerCase()}...`}
            aria-label={`Buscar em ${titulo}`}
          />

          {busca && (
            <button
              type="button"
              className="lista-biblioteca__busca-limpar"
              onClick={() => setBusca("")}
              aria-label="Limpar busca"
            >
              <Icon icon="mdi:close" />
            </button>
          )}
        </div>

        <span className="lista-biblioteca__ferramentas-indice">
          {String(filtrados.length).padStart(2, "0")} REGISTROS
        </span>
      </div>

      {filtrados.length === 0 ? (
        <div className="lista-biblioteca__vazio">
          <Icon icon="mdi:book-search-outline" />

          <h3>Nenhuma ficha encontrada</h3>

          <p>
            Não encontramos resultados para "{busca}".
          </p>

          <button
            type="button"
            onClick={() => setBusca("")}
          >
            Limpar busca
          </button>
        </div>
      ) : (
        <>
          <div className="lista-biblioteca__grade">
            {itensPagina.map((item) => (
              <FichaBiblioteca
                key={item.nome}
                item={item}
              />
            ))}
          </div>

          {totalPaginas > 1 && (
            <nav
              className="lista-biblioteca__paginacao"
              aria-label="Paginação da biblioteca"
            >
              <button
                type="button"
                className="lista-biblioteca__pag-btn lista-biblioteca__pag-btn--seta"
                onClick={() => irPara(paginaAtual - 1)}
                disabled={paginaAtual === 1}
                aria-label="Página anterior"
              >
                <Icon icon="mdi:chevron-left" />
              </button>

              {paginasVisiveis().map((paginaVisivel, indice) =>
                paginaVisivel === "…" ? (
                  <span
                    key={`ellipsis-${indice}`}
                    className="lista-biblioteca__pag-ellipsis"
                  >
                    …
                  </span>
                ) : (
                  <button
                    key={paginaVisivel}
                    type="button"
                    className={`lista-biblioteca__pag-btn ${
                      paginaVisivel === paginaAtual ? "ativa" : ""
                    }`}
                    onClick={() => irPara(paginaVisivel)}
                    aria-current={
                      paginaVisivel === paginaAtual
                        ? "page"
                        : undefined
                    }
                    aria-label={`Página ${paginaVisivel}`}
                  >
                    {paginaVisivel}
                  </button>
                )
              )}

              <button
                type="button"
                className="lista-biblioteca__pag-btn lista-biblioteca__pag-btn--seta"
                onClick={() => irPara(paginaAtual + 1)}
                disabled={paginaAtual === totalPaginas}
                aria-label="Próxima página"
              >
                <Icon icon="mdi:chevron-right" />
              </button>
            </nav>
          )}

          <div className="lista-biblioteca__rodape">
            <span>
              EXIBINDO {inicio + 1}–
              {Math.min(inicio + porPagina, filtrados.length)} DE{" "}
              {filtrados.length} REGISTROS
            </span>

            {totalPaginas > 1 && (
              <span>
                PÁGINA {paginaAtual} DE {totalPaginas}
              </span>
            )}
          </div>
        </>
      )}
    </section>
  );
}