
import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import { carregarMunicipios } from "municipios-brasil";
import type { ApiMunicipios, Municipio } from "municipios-brasil";
import { usePerfil } from "../../nucleo/contextos/PerfilContexto";
import "./ModalBoasVindas.scss";

type Etapa = "apresentacao" | "formulario";

const APRESENTACAO = [
  {
    numero: "I",
    titulo: "ORACULVM",
    subtitulo: "O COMPÊNDIO",
    texto:
      "Este é um espaço de consulta e estudo. Não há entidades, previsões infalíveis ou promessas sobrenaturais. Há símbolos, cálculos e diferentes maneiras de interpretar informações sobre você.",
    icone: "game-icons:all-seeing-eye",
  },
  {
    numero: "II",
    titulo: "Sete artes",
    subtitulo: "O ACERVO",
    texto:
      "Tarô, astrologia, numerologia, matriz do destino, signos, calendário lunar e biblioteca. Cada seção apresenta uma forma diferente de explorar tradições e sistemas simbólicos.",
    icone: "game-icons:spell-book",
  },
  {
    numero: "III",
    titulo: "Seu registro",
    subtitulo: "A CONSULTA",
    texto:
      "Algumas ferramentas utilizam seu nome, data, hora e cidade de nascimento. Você informa esses dados uma vez e pode alterá-los posteriormente.",
    icone: "game-icons:quill-ink",
  },
];

