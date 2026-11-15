// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/**
 * Academic-style PDF of the scenario report (A4, 2.5 cm margins, selectable text), rendered with
 * @react-pdf/renderer. Loaded lazily (see downloadReportPdf.ts) so it stays out of the main bundle.
 * Plex fonts ship only the latin subset, so the PDF writes "O2" / "CO2" instead of subscript digits.
 */
import { Defs, Document, Ellipse, LinearGradient, Link, Page, Path, Rect, Stop, StyleSheet, Svg, Text, View } from '@react-pdf/renderer'
import {
  BRAND_COLORS,
  BRAND_FLAME_D,
  BRAND_ORBIT,
  BRAND_ORBIT_FRONT_D,
  BRAND_SPARKLE_D,
} from '../../../components/brandGeometry'
import { FIGURE_VIEWBOX, flameFigure } from './flameFigure'
import {
  DISCLAIMER,
  FIGURE_CAPTION,
  formatDateTime,
  GUIDANCE_NOTE,
  NOT_AVAILABLE,
  PRODUCT_NAME,
  SI_NOTE,
  type MetricRow,
  type ReportModel,
  type ValueRow,
} from './reportModel'

const ORANGE = BRAND_COLORS.orange
const INK = '#1A1F29'
const GREY = '#4A5263'
const LIGHT = '#EEF0F3'
const RULE = '#C9CED6'
const MARGIN = 70.87 // 2.5 cm in points

const s = StyleSheet.create({
  page: {
    paddingTop: MARGIN,
    paddingBottom: MARGIN,
    paddingHorizontal: MARGIN,
    fontFamily: 'Plex Serif',
    fontSize: 10.5,
    color: INK,
    backgroundColor: '#FFFFFF',
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 18 },
  brandName: { fontFamily: 'Plex Sans', fontWeight: 600, fontSize: 10, marginLeft: 5 },
  title: { fontFamily: 'Plex Sans', fontWeight: 600, fontSize: 20, lineHeight: 1.2 },
  titleRule: { width: 48, height: 2, backgroundColor: ORANGE, marginTop: 8, marginBottom: 8 },
  subtitle: { fontSize: 11.5, lineHeight: 1.4, color: GREY, marginBottom: 14 },
  meta: { borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: RULE, paddingVertical: 6, marginBottom: 14 },
  metaRow: { flexDirection: 'row', fontSize: 9, lineHeight: 1.5 },
  metaKey: { width: 110, fontFamily: 'Plex Sans', fontWeight: 600, color: GREY },
  metaValue: { flex: 1 },
  mono: { fontFamily: 'Plex Mono', fontSize: 9 },
  abstractBox: { borderWidth: 0.75, borderColor: RULE, padding: 10, marginBottom: 6 },
  abstractTitle: { fontFamily: 'Plex Sans', fontWeight: 600, fontSize: 10, marginBottom: 4 },
  h2: { flexDirection: 'row', fontFamily: 'Plex Sans', fontWeight: 600, fontSize: 12.5, marginTop: 16, marginBottom: 6 },
  h2Number: { color: ORANGE, width: 18 },
  // Line height lives on text styles: set on the page, it hides the fixed footer in react-pdf.
  p: { marginBottom: 6, textAlign: 'justify', fontSize: 10.5, lineHeight: 1.4 },
  note: { fontSize: 9, color: GREY, fontStyle: 'normal' },
  table: { borderTopWidth: 0.5, borderColor: RULE, marginVertical: 6 },
  tr: { flexDirection: 'row', borderBottomWidth: 0.5, borderColor: RULE },
  th: { backgroundColor: LIGHT, fontFamily: 'Plex Sans', fontWeight: 600, fontSize: 8.5 },
  cell: { paddingVertical: 3, paddingHorizontal: 5, fontSize: 9.5, lineHeight: 1.35 },
  figure: { marginVertical: 8, alignItems: 'center' },
  caption: { fontSize: 9, color: GREY, marginTop: 4, textAlign: 'center', lineHeight: 1.4 },
  refItem: { flexDirection: 'row', marginBottom: 6 },
  refNumber: { width: 22, fontFamily: 'Plex Mono', fontSize: 9 },
  refBody: { flex: 1, fontSize: 9.5, lineHeight: 1.4 },
  link: { color: INK, textDecoration: 'none', fontFamily: 'Plex Mono', fontSize: 8.5 },
  footer: {
    position: 'absolute',
    bottom: 34,
    left: MARGIN,
    right: MARGIN,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontFamily: 'Plex Sans',
    fontWeight: 600,
    fontSize: 7.5,
    color: GREY,
  },
  watermarkWrap: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
  watermark: {
    fontFamily: 'Plex Sans',
    fontWeight: 600,
    fontSize: 34,
    color: ORANGE,
    opacity: 0.13,
    transform: 'rotate(-40deg)',
  },
})

/**
 * Mono text with its spaces set in the serif face: fontkit cannot lay out the empty space glyph
 * of the Plex Mono web font, while digits, letters and units render normally.
 */
