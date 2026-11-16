import { useRef, useState } from "react";
import { Icon } from "@iconify/react";
import { ListaBiblioteca } from "./componentes/ListaBiblioteca";
import type { FichaItem } from "./componentes/FichaBiblioteca";
import { CRISTAIS } from "./dados/cristais";
import { ERVAS } from "./dados/ervas";
import { VELAS } from "./dados/velas";
import { CHAKRAS } from "./dados/chakras";
import { ELEMENTOS } from "./dados/elementos";
import { BANHOS } from "./dados/banhos";
import { INCENSOS } from "./dados/incensos";
import "./PainelBiblioteca.scss";

type Secao =
  | "cristais"
  | "ervas"
  | "incensos"
  | "velas"
  | "chakras"
  | "elementos"
  | "banhos";

interface AbaInfo {
  id: Secao;
  rotulo: string;
  titulo: string;
  subtitulo: string;
  icone: string;
  fichas: FichaItem[];
}

export function PainelBiblioteca() {
  const [secao, setSecao] = useState<Secao>("cristais");
  const listagemRef = useRef<HTMLDivElement>(null);

  const selecionarCategoria = (categoria: Secao) => {
    setSecao(categoria);

    const movimentoReduzido = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    listagemRef.current?.scrollIntoView({
      behavior: movimentoReduzido ? "instant" : "smooth",
      block: "start",
    });
  };

  const fichasCristais: FichaItem[] = CRISTAIS.map((c) => ({
    nome: c.nome,
    icone: c.icone,
    descricao: c.descricao,
    propriedades: c.propriedades,
    uso: c.uso,
    cuidados: c.cuidados,
    meta: [
      { rotulo: "Cor", valor: c.cor },
      { rotulo: "Elemento", valor: c.elemento },
      { rotulo: "Chakra", valor: c.chakra },
    ],
  }));

  const fichasErvas: FichaItem[] = ERVAS.map((e) => ({
    nome: e.nome,
    icone: e.icone,
    extra: e.nomeCientifico,
    descricao: e.descricao,
    propriedades: e.propriedades,
    uso: e.uso,
    cuidados: e.cuidados,
    meta: [
      { rotulo: "Elemento", valor: e.elemento },
      { rotulo: "Planeta", valor: e.planeta },
    ],
  }));

  const fichasIncensos: FichaItem[] = INCENSOS.map((i) => ({
    nome: i.nome,
    icone: i.icone,
    extra: i.origem,
    descricao: i.descricao,
    propriedades: i.propriedades,
    uso: i.uso,
    cuidados: i.cuidados,
    meta: [
      { rotulo: "Elemento", valor: i.elemento },
      { rotulo: "Planeta", valor: i.planeta },
    ],
  }));

  const fichasVelas: FichaItem[] = VELAS.map((v) => ({
    nome: v.nome,
    icone: v.icone,
    extra: v.cor,
    descricao: v.descricao,
    propriedades: v.propriedades,
    uso: v.uso,
    cuidados: v.cuidados,
    meta: [
      { rotulo: "Cor", valor: v.cor },
      { rotulo: "Elemento", valor: v.elemento },
    ],
  }));

  const fichasChakras: FichaItem[] = CHAKRAS.map((c) => ({
    nome: c.nome,
    icone: c.icone,
    extra: c.numero,
    descricao: c.descricao,
    propriedades: c.propriedades,
    uso: c.uso,
    cuidados: c.cuidados,
    meta: [
      { rotulo: "Cor", valor: c.cor },
      { rotulo: "Elemento", valor: c.elemento },
    ],
  }));

  const fichasElementos: FichaItem[] = ELEMENTOS.map((e) => ({
    nome: e.nome,
    icone: e.icone,
    extra: e.direcao,
    descricao: e.descricao,
    propriedades: e.propriedades,
    uso: e.uso,
    cuidados: e.cuidados,
    meta: [
      { rotulo: "Cor", valor: e.cor },
      { rotulo: "Direção", valor: e.direcao },
    ],
  }));

  const fichasBanhos: FichaItem[] = BANHOS.map((b) => ({
    nome: b.nome,
    icone: b.icone,
    extra: b.objetivo,
    descricao: b.descricao,
    propriedades: b.propriedades,
    uso: b.uso,
    cuidados: b.cuidados,
    meta: [{ rotulo: "Objetivo", valor: b.objetivo }],
  }));

  const abas: AbaInfo[] = [
    {
      id: "cristais",
      rotulo: "Cristais",
      titulo: "Cristais",
      subtitulo: "Pedras e minerais com suas propriedades energéticas.",
      icone: "mdi:diamond-stone",
      fichas: fichasCristais,
    },
    {
      id: "ervas",
      rotulo: "Ervas",
      titulo: "Ervas",
      subtitulo: "Plantas e ervas com usos ritualísticos e medicinais.",
      icone: "mdi:leaf",
      fichas: fichasErvas,
    },
    {
      id: "incensos",
      rotulo: "Incensos",
      titulo: "Incensos e Resinas",
      subtitulo: "Resinas e madeiras para defumação e limpeza energética.",
      icone: "mdi:weather-windy",
      fichas: fichasIncensos,
    },
    {
      id: "velas",
      rotulo: "Velas",
      titulo: "Velas e Cores",
      subtitulo: "Significado de cada cor de vela e como usar em rituais.",
      icone: "mdi:candle",
      fichas: fichasVelas,
    },
    {
      id: "chakras",
      rotulo: "Chakras",
      titulo: "Chakras",
      subtitulo: "Os 7 centros de energia e como trabalhá-los.",
      icone: "mdi:circle-slice-8",
      fichas: fichasChakras,
    },
    {
      id: "elementos",
      rotulo: "Elementos",
      titulo: "Elementos",
      subtitulo: "Terra, Água, Fogo, Ar e Éter — suas forças e aplicações.",
      icone: "mdi:creation",
      fichas: fichasElementos,
    },
    {
      id: "banhos",
      rotulo: "Banhos",
      titulo: "Banhos e Defumações",
      subtitulo: "Receitas tradicionais de banhos energéticos por objetivo.",
      icone: "mdi:water-outline",
      fichas: fichasBanhos,
    },
  ];

  const abaAtiva = abas.find((a) => a.id === secao) ?? abas[0];

  return (
    <section className="painel-biblioteca">
      <header className="painel-biblioteca__cabecalho">
        <div className="painel-biblioteca__identificacao">
          <span>ORACULVM · COMPÊNDIO ESOTÉRICO</span>
          <span>ARQUIVO DE CONHECIMENTOS</span>
        </div>

        <div className="painel-biblioteca__apresentacao">
          <div className="painel-biblioteca__emblema" aria-hidden="true">
            <div className="painel-biblioteca__emblema-anel">
              <Icon icon="mdi:star-four-points" />
            </div>

            <Icon icon="mdi:book-open-page-variant-outline" />
          </div>

          <span className="painel-biblioteca__sobretitulo">
            O COMPÊNDIO DO ORACULVM
          </span>

          <h2 className="painel-biblioteca__titulo">
            Biblioteca
          </h2>

          <div className="painel-biblioteca__divisor" aria-hidden="true">
            <span />
            <Icon icon="mdi:star-four-points" />
            <span />
          </div>

          <p className="painel-biblioteca__subtitulo">
            Conhecimento esotérico sobre cristais, ervas, incensos,
            velas, chakras, elementos e banhos — propriedades,
            usos e correspondências.
          </p>
        </div>
      </header>

      <div className="painel-biblioteca__conteudo">
        <div className="painel-biblioteca__secao-cabecalho">
          <span>FIGURA I · ÍNDICE DO COMPÊNDIO</span>
          <span>VII CATEGORIAS</span>
        </div>

        <div className="painel-biblioteca__secao-introducao">
          <span className="painel-biblioteca__secao-rotulo">
            OS CAMPOS DO CONHECIMENTO
          </span>

          <h3 className="painel-biblioteca__secao-titulo">
            Explore a Biblioteca
          </h3>
        </div>

        <div
          className="painel-biblioteca__seletor"
          aria-label="Categorias da biblioteca"
        >
          {abas.map((aba, indice) => (
            <button
              key={aba.id}
              type="button"
              className={`painel-biblioteca__opcao ${
                secao === aba.id ? "ativa" : ""
              }`}
              onClick={() => selecionarCategoria(aba.id)}
              aria-pressed={secao === aba.id}
            >
              <span className="painel-biblioteca__opcao-numero">
                {String(indice + 1).padStart(2, "0")}
              </span>

              <Icon
                icon={aba.icone}
                className="painel-biblioteca__opcao-icone"
              />

              <span className="painel-biblioteca__opcao-nome">
                {aba.rotulo}
              </span>
            </button>
          ))}
        </div>

        <div
          ref={listagemRef}
          className="painel-biblioteca__listagem"
          style={{ scrollMarginTop: "110px" }}
        >
          <div className="painel-biblioteca__secao-cabecalho">
            <span>FIGURA II · FICHÁRIO ESOTÉRICO</span>
            <span>{abaAtiva.rotulo.toUpperCase()}</span>
          </div>

          <ListaBiblioteca
            key={abaAtiva.id}
            titulo={abaAtiva.titulo}
            subtitulo={abaAtiva.subtitulo}
            itens={abaAtiva.fichas}
          />
        </div>

        <footer className="painel-biblioteca__rodape">
          <Icon icon="mdi:star-four-points" />
          <span>ORACULVM · COMPÊNDIO DE CONHECIMENTOS</span>
          <Icon icon="mdi:star-four-points" />
        </footer>
      </div>
    </section>
  );
}