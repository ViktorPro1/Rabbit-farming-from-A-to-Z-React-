// Проста лінійна ілюстрація-штамп кроля для картки лід-магніту.
// Самодостатній inline SVG — не залежить від зовнішніх файлів іконок.
export default function RabbitStamp() {
  return (
    <svg
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      width="100%"
      height="100%"
      role="img"
      aria-label="Ілюстрація кроля"
    >
      <circle
        cx="60"
        cy="60"
        r="56"
        fill="#eef5ec"
        stroke="#2f7a3d"
        strokeWidth="1.5"
        strokeDasharray="3 4"
      />

      {/* вуха */}
      <path
        d="M46 54 C40 30, 44 14, 51 12 C57 11, 58 26, 55 54"
        fill="#fff"
        stroke="#2f7a3d"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M74 54 C80 30, 76 14, 69 12 C63 11, 62 26, 65 54"
        fill="#fff"
        stroke="#2f7a3d"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <path
        d="M49 50 C46 33, 48 21, 52 19"
        fill="none"
        stroke="#2f7a3d"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path
        d="M71 50 C74 33, 72 21, 68 19"
        fill="none"
        stroke="#2f7a3d"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* голова */}
      <ellipse
        cx="60"
        cy="72"
        rx="22"
        ry="19"
        fill="#fff"
        stroke="#2f7a3d"
        strokeWidth="2.5"
      />
      <ellipse
        cx="60"
        cy="80"
        rx="10"
        ry="7"
        fill="#fff"
        stroke="#2f7a3d"
        strokeWidth="1.4"
        opacity="0.7"
      />

      {/* очі */}
      <circle cx="52" cy="70" r="2.1" fill="#2f7a3d" />
      <circle cx="68" cy="70" r="2.1" fill="#2f7a3d" />

      {/* ніс */}
      <path d="M57.5 76 L62.5 76 L60 79.5 Z" fill="#c47a4b" />

      {/* вуса */}
      <line
        x1="49"
        y1="79"
        x2="38"
        y2="77"
        stroke="#2f7a3d"
        strokeWidth="1"
        opacity="0.5"
      />
      <line
        x1="49"
        y1="82"
        x2="38"
        y2="83"
        stroke="#2f7a3d"
        strokeWidth="1"
        opacity="0.5"
      />
      <line
        x1="71"
        y1="79"
        x2="82"
        y2="77"
        stroke="#2f7a3d"
        strokeWidth="1"
        opacity="0.5"
      />
      <line
        x1="71"
        y1="82"
        x2="82"
        y2="83"
        stroke="#2f7a3d"
        strokeWidth="1"
        opacity="0.5"
      />

      {/* конюшина */}
      <g transform="translate(84,94) rotate(15)">
        <circle cx="-3" cy="-3" r="4" fill="#4c8c3c" opacity="0.85" />
        <circle cx="3" cy="-3" r="4" fill="#4c8c3c" opacity="0.85" />
        <circle cx="0" cy="2" r="4" fill="#4c8c3c" opacity="0.85" />
        <line x1="0" y1="4" x2="0" y2="12" stroke="#4c8c3c" strokeWidth="1.4" />
      </g>
    </svg>
  );
}