function monoSpaced(text: string) {
  return text.split(' ').flatMap((part, i) => (i === 0 ? [part] : [<Text key={i} style={{ fontFamily: 'Plex Serif' }}> </Text>, part]))
}

function Logo() {
  const o = BRAND_ORBIT
  return (
    <Svg width={18} height={18} viewBox="0 0 32 32">
      <Defs>
        <LinearGradient id="pdf-flame" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={BRAND_COLORS.amber} />
          <Stop offset="0.62" stopColor={BRAND_COLORS.orange} />
        </LinearGradient>
      </Defs>
      {/* On white paper the light orbit would vanish, so it is drawn in dark ink here. */}
      <Ellipse cx={o.cx} cy={o.cy} rx={o.rx} ry={o.ry} transform={`rotate(${o.rotate} ${o.cx} ${o.cy})`} fill="none" stroke={INK} strokeWidth={1.5} />
      <Path d={BRAND_FLAME_D} fill="url(#pdf-flame)" fillRule="evenodd" />
      <Path d={BRAND_ORBIT_FRONT_D} fill="none" stroke="#FFFFFF" strokeWidth={3.6} strokeLinecap="round" />
      <Path d={BRAND_ORBIT_FRONT_D} fill="none" stroke={INK} strokeWidth={1.5} strokeLinecap="round" />
      <Path d={BRAND_SPARKLE_D} fill={ORANGE} />
    </Svg>
  )
}

function Heading({ n, children }: { n?: number; children: string }) {
  return (
    <View style={s.h2} minPresenceAhead={60}>
      {n ? <Text style={s.h2Number}>{n}.</Text> : null}
      <Text>{children}</Text>
    </View>
  )
}

function Paragraph({ children, cite }: { children: string; cite?: string }) {
  return (
    <Text style={s.p}>
      {children}
      {cite ? ' ' : null}
      {cite ? <Text style={s.mono}>{monoSpaced(cite)}</Text> : null}
    </Text>
  )
}

const NUMERIC = /^-?[0-9.]+$/

interface Column<T> {
  header: string
  width: string
  /** true: always mono; 'numeric': mono only for numeric values. */
  mono?: boolean | 'numeric'
  value: (row: T) => string
}

function Table<T>({ rows, columns }: { rows: T[]; columns: Column<T>[] }) {
  return (
    <View style={s.table}>
      <View style={[s.tr, s.th]}>
        {columns.map((c) => (
          <Text key={c.header} style={[s.cell, { width: c.width }]}>
            {c.header}
          </Text>
        ))}
      </View>
      {rows.map((row, i) => (
        <View key={i} style={s.tr} wrap={false}>
          {columns.map((c) => (
            <MonoCell key={c.header} column={c} value={c.value(row)} />
          ))}
        </View>
      ))}
    </View>
  )
}

function MonoCell<T>({ column, value }: { column: Column<T>; value: string }) {
  const mono = column.mono === true || (column.mono === 'numeric' && NUMERIC.test(value))
  return <Text style={[s.cell, { width: column.width }, mono ? s.mono : {}]}>{mono ? monoSpaced(value) : value}</Text>
}

const VALUE_COLUMNS: Column<ValueRow>[] = [
  { header: 'Parameter', width: '30%', value: (r) => r.label },
  { header: 'Value', width: '52%', mono: 'numeric', value: (r) => r.value },
  { header: 'Unit', width: '18%', mono: true, value: (r) => r.unit || '—' },
]

const METRIC_COLUMNS: Column<MetricRow>[] = [
  { header: 'Metric', width: '22%', value: (r) => r.label },
  { header: 'Value', width: '24%', mono: 'numeric', value: (r) => r.value },
  { header: 'Unit', width: '12%', mono: true, value: (r) => r.unit || '—' },
  { header: 'What it means', width: '42%', value: (r) => r.meaning },
]

function FlameFigurePdf({ report }: { report: ReportModel }) {
  const fig = flameFigure(report.flame.simulation)
  const { width, height } = FIGURE_VIEWBOX
  return (
    <View style={s.figure} wrap={false}>
      <Svg width={300} height={(300 * height) / width} viewBox={`0 0 ${width} ${height}`}>
        <Rect x={0} y={0} width={width} height={height} fill="#F4F5F7" />
        {fig.flame ? (
          <>
            <Path d={fig.flame.outer} fill={fig.flame.color} fillOpacity={fig.flame.opacity * 0.55} />
            <Path d={fig.flame.inner} fill={fig.flame.color} fillOpacity={fig.flame.opacity} />
          </>
        ) : null}
        {fig.ghost ? (
          <Path
            d={`M${fig.ghost.cx - fig.ghost.r} ${fig.ghost.cy}A${fig.ghost.r} ${fig.ghost.r} 0 1 0 ${fig.ghost.cx + fig.ghost.r} ${fig.ghost.cy}A${fig.ghost.r} ${fig.ghost.r} 0 1 0 ${fig.ghost.cx - fig.ghost.r} ${fig.ghost.cy}Z`}
            fill="none"
            stroke="#8A94A6"
            strokeWidth={1}
            strokeDasharray="4 3"
          />
        ) : null}
        <Rect x={fig.sample.x} y={fig.sample.y} width={fig.sample.width} height={fig.sample.height} fill="#5B6577" />
      </Svg>
      <Text style={s.caption}>
        {FIGURE_CAPTION} {fig.label}.
      </Text>
    </View>
  )
}

