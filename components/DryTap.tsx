// A dry kegerator tap over a sad, empty pint. Every few seconds someone pulls
// the handle hopefully and gets exactly one drop. Shown in the home page's
// On Tap section when nothing is pouring. Animations stop under
// prefers-reduced-motion, leaving the last drop hanging from the spout.

const FOAM = '#f3ead3'

// Every step of the pull → drop → splash loop shares one duration so they
// stay in sync
const styles = `
.dry-handle {
  transform-box: view-box;
  transform-origin: 63px 42px;
  animation: dry-handle 4.5s ease-in-out infinite;
}
.dry-drop {
  transform-box: fill-box;
  transform-origin: 50% 0%;
  animation: dry-drop 4.5s ease-out infinite;
}
.dry-splash {
  opacity: 0;
  transform-box: fill-box;
  animation: dry-splash 4.5s ease-out infinite;
}
.dry-ripple {
  opacity: 0;
  transform-box: fill-box;
  transform-origin: center;
  animation: dry-ripple 4.5s ease-out infinite;
}
.dry-tear { animation: dry-tear 3s ease-in infinite; }
@keyframes dry-handle {
  0%, 100% { transform: rotate(0deg); }
  10%, 38% { transform: rotate(22deg); }
  50% { transform: rotate(0deg); }
}
@keyframes dry-drop {
  0%, 16% { transform: translateY(0) scale(0); opacity: 1; }
  36% { transform: translateY(0) scale(1); }
  40% {
    transform: translateY(1px) scale(0.9, 1.15);
    animation-timing-function: cubic-bezier(0.5, 0, 1, 1);
  }
  52% { transform: translateY(86px) scale(1); opacity: 1; }
  53%, 100% { transform: translateY(86px) scale(0); opacity: 0; }
}
@keyframes dry-splash {
  0%, 52% { transform: translate(0, 0); opacity: 0; }
  54% { opacity: 1; }
  64% { transform: translate(var(--dx), -6px); opacity: 1; }
  74%, 100% { transform: translate(calc(var(--dx) * 1.5), 0); opacity: 0; }
}
@keyframes dry-ripple {
  0%, 52% { transform: scale(0.3); opacity: 0; }
  53% { opacity: 0.9; }
  76%, 100% { transform: scale(1.7); opacity: 0; }
}
@keyframes dry-tear {
  0% { transform: translateY(0); opacity: 0; }
  15% { opacity: 0.9; }
  70% { transform: translateY(9px); opacity: 0.9; }
  100% { transform: translateY(12px); opacity: 0; }
}
@media (prefers-reduced-motion: reduce) {
  .dry-handle, .dry-drop, .dry-splash, .dry-ripple, .dry-tear {
    animation: none !important;
  }
}
`