export function ModalBoasVindas() {
  const { modalAberto, atualizarPerfil, perfil, completo, fecharModal } =
    usePerfil();

  const [etapa, setEtapa] = useState<Etapa>("apresentacao");
  const [indice, setIndice] = useState(0);
  const [nome, setNome] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [buscaCidade, setBuscaCidade] = useState("");
  const [cidadeSelecionada, setCidadeSelecionada] = useState<Municipio | null>(
    null
  );
  const [api, setApi] = useState<ApiMunicipios | null>(null);
  const [aberto, setAberto] = useState(false);
  const caixaRef = useRef<HTMLDivElement>(null);

  const [originais, setOriginais] = useState({
    nome: "",
    data: "",
    hora: "",
    cidade: "",
  });

  useEffect(() => {
    carregarMunicipios().then(setApi).catch(() => setApi(null));
  }, []);

  useEffect(() => {
    if (!modalAberto) return;

    if (completo && perfil) {
      const cidadeStr = `${perfil.cidadeNome} - ${perfil.cidadeUf}`;

      setEtapa("formulario");
      setNome(perfil.nome);
      setData(perfil.dataNascimento);
      setHora(perfil.horaNascimento);
      setBuscaCidade(cidadeStr);
        setCidadeSelecionada({
          nome: perfil.cidadeNome,
          uf: perfil.cidadeUf,
          codigoIbge: 0,
        } as Municipio);

      setOriginais({
        nome: perfil.nome,
        data: perfil.dataNascimento,
        hora: perfil.horaNascimento,
        cidade: cidadeStr,
      });
    } else {
      setEtapa("apresentacao");
      setIndice(0);
      setNome("");
      setData("");
      setHora("");
      setBuscaCidade("");
      setCidadeSelecionada(null);
      setOriginais({
        nome: "",
        data: "",
        hora: "",
        cidade: "",
      });
    }

    setAberto(false);
  }, [modalAberto, completo, perfil]);

  useEffect(() => {
    if (!modalAberto) return;

    document.body.classList.add("modal-aberto");

    return () => {
      document.body.classList.remove("modal-aberto");
    };
  }, [modalAberto]);

  useEffect(() => {
    if (!modalAberto) return;

    caixaRef.current?.scrollTo({ top: 0, behavior: "instant" });
  }, [modalAberto, etapa, indice]);

  const sugestoes: Municipio[] =
    api && buscaCidade.trim().length >= 2 && !cidadeSelecionada
      ? api.buscar(buscaCidade, { limite: 8 })
      : [];

  const valido =
    nome.trim().length >= 3 &&
    data.length === 10 &&
    hora.length === 5 &&
    cidadeSelecionada !== null;

  const temAlteracao =
    nome !== originais.nome ||
    data !== originais.data ||
    hora !== originais.hora ||
    buscaCidade !== originais.cidade;

  const podeSalvar = completo ? valido && temAlteracao : valido;

  if (!modalAberto) return null;

  function proximo() {
    if (indice < APRESENTACAO.length - 1) {
      setIndice((atual) => atual + 1);
    } else {
      setEtapa("formulario");
    }
  }

  function pularApresentacao() {
    setEtapa("formulario");
  }

  function selecionarCidade(cidade: Municipio) {
    setCidadeSelecionada(cidade);
    setBuscaCidade(`${cidade.nome} - ${cidade.uf}`);
    setAberto(false);
  }

  function fechar() {
    if (completo) {
      fecharModal();
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!podeSalvar || !cidadeSelecionada) return;

    const primeiraVez = !completo;
    const primeiroNome = nome.trim().split(" ")[0];

    const mesmaCidade =
      perfil?.cidadeNome === cidadeSelecionada.nome &&
      perfil?.cidadeUf === cidadeSelecionada.uf;

    const latitude = mesmaCidade
      ? perfil.cidadeLatitude
      : Number(cidadeSelecionada.latitude ?? 0);

    const longitude = mesmaCidade
      ? perfil.cidadeLongitude
      : Number(cidadeSelecionada.longitude ?? 0);

    const fuso = mesmaCidade
      ? perfil.cidadeFuso
      : Number(cidadeSelecionada.fusoHorario ?? -3);

      atualizarPerfil({
        nome: nome.trim(),
        dataNascimento: data,
        horaNascimento: hora,
        cidadeNome: cidadeSelecionada.nome,
        cidadeUf: cidadeSelecionada.uf,
        cidadeLatitude: latitude,
        cidadeLongitude: longitude,
        cidadeFuso: fuso,
        criadoEm: perfil?.criadoEm ?? new Date().toISOString(),
      });

    if (primeiraVez) {
      toast.success(`Bem-vindo, ${primeiroNome}! Seu registro foi criado.`);
    } else {
      toast.success("Seus dados foram atualizados com sucesso.");
    }
  }

  const apresentacao = APRESENTACAO[indice];

  return (
    <div className="modal-boas-vindas">
      <div
        className="modal-boas-vindas__caixa"
        ref={caixaRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-boas-vindas-titulo"
      >
        <div className="modal-boas-vindas__moldura" aria-hidden="true" />

        {completo && (
          <button
            type="button"
            className="modal-boas-vindas__fechar"
            onClick={fechar}
            aria-label="Fechar"
          >
            <Icon icon="mdi:close" />
          </button>
        )}

        <div className="modal-boas-vindas__cabecalho">
          <span>ORACULVM</span>
        </div>

        {etapa === "apresentacao" && (
          <div className="modal-boas-vindas__etapa" key={indice}>
            <div className="modal-boas-vindas__numero">
              <span>CAPÍTULO</span>
              <strong>{apresentacao.numero}</strong>
              <span>DE III</span>
            </div>

            <div className="modal-boas-vindas__ilustracao" aria-hidden="true">
              <div className="modal-boas-vindas__circulo-externo">
                <div className="modal-boas-vindas__circulo-interno">
                  <Icon icon={apresentacao.icone} />
                </div>
              </div>

              <Icon
                icon="mdi:star-four-points"
                className="modal-boas-vindas__estrela modal-boas-vindas__estrela--esquerda"
              />
              <Icon
                icon="mdi:star-four-points"
                className="modal-boas-vindas__estrela modal-boas-vindas__estrela--direita"
              />
            </div>

            <span className="modal-boas-vindas__subtitulo">
              {apresentacao.subtitulo}
            </span>

            <h2
              className="modal-boas-vindas__titulo"
              id="modal-boas-vindas-titulo"
            >
              {apresentacao.titulo}
            </h2>

            <div className="modal-boas-vindas__divisor" aria-hidden="true">
              <span />
              <Icon icon="mdi:star-four-points" />
              <span />
            </div>

            <p className="modal-boas-vindas__texto">
              {apresentacao.texto}
            </p>

            <div className="modal-boas-vindas__progresso" aria-label="Progresso">
              {APRESENTACAO.map((item, i) => (
                <span
                  key={item.numero}
                  className={`modal-boas-vindas__ponto ${
                    i === indice ? "ativo" : ""
                  }`}
                  aria-label={`Etapa ${i + 1} de ${APRESENTACAO.length}`}
                />
              ))}
            </div>

            <div className="modal-boas-vindas__acoes">
              <button
                type="button"
                className="modal-boas-vindas__pular"
                onClick={pularApresentacao}
              >
                Pular apresentação
              </button>

              <button
                type="button"
                className="modal-boas-vindas__botao"
                onClick={proximo}
              >
                <span>
                  {indice < APRESENTACAO.length - 1
                    ? "Próximo capítulo"
                    : "Criar meu registro"}
                </span>
                <Icon icon="mdi:arrow-right" />
              </button>
            </div>
          </div>
        )}

        {etapa === "formulario" && (
          <form
            className="modal-boas-vindas__etapa modal-boas-vindas__etapa--formulario"
            onSubmit={handleSubmit}
          >
            <div className="modal-boas-vindas__numero">
              <span>REGISTRO</span>
              <strong>
                <Icon icon="game-icons:quill-ink" />
              </strong>
              <span>PESSOAL</span>
            </div>

            <span className="modal-boas-vindas__subtitulo">
              DADOS DE CONSULTA
            </span>

            <h2
              className="modal-boas-vindas__titulo"
              id="modal-boas-vindas-titulo"
            >
              {completo ? "Seu registro" : "Antes de começar"}
            </h2>

            <div className="modal-boas-vindas__divisor" aria-hidden="true">
              <span />
              <Icon icon="mdi:star-four-points" />
              <span />
            </div>

            <p className="modal-boas-vindas__texto">
              {completo
                ? "Altere as informações utilizadas nas suas consultas. Os dados permanecem salvos apenas neste navegador."
                : "Informe seus dados para utilizar as ferramentas que dependem de informações de nascimento."}
            </p>

            <div className="modal-boas-vindas__formulario">
              <div className="modal-boas-vindas__campo">
                <label htmlFor="modal-nome">Nome completo</label>
                <input
                  id="modal-nome"
                  type="text"
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                  placeholder="Seu nome completo"
                  autoComplete="name"
                  required
                />
              </div>

              <div className="modal-boas-vindas__linha">
                <div className="modal-boas-vindas__campo">
                  <label htmlFor="modal-data">Data de nascimento</label>
                  <input
                    id="modal-data"
                    type="date"
                    value={data}
                    onChange={(event) => setData(event.target.value)}
                    required
                  />
                </div>

                <div className="modal-boas-vindas__campo">
                  <label htmlFor="modal-hora">Hora de nascimento</label>
                  <input
                    id="modal-hora"
                    type="time"
                    value={hora}
                    onChange={(event) => setHora(event.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="modal-boas-vindas__campo modal-boas-vindas__cidade">
                <label htmlFor="modal-cidade">Cidade de nascimento</label>
                <input
                  id="modal-cidade"
                  type="text"
                  value={buscaCidade}
                  onChange={(event) => {
                    setBuscaCidade(event.target.value);
                    setCidadeSelecionada(null);
                    setAberto(true);
                  }}
                  onFocus={() => setAberto(true)}
                  onBlur={() => setAberto(false)}
                  placeholder="Busque sua cidade"
                  autoComplete="off"
                  required
                  role="combobox"
                  aria-expanded={aberto && sugestoes.length > 0}
                  aria-controls="modal-sugestoes-cidades"
                />

                {aberto && sugestoes.length > 0 && (
                  <ul
                    className="modal-boas-vindas__sugestoes"
                    id="modal-sugestoes-cidades"
                    role="listbox"
                  >
                    {sugestoes.map((cidade) => (
                      <li key={cidade.codigoIbge} role="option" aria-selected={false}>
                        <button
                          type="button"
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => selecionarCidade(cidade)}
                        >
                          <Icon icon="mdi:map-marker-outline" />
                          <span>{cidade.nome}</span>
                          <span className="modal-boas-vindas__uf">
                            {cidade.uf}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="modal-boas-vindas__botao modal-boas-vindas__botao--salvar"
              disabled={!podeSalvar}
            >
              <span>{completo ? "Salvar alterações" : "Concluir registro"}</span>
              <Icon icon="mdi:check" />
            </button>
          </form>
        )}

        <div className="modal-boas-vindas__rodape">
          <span>ARS · SCIENTIA · SYMBOLVM</span>
          <Icon icon="mdi:star-four-points" />
          <span>EST. MMXXVI</span>
        </div>
      </div>
    </div>
  );
}