export function ReportDocument({ report }: { report: ReportModel }) {
  const meta: [string, string, boolean?][] = [
    ['Scenario ID', report.scenarioId, true],
    ['Generated on', formatDateTime(report.generatedAt), true],
    ['Mode', report.mockNote ? `Mock (sample payload, not live engine output). ${report.mockNote}.` : 'Live'],
    ['Grounding status', `${report.grounding.label} (${report.grounding.status})`],
    ['Data sources', report.dataSources],
  ]

  return (
    <Document title={`${report.title} · ${report.scenarioId}`} author={PRODUCT_NAME} creator={PRODUCT_NAME} producer={PRODUCT_NAME}>
      <Page size="A4" style={s.page}>
        {report.mock ? (
          <View style={s.watermarkWrap} fixed>
            <Text style={s.watermark}>MOCK DATA, NOT NASA EVIDENCE</Text>
          </View>
        ) : null}

        <View style={s.footer} fixed>
          <Text>
            {PRODUCT_NAME} · {report.scenarioId}
          </Text>
          <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
        </View>

        <View style={s.brandRow}>
          <Logo />
          <Text style={s.brandName}>{PRODUCT_NAME}</Text>
        </View>
        <Text style={s.title}>{report.title}</Text>
        <View style={s.titleRule} />
        <Text style={s.subtitle}>{report.subtitle}</Text>

        <View style={s.meta}>
          {meta.map(([k, v, mono]) => (
            <View key={k} style={s.metaRow}>
              <Text style={s.metaKey}>{k}</Text>
              <Text style={[s.metaValue, mono ? s.mono : {}]}>{mono ? monoSpaced(v) : v}</Text>
            </View>
          ))}
        </View>

        <View style={s.abstractBox}>
          <Text style={s.abstractTitle}>Abstract</Text>
          <Text style={s.p}>{report.abstract}</Text>
        </View>

        <Heading n={1}>Scenario parameters</Heading>
        <Table rows={report.parameters} columns={VALUE_COLUMNS} />

        <Heading n={2}>Flammability telemetry</Heading>
        <Table rows={report.telemetry} columns={METRIC_COLUMNS} />

        <Heading n={3}>Flame behavior</Heading>
        <Paragraph>{report.flame.text}</Paragraph>
        <FlameFigurePdf report={report} />

        <Heading n={4}>Interpretation</Heading>
        <Paragraph cite={report.cite}>{report.interpretation}</Paragraph>

        <Heading n={5}>Suppression</Heading>
        <Paragraph cite={report.cite}>{report.suppression.action}</Paragraph>
        {report.suppression.sizing ? (
          <>
            <Text style={[s.p, { fontFamily: 'Plex Sans', fontWeight: 600, fontSize: 9.5 }]}>ISS FWM PFE suppression sizing</Text>
            <Table rows={report.suppression.sizing} columns={METRIC_COLUMNS} />
            {report.suppression.note ? <Text style={[s.p, s.note]}>{report.suppression.note}</Text> : null}
          </>
        ) : (
          <Text style={[s.p, s.note]}>Suppression sizing: {NOT_AVAILABLE}.</Text>
        )}
        <Text style={[s.p, s.note]}>{GUIDANCE_NOTE}</Text>

        <Heading n={6}>Terrestrial applications</Heading>
        <Paragraph>{report.terrestrial}</Paragraph>

        <Heading n={7}>Limitations and data grounding</Heading>
        <Paragraph cite={report.cite}>{report.limitations}</Paragraph>
        <Paragraph>{`Grounding status: ${report.grounding.label}. ${report.grounding.summary}`}</Paragraph>

        <Heading>References</Heading>
        {report.references.length === 0 ? <Text style={s.p}>{NOT_AVAILABLE}.</Text> : null}
        {report.references.map((r) => (
          <View key={r.n} style={s.refItem} wrap={false}>
            <Text style={s.refNumber}>[{r.n}]</Text>
            <View style={s.refBody}>
              <Text>
                {`${r.id}. ${r.title}. `}
                <Link src={r.url} style={s.link}>
                  {r.url}
                </Link>
              </Text>
              <Text style={[s.note, { marginTop: 2 }]}>{r.finding}</Text>
            </View>
          </View>
        ))}

        <View style={{ marginTop: 14, borderTopWidth: 0.5, borderColor: RULE, paddingTop: 8 }} wrap={false}>
          <Text style={[s.p, s.note]}>{SI_NOTE}</Text>
          <Text style={[s.p, s.note, { fontFamily: 'Plex Sans', fontWeight: 600 }]}>{DISCLAIMER}</Text>
        </View>

      </Page>
    </Document>
  )
}
