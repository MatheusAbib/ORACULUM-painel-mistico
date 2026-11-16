import { Icon } from "@iconify/react";
import "./FichaBiblioteca.scss";

export interface FichaItem {
  nome: string;
  icone: string;
  extra?: string;
  descricao: string;
  meta: { rotulo: string; valor: string }[];
  propriedades: string[];
  uso: string;
  cuidados?: string;
}

export function FichaBiblioteca({ item }: { item: FichaItem }) {
  return (
    <article className="ficha-biblioteca">
      <div className="ficha-biblioteca__topo">
        <div className="ficha-biblioteca__icone">
          <Icon icon={item.icone} width={32} />
        </div>

        <div className="ficha-biblioteca__identidade">
          <h3 className="ficha-biblioteca__nome">{item.nome}</h3>

          {item.extra && (
            <span className="ficha-biblioteca__extra">
              {item.extra}
            </span>
          )}
        </div>
      </div>

      <p className="ficha-biblioteca__descricao">
        {item.descricao}
      </p>

      <div className="ficha-biblioteca__meta">
        {item.meta.map((meta) => (
          <div
            key={meta.rotulo}
            className="ficha-biblioteca__meta-item"
          >
            <span className="ficha-biblioteca__meta-rotulo">
              {meta.rotulo}
            </span>

            <span className="ficha-biblioteca__meta-valor">
              {meta.valor}
            </span>
          </div>
        ))}
      </div>

      <div className="ficha-biblioteca__props">
        {item.propriedades.map((propriedade) => (
          <span
            key={propriedade}
            className="ficha-biblioteca__tag"
          >
            {propriedade}
          </span>
        ))}
      </div>

      <div className="ficha-biblioteca__bloco">
        <div className="ficha-biblioteca__bloco-cabecalho">
          <Icon icon="mdi:book-open-page-variant-outline" />

          <span className="ficha-biblioteca__bloco-rotulo">
            Como usar
          </span>
        </div>

        <p className="ficha-biblioteca__bloco-texto">
          {item.uso}
        </p>
      </div>

      {item.cuidados && (
        <div className="ficha-biblioteca__cuidados">
          <Icon icon="mdi:alert-outline" />

          <div className="ficha-biblioteca__cuidados-conteudo">
            <span className="ficha-biblioteca__cuidados-rotulo">
              Cuidados
            </span>

            <p>{item.cuidados}</p>
          </div>
        </div>
      )}
    </article>
  );
}