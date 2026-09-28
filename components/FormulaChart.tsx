/**
 * Leads = Visibility × Conversion, as a 2×2.
 *
 * Inline SVG rather than a chart library: it is four labelled quadrants and
 * three plotted points, it has to render on the server for the crawler, and a
 * runtime charting dependency would cost more bytes than the whole page.
 *
 * Accessibility: the SVG is `role="img"` with a full text description, and the
 * same information is repeated as a real list below it — a screen reader user
 * gets the argument, not "chart".
 */

type Point = { x: number; y: number; label: string; kind: 'now' | 'after' }

const POINTS: Point[] = [
  { x: 12, y: 18, label: 'bouldhq.com today', kind: 'now' },
  { x: 20, y: 82, label: 'After the redesign', kind: 'after' },
  { x: 78, y: 86, label: 'After the visibility plan', kind: 'after' },
]

const QUADRANTS = [
  { x: 25, y: 25, title: 'Starting from zero', sub: 'Nobody finds you, nobody converts' },
  { x: 75, y: 25, title: 'Found, not chosen', sub: 'Traffic arrives and leaves' },
  { x: 25, y: 75, title: 'Ready, not found', sub: 'A good site nobody sees' },
  { x: 75, y: 75, title: 'Leads flow', sub: 'Both halves working' },
]

export default function FormulaChart() {
  return (
    <div className="bould-formula">
      <svg
        viewBox="0 0 100 100"
        className="bould-formula__svg"
        role="img"
        aria-label="A two-by-two chart. The horizontal axis is visibility, the vertical axis is conversion. Low visibility and low conversion is starting from zero. High visibility and low conversion is found but not chosen. Low visibility and high conversion is ready but not found. High visibility and high conversion is where leads flow. bouldhq.com today sits in the bottom-left; the redesign moves it up into ready-but-not-found; the visibility plan moves it right into leads-flow."
      >
        <defs>
          <linearGradient id="bould-formula-good" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.22" />
          </linearGradient>
        </defs>

        <rect x="0" y="0" width="100" height="100" fill="url(#bould-formula-good)" />

        {/* Quadrant dividers */}
        <line x1="50" y1="0" x2="50" y2="100" stroke="#2A2A2A" strokeWidth="0.4" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="#2A2A2A" strokeWidth="0.4" />

        {QUADRANTS.map((q) => (
          <text
            key={q.title}
            x={q.x}
            y={q.y}
            textAnchor="middle"
            className="bould-formula__quad"
          >
            {q.title}
          </text>
        ))}

        {/* Journey: today → redesign → visibility plan */}
        <path
          d={`M ${POINTS[0].x} ${100 - POINTS[0].y} L ${POINTS[1].x} ${100 - POINTS[1].y} L ${POINTS[2].x} ${100 - POINTS[2].y}`}
          fill="none"
          stroke="#8B5CF6"
          strokeWidth="0.6"
          strokeDasharray="2 2"
        />

        {POINTS.map((p) => (
          <circle
            key={p.label}
            cx={p.x}
            cy={100 - p.y}
            r={p.kind === 'now' ? 2 : 2.6}
            fill={p.kind === 'now' ? '#555555' : '#8B5CF6'}
          />
        ))}
      </svg>

      <p className="bould-formula__axis bould-formula__axis--x">Visibility →</p>
      <p className="bould-formula__axis bould-formula__axis--y">Conversion →</p>

      <ul className="bould-formula__key">
        {QUADRANTS.map((q) => (
          <li key={q.title}>
            <strong>{q.title}</strong> — {q.sub}
          </li>
        ))}
      </ul>
    </div>
  )
}
