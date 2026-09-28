// A knocked-over pint on the bar, pouring off the edge into a puddle. Shown
// on the 404 page. Animations (flow, ripples, splashes, bubbles, sparkles)
// stop under prefers-reduced-motion.

// The glass is drawn lying along the x-axis (base at x=0, mouth at x=122)
// and rotated so its lower side rests flat on the bar top.
const GLASS_TRANSFORM = 'translate(100.5 120.15) rotate(-5.62)'

const SPARKLE = 'M0 -6 Q1 -1 6 0 Q1 1 0 6 Q-1 1 -6 0 Q-1 -1 0 -6 Z'

const FOAM = '#f3ead3'

const styles = `
.spill-anim { transform-box: fill-box; transform-origin: center; }
.spill-flow { animation: spill-flow 0.9s linear infinite; }
.spill-ripple { animation: spill-ripple 1.6s ease-out infinite; }
.spill-splash { animation: spill-splash 1.2s ease-out infinite; }
.spill-bubble { animation: spill-bubble 2.4s ease-in infinite; }
.spill-sparkle { animation: spill-sparkle 1.8s ease-in-out infinite; }
@keyframes spill-flow { to { stroke-dashoffset: -36; } }
@keyframes spill-ripple {
  0% { transform: scale(0.3); opacity: 0.9; }
  100% { transform: scale(1.7); opacity: 0; }
}
@keyframes spill-splash {
  0% { transform: translate(0, 0); opacity: 0; }
  15% { opacity: 1; }
  55% { transform: translate(var(--dx), -11px); opacity: 1; }
  100% { transform: translate(calc(var(--dx) * 1.6), 3px); opacity: 0; }
}
@keyframes spill-bubble {
  0% { transform: translateY(0); opacity: 0; }
  30% { opacity: 0.8; }
  100% { transform: translateY(-15px); opacity: 0; }
}
@keyframes spill-sparkle {
  0%, 100% { transform: scale(0.5) rotate(0deg); opacity: 0.3; }
  50% { transform: scale(1.1) rotate(45deg); opacity: 1; }
}
@media (prefers-reduced-motion: reduce) {
  .spill-anim { animation: none !important; }
}
`