export default function DryTap({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 192"
      fill="none"
      className={className}
      role="img"
      aria-label="A dry beer tap over an empty pint glass with a sad face"
    >
      <style>{styles}</style>
      <defs>
        <linearGradient id="dry-chrome" x1="0" y1="0" x2="1" y2="0">
          <stop
            offset="0"
            style={{ stopColor: 'rgb(var(--color-lavender-light))' }}
          />
          <stop
            offset="1"
            style={{ stopColor: 'rgb(var(--color-lavender-dark))' }}
          />
        </linearGradient>
        <linearGradient id="dry-beer" x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0"
            style={{ stopColor: 'rgb(var(--color-accent-light))' }}
          />
          <stop offset="1" style={{ stopColor: 'rgb(var(--color-accent))' }} />
        </linearGradient>
        <filter id="dry-glow" x="-100%" y="-100%" width="300%" height="300%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.6 0"
            result="glow"
          />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Tower */}
      <rect
        x="10"
        y="24"
        width="22"
        height="152"
        className="fill-bg-hover stroke-border"
        strokeWidth="1.5"
      />
      <rect x="7" y="17" width="28" height="9" rx="3" fill="url(#dry-chrome)" />
      <rect
        x="10"
        y="33"
        width="22"
        height="3"
        className="fill-accent"
        opacity="0.8"
      />
      <path
        d="M16 44 L16 166"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.07"
      />

      {/* Shank, faucet body, and spout */}
      <rect
        x="31"
        y="47"
        width="26"
        height="8"
        rx="1.5"
        fill="url(#dry-chrome)"
      />
      <rect
        x="54"
        y="41"
        width="18"
        height="17"
        rx="5"
        fill="url(#dry-chrome)"
      />
      <rect
        x="59.5"
        y="56"
        width="7"
        height="18"
        rx="2"
        fill="url(#dry-chrome)"
      />
      <path
        d="M57 45 L57 53"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.5"
      />

      {/* Tap handle, pulled forward hopefully */}
      <g className="dry-handle">
        <rect
          x="58"
          y="36"
          width="10"
          height="7"
          rx="1.5"
          fill="url(#dry-chrome)"
        />
        <path
          d="M57.5 37 L55 8 Q55 3.5 59.5 3.5 L66.5 3.5 Q71 3.5 71 8 L68.5 37 Z"
          className="fill-bg-card stroke-accent"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
        <rect
          x="55.6"
          y="11"
          width="14.8"
          height="3.2"
          className="fill-accent"
        />
        <rect
          x="56.9"
          y="27"
          width="12.2"
          height="2.2"
          className="fill-lavender"
        />
        <path
          d="M59 17 L60 33"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.2"
        />
      </g>

      {/* Drip tray */}
      <rect
        x="4"
        y="176"
        width="92"
        height="11"
        rx="2"
        className="fill-bg-hover stroke-border"
        strokeWidth="1.2"
      />
      {Array.from({ length: 10 }, (_, i) => 12 + i * 8.5).map((x) => (
        <path
          key={x}
          d={`M${x} 179 L${x} 184`}
          className="stroke-border"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ))}

      {/* The last drop */}
      <g transform="translate(63 74)" filter="url(#dry-glow)">
        <path
          d="M0 0 C1.5 2.5 4 4.5 4 6.5 A4 4 0 0 1 -4 6.5 C-4 4.5 -1.5 2.5 0 0 Z"
          fill="url(#dry-beer)"
          className="dry-drop"
        />
      </g>

      {/* The glass: dregs, dried foam lacing, and a splash when the drop
          lands */}
      <path
        d="M37 100 L44 172 Q44.6 176 48.5 176 L77.5 176 Q81.4 176 82 172 L89 100 Z"
        fill="white"
        opacity="0.04"
      />
      <ellipse
        cx="63"
        cy="172.5"
        rx="12"
        ry="1.8"
        className="fill-accent"
        opacity="0.45"
      />
      <ellipse
        cx="63"
        cy="172"
        rx="8"
        ry="1.6"
        className="dry-ripple stroke-accent-light"
        strokeWidth="1"
      />
      {(
        [
          [61, 169.5, '-4px'],
          [65, 169.5, '4px'],
        ] as const
      ).map(([cx, cy, dx]) => (
        <circle
          key={cx}
          cx={cx}
          cy={cy}
          r="1.2"
          className="dry-splash fill-accent-light"
          style={{ '--dx': dx } as React.CSSProperties}
        />
      ))}
      <path
        d="M40.5 116 Q47 119 53 116 T65 116 T77 116 T86 116"
        stroke={FOAM}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.2"
      />
      <path
        d="M43 160 Q49 162.5 55 160 T67 160 T79 160"
        stroke={FOAM}
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity="0.12"
      />
      <path
        d="M37 100 L44 172 Q44.6 176 48.5 176 L77.5 176 Q81.4 176 82 172 L89 100"
        className="stroke-accent"
        strokeWidth="3"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d="M42 106 L47.5 162"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.18"
      />

      {/* Sad face */}
      <g className="stroke-lavender" strokeLinecap="round">
        <path d="M49 122 L57 119" strokeWidth="2.2" />
        <path d="M77 122 L69 119" strokeWidth="2.2" />
        <path d="M52 150 Q63 141 74 150" strokeWidth="3" />
      </g>
      <circle cx="54" cy="128" r="3.3" className="fill-lavender" />
      <circle cx="72" cy="128" r="3.3" className="fill-lavender" />
      <path
        d="M54 133 Q51 138 54 140 Q57 138 54 133 Z"
        className="dry-tear fill-lavender"
      />
    </svg>
  )
}
