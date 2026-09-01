import { cn } from '@/lib/utils'

interface SchoolCrestProps {
  size?: 24 | 32 | 48 | 96
  className?: string
}

const NAVY = '#0B3B6F'
const TEAL_LIGHT = '#4FC3D9'
const TEAL_DARK = '#1B7A93'
const RED = '#C21F3A'
const BACKING = '#FBFAF6'

// Sunburst rays — upper ~234° arc only, kept clear of the book below.
const RAYS = [
  [100.0, 48.0, 100.0, 20.0],
  [109.3, 49.5, 115.5, 30.4],
  [117.6, 53.7, 134.1, 31.1],
  [124.3, 60.4, 140.5, 48.6],
  [128.5, 68.7, 155.2, 60.1],
  [130.0, 78.0, 150.0, 78.0],
  [128.5, 87.3, 155.2, 95.9],
  [71.5, 87.3, 44.8, 95.9],
  [70.0, 78.0, 50.0, 78.0],
  [71.5, 68.7, 44.8, 60.1],
  [75.7, 60.4, 59.5, 48.6],
  [82.4, 53.7, 65.9, 31.1],
  [90.7, 49.5, 84.5, 30.4],
] as const

// Canopy leaves — small almond shapes fanning out from a point above the trunk.
const LEAVES = [
  { dx: -15.76, dy: -2.78, rotate: -80 },
  { dx: -13.86, dy: -8.0, rotate: -60 },
  { dx: -10.28, dy: -12.26, rotate: -40 },
  { dx: -5.47, dy: -15.04, rotate: -20 },
  { dx: -0.56, dy: -15.99, rotate: -2 },
  { dx: 4.41, dy: -15.38, rotate: 16 },
  { dx: 8.95, dy: -13.26, rotate: 34 },
  { dx: 12.94, dy: -9.4, rotate: 54 },
  { dx: 15.38, dy: -4.41, rotate: 74 },
] as const

const LEAF_CENTER = [100, 78] as const

export function SchoolCrest({ size = 32, className }: SchoolCrestProps) {
  const gradId = 'umv-crest-leaf-grad'

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      role="img"
      aria-label="UMV Adala school crest"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={TEAL_LIGHT} />
          <stop offset="100%" stopColor={TEAL_DARK} />
        </linearGradient>
        <path id="umv-top-text-path" d="M27.5,66.19 A80,80 0 0 1 172.5,66.19" />
        <path id="umv-bottom-text-path" d="M35.91,137 A74,74 0 0 0 164.09,137" />
      </defs>

      {/* Light backing disc so the crest reads on both light and dark surfaces */}
      <circle cx="100" cy="100" r="98" fill={BACKING} />

      {/* Open decorative ring arcs (gaps at top for the motto, bottom for the name) */}
      <path d="M146,20.33 A92,92 0 0 1 131.47,186.45" stroke={NAVY} strokeWidth="1.6" fill="none" />
      <path d="M68.53,186.45 A92,92 0 0 1 54,20.33" stroke={NAVY} strokeWidth="1.6" fill="none" />
      <circle cx="146" cy="20.33" r="2.6" fill={NAVY} />
      <circle cx="54" cy="20.33" r="2.6" fill={NAVY} />

      {/* Sunburst */}
      <g stroke={NAVY} strokeWidth="1.4" strokeLinecap="round">
        {RAYS.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} />
        ))}
      </g>

      {/* Trunk */}
      <path d="M100,155 C100,142 98,130 100,120" stroke={TEAL_DARK} strokeWidth="4" strokeLinecap="round" fill="none" />

      {/* Canopy */}
      <g fill={`url(#${gradId})`}>
        {LEAVES.map((leaf, i) => (
          <ellipse
            key={i}
            cx={LEAF_CENTER[0] + leaf.dx}
            cy={LEAF_CENTER[1] + leaf.dy}
            rx="5.5"
            ry="13"
            transform={`rotate(${leaf.rotate} ${LEAF_CENTER[0] + leaf.dx} ${LEAF_CENTER[1] + leaf.dy})`}
          />
        ))}
      </g>

      {/* Hanging loops either side of the trunk */}
      <ellipse cx="86" cy="120" rx="5" ry="9" stroke={TEAL_DARK} strokeWidth="2.2" fill="none" />
      <ellipse cx="114" cy="120" rx="5" ry="9" stroke={TEAL_DARK} strokeWidth="2.2" fill="none" />

      {/* Open book */}
      <path d="M100,158 Q75,146 52,154 Q75,163 100,168 Z" fill={RED} />
      <path d="M100,158 Q125,146 148,154 Q125,163 100,168 Z" fill={RED} />
      <path d="M100,158 L100,168" stroke={NAVY} strokeWidth="1.8" />
      <path d="M50,167 Q100,178 150,167" stroke={NAVY} strokeWidth="2.2" fill="none" strokeLinecap="round" />

      {/* Motto — top arc */}
      <text fontSize="13" fill={NAVY} textAnchor="middle" style={{ fontFamily: "'Tiro Devanagari Hindi', serif" }}>
        <textPath href="#umv-top-text-path" startOffset="50%">
          सा विद्या या विमुक्तये
        </textPath>
      </text>

      {/* School short name — bottom arc */}
      <text
        fontSize="15"
        fontWeight="700"
        fill={NAVY}
        textAnchor="middle"
        letterSpacing="2"
        style={{ fontFamily: "'Bitter', serif" }}
      >
        <textPath href="#umv-bottom-text-path" startOffset="50%">
          UMV ADALA
        </textPath>
      </text>
    </svg>
  )
}