export default function SpilledPint({
  className = '',
}: {
  className?: string
}) {
  return (
    <svg
      viewBox="48 38 304 208"
      fill="none"
      className={className}
      role="img"
      aria-label="A knocked-over pint glass spilling beer off the bar onto the floor"
    >
      <style>{styles}</style>
      <defs>
        <linearGradient id="spill-beer" x1="0" y1="0" x2="0" y2="1">
          <stop
            offset="0"
            style={{ stopColor: 'rgb(var(--color-accent-light))' }}
          />
          <stop
            offset="1"
            style={{ stopColor: 'rgb(var(--color-accent-dark))' }}
          />
        </linearGradient>
        <filter id="spill-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.55 0"
            result="glow"
          />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <clipPath id="spill-glass-inside">
          <path
            transform={GLASS_TRANSFORM}
            d="M121 -39 L10 -27 L10 27 L121 39 Z"
          />
        </clipPath>
      </defs>

      {/* Floor */}
      <line
        x1="50"
        y1="236"
        x2="350"
        y2="236"
        className="stroke-border"
        strokeWidth="1.5"
      />

      {/* Bar: front panel, then the top slab */}
      <rect
        x="64"
        y="161"
        width="162"
        height="75"
        className="fill-bg-card stroke-border"
        strokeWidth="1.5"
      />
      <rect
        x="76"
        y="172"
        width="64"
        height="52"
        className="stroke-border"
        strokeWidth="1.5"
      />
      <rect
        x="150"
        y="172"
        width="64"
        height="52"
        className="stroke-border"
        strokeWidth="1.5"
      />
      <rect
        x="56"
        y="150"
        width="178"
        height="11"
        rx="2"
        className="fill-bg-hover"
      />
      <line
        x1="58"
        y1="150.75"
        x2="232"
        y2="150.75"
        className="stroke-accent"
        strokeWidth="1.5"
        opacity="0.45"
      />

      {/* Dizzy sparkles over the knocked-out glass. Positioned by the outer
          <g> because the CSS animation owns the path's own transform. */}
      {(
        [
          ['translate(128 70) scale(1.4)', 'fill-accent-light', '0s'],
          ['translate(158 53) scale(1.1)', 'fill-lavender-light', '0.6s'],
          ['translate(190 49) scale(1.25)', 'fill-accent-light', '1.2s'],
        ] as const
      ).map(([transform, fill, delay]) => (
        <g key={transform} transform={transform}>
          <path
            d={SPARKLE}
            className={`spill-anim spill-sparkle ${fill}`}
            style={{ animationDelay: delay }}
          />
        </g>
      ))}

      {/* Beer left in the glass, with foam and rising bubbles */}
      <g clipPath="url(#spill-glass-inside)">
        <path
          d="M80 129 Q90 126 100 129 T120 129 T140 129 T160 129 T180 129 T200 129 T220 129 T240 129 L240 160 L80 160 Z"
          fill="url(#spill-beer)"
        />
        <path
          d="M80 128.5 Q90 125.5 100 128.5 T120 128.5 T140 128.5 T160 128.5 T180 128.5 T200 128.5 T220 128.5 T240 128.5"
          stroke={FOAM}
          strokeWidth="5"
          strokeLinecap="round"
        />
        {[
          [112, 125, 2.5],
          [135, 124.5, 3],
          [158, 125.5, 2],
          [186, 124.5, 2.8],
          [207, 125.8, 2.2],
        ].map(([cx, cy, r]) => (
          <circle key={cx} cx={cx} cy={cy} r={r} fill={FOAM} />
        ))}
        {[
          [138, 145, 1.6, '0s'],
          [168, 146, 1.3, '0.8s'],
          [196, 145, 1.8, '1.6s'],
        ].map(([cx, cy, r, delay]) => (
          <circle
            key={cx}
            cx={cx}
            cy={cy}
            r={r}
            fill={FOAM}
            className="spill-anim spill-bubble"
            style={{ animationDelay: delay as string }}
          />
        ))}
      </g>

      {/* The glass */}
      <g transform={GLASS_TRANSFORM}>
        <path
          d="M122 -42 L7 -30 Q1 -29.5 1 -24 L1 24 Q1 29.5 7 30 L122 42 Z"
          fill="white"
          opacity="0.04"
        />
        <path
          d="M122 -42 L7 -30 Q1 -29.5 1 -24 L1 24 Q1 29.5 7 30 L122 42"
          className="stroke-accent"
          strokeWidth="4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Thick glass base */}
        <path
          d="M9 -23 L9 23"
          className="stroke-accent"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0.45"
        />
        {/* Sheen */}
        <path
          d="M18 -21 L100 -31"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0.22"
        />
        <path
          d="M24 -13 L58 -17"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.12"
        />
        {/* Rim */}
        <ellipse
          cx="122"
          cy="0"
          rx="7"
          ry="42"
          className="stroke-accent"
          strokeWidth="3"
        />
        {/* Knocked-out face */}
        <g className="stroke-lavender" strokeWidth="3.2" strokeLinecap="round">
          <path d="M43 -21 L52 -12 M52 -21 L43 -12" />
          <path d="M68 -21 L77 -12 M77 -21 L68 -12" />
          <path d="M50 2 q5 -4 10 0 t10 0" />
        </g>
      </g>

      {/* Stream over the edge and the puddle, glowing */}
      <g filter="url(#spill-glow)">
        <path
          d="M219 129 C233 128.5 241 135 242.5 150 C244 172 241 198 244 232 L234 232 C233 200 236 175 234 158 C233 153 230 150.5 224 150 Z"
          fill="url(#spill-beer)"
        />
        <path
          d="M214 236 C214 231 232 229.5 252 229.5 C280 229.5 322 230.5 334 233.5 C342 235.5 336 239.5 318 240.5 C290 242 244 242 226 241 C216 240.5 213 238.5 214 236 Z"
          fill="url(#spill-beer)"
        />
      </g>
      <path
        d="M231 137 C238 140 239 148 239.5 158 C240 180 238 204 239.5 230"
        className="spill-flow stroke-accent-light"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeDasharray="5 13"
        opacity="0.7"
      />
      <ellipse
        cx="288"
        cy="234.5"
        rx="24"
        ry="1.6"
        fill="white"
        opacity="0.22"
      />

      {/* Ripples where the stream hits */}
      <ellipse
        cx="240"
        cy="234"
        rx="16"
        ry="3.5"
        className="spill-anim spill-ripple stroke-accent-light"
        strokeWidth="1.5"
      />
      <ellipse
        cx="240"
        cy="234"
        rx="16"
        ry="3.5"
        className="spill-anim spill-ripple stroke-accent-light"
        strokeWidth="1.5"
        style={{ animationDelay: '0.8s' }}
      />

      {/* Foam at the splash point */}
      {[
        [231, 232.5, 3.5],
        [240, 230.5, 4.5],
        [249, 232.5, 3],
        [225, 235.5, 2.5],
        [257, 234.5, 2.2],
        [292, 233, 1.8],
        [312, 235.5, 1.5],
      ].map(([cx, cy, r]) => (
        <circle key={cx} cx={cx} cy={cy} r={r} fill={FOAM} />
      ))}

      {/* Splash droplets */}
      {[
        [236, 228, 2, '-9px', '0s'],
        [243, 227, 1.6, '8px', '0.4s'],
        [246, 229, 1.3, '14px', '0.8s'],
      ].map(([cx, cy, r, dx, delay]) => (
        <circle
          key={cx}
          cx={cx}
          cy={cy}
          r={r}
          className="spill-anim spill-splash fill-accent-light"
          style={
            {
              '--dx': dx,
              animationDelay: delay,
            } as React.CSSProperties
          }
        />
      ))}
    </svg>
  )
}
