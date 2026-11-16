import "./IconePlaneta.scss";

interface Props {
  planeta: string;
  tamanho?: number;
}

const SIMBOLOS: Record<string, string> = {
  Sol: "☉",
  Lua: "☽",
  Mercúrio: "☿",
  Vênus: "♀",
  Marte: "♂",
  Júpiter: "♃",
  Saturno: "♄",
  Urano: "♅",
  Netuno: "♆",
  Plutão: "♇",
  Ascendente: "ASC",
};

export function IconePlaneta({
  planeta,
  tamanho = 36,
}: Props) {
  const simbolo = SIMBOLOS[planeta] ?? "✦";
  const ascendente = planeta === "Ascendente";

  return (
    <span
      className={`icone-planeta ${
        ascendente ? "icone-planeta--ascendente" : ""
      }`}
      style={{
        width: tamanho,
        height: tamanho,
      }}
      role="img"
      aria-label={planeta}
      title={planeta}
    >
      <svg
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        focusable="false"
      >
        <text
          x="24"
          y="25"
          textAnchor="middle"
          dominantBaseline="central"
          className="icone-planeta__simbolo"
        >
          {simbolo}
        </text>
      </svg>
    </span>
  );
}