// SI-assisted: generated with Claude Opus 5.5, reviewed and edited by Rocha
/**
 * Print version of the scenario report (A4, white page, selectable text), rendered with
 * @react-pdf/renderer and loaded lazily (see downloadReportPdf.ts). Same content and order as the
 * "Full report" panel (ReportPanel.tsx). Charts are vector <Svg> drawn from reportCharts.ts.
 * The Plex web fonts ship only the latin subset, so toPdf() rewrites a few symbols (₂, Δ, ≥, →).
 */
import {
  Circle,
  Defs,
  Document,
  G,
  Line,
  LinearGradient,
  Link,
  Page,
  Path,
  Rect,
  Stop,
  StyleSheet,
  Svg,
  Text,
  View,
} from '@react-pdf/renderer'
import type { ReactNode } from 'react'
import { BRAND, BRAND_COLORS, BRAND_VARIANT_COLORS } from '../../../components/brandGeometry'
import { toPdf } from './pdfText'
import { fmt } from '../../../lib/format'
import { CHART_THEMES, flameSchematic, regimeMap, riskBarChart, type Chart } from './reportCharts'
import { figureCaptions, KPI_INTRO, SECTION_INTRO, SECTION_TITLES } from './reportCopy'
import {
  DISCLAIMER,
  formatDateTime,
  GUIDANCE_NOTE,
  MOCK_WATERMARK,
  PRODUCT_NAME,
  PROVENANCE,
  SI_NOTE,
  SIZING_AWAITING,
  type Kpi,
  type ReportModel,
} from './reportModel'

const INK = '#0F172A'
const BODY = '#334155'
const MUTED = '#64748B'
const RULE = '#CBD5E1'
const HEAD_BG = '#F1F5F9'
const ORANGE = BRAND_COLORS.orange
const MARGIN = 56

const s = StyleSheet.create({
  page: {
    paddingTop: MARGIN,
    paddingBottom: MARGIN + 8,
    paddingHorizontal: MARGIN,
    fontFamily: 'Plex Sans',
    fontSize: 10,
    color: BODY,
    backgroundColor: '#FFFFFF',
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  brandName: { fontWeight: 600, fontSize: 10, color: INK, marginLeft: 5 },
  title: { fontWeight: 600, fontSize: 19, color: INK, lineHeight: 1.2 },
  titleRule: { width: 44, height: 2, backgroundColor: ORANGE, marginTop: 7, marginBottom: 7 },
  subtitle: { fontSize: 11, color: BODY, lineHeight: 1.4, marginBottom: 10 },
  meta: { borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: RULE, paddingVertical: 5, marginBottom: 12 },
  metaRow: { flexDirection: 'row', fontSize: 8.5, lineHeight: 1.5 },
  metaKey: { width: 92, fontWeight: 600, color: MUTED },
  metaValue: { flex: 1, color: BODY },
  mono: { fontFamily: 'Plex Mono', fontSize: 8.5 },
  p: { fontSize: 10, lineHeight: 1.45, marginBottom: 5, color: BODY },
  small: { fontSize: 8.5, lineHeight: 1.45, color: MUTED },
  abstractBox: { borderWidth: 0.75, borderColor: RULE, borderRadius: 3, padding: 10, marginBottom: 10 },
  boxTitle: { fontWeight: 600, fontSize: 10, color: INK, marginBottom: 3 },
  kpiRow: { flexDirection: 'row', marginTop: 4, marginBottom: 4 },
  kpi: { flex: 1, borderWidth: 0.75, borderColor: RULE, borderRadius: 3, padding: 7, marginRight: 6 },
  kpiLabel: { fontSize: 7.5, color: MUTED, lineHeight: 1.3 },
  kpiValue: { fontFamily: 'Plex Mono', fontSize: 14, marginTop: 3 },
  kpiWords: { fontWeight: 600, fontSize: 8.5, marginTop: 3, lineHeight: 1.3 },
  kpiDetail: { fontSize: 7, color: MUTED, marginTop: 3, lineHeight: 1.3 },
  tag: { fontFamily: 'Plex Mono', fontSize: 6.5, color: ORANGE },
  h2: { flexDirection: 'row', fontWeight: 600, fontSize: 12.5, color: INK, marginTop: 14 },
  h2Number: { color: ORANGE, width: 16 },
  intro: { fontSize: 8.5, color: MUTED, lineHeight: 1.4, marginTop: 2, marginBottom: 6 },
  table: { borderTopWidth: 0.5, borderColor: RULE, marginTop: 3, marginBottom: 4 },
  tr: { flexDirection: 'row', borderBottomWidth: 0.5, borderColor: RULE },
  th: { backgroundColor: HEAD_BG, fontWeight: 600, fontSize: 8, color: INK },
  cell: { paddingVertical: 3, paddingHorizontal: 4, fontSize: 8.5, lineHeight: 1.35, color: BODY },
  num: { fontFamily: 'Plex Mono', fontSize: 8.5, textAlign: 'right' },
  figure: { marginTop: 6, marginBottom: 4 },
  caption: { fontSize: 8, color: MUTED, lineHeight: 1.4, marginTop: 4 },
  refItem: { flexDirection: 'row', marginBottom: 5 },
  refNumber: { width: 20, fontFamily: 'Plex Mono', fontSize: 8.5, color: MUTED },
  refBody: { flex: 1, fontSize: 9, lineHeight: 1.4, color: BODY },
  link: { color: INK, textDecoration: 'none', fontFamily: 'Plex Mono', fontSize: 8 },
  footer: {
    position: 'absolute',
    bottom: 28,
    left: MARGIN,
    right: MARGIN,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 7.5,
    color: MUTED,
  },
  watermarkWrap: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' },
  watermark: { fontWeight: 600, fontSize: 32, color: ORANGE, opacity: 0.12, transform: 'rotate(-40deg)' },
})

/**
 * Mono text with its spaces set in the sans face: fontkit cannot lay out the empty space glyph of
 * the Plex Mono web font, while digits, letters and units render normally.
 */
function monoSpaced(text: string) {
  return text.split(' ').flatMap((part, i) =>
    i === 0
      ? [part]
      : [
          <Text key={i} style={{ fontFamily: 'Plex Sans' }}>
            {' '}
          </Text>,
          part,
        ],
  )
}

/** Light-background version of the logo (logo-icon-light.svg). */
function Logo() {
  const g = BRAND
  const c = BRAND_COLORS
  const v = BRAND_VARIANT_COLORS.light
  const p = g.porthole
  return (
    <Svg width={14} height={14} viewBox={`0 0 ${g.viewBox} ${g.viewBox}`}>
      <Defs>
        <LinearGradient id="pdf-flame" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={c.amber} />
          <Stop offset="1" stopColor={c.orange} />
        </LinearGradient>
      </Defs>
      <Path d={g.arc} fill="none" stroke={c.orange} strokeWidth={g.arcStroke} strokeLinecap="round" />
      <G transform={g.rocketTransform}>
        <Path d={g.flame} fill="url(#pdf-flame)" />
        <Path d={g.finL} fill={c.orange} />
        <Path d={g.finR} fill={c.orange} />
        <Path d={g.body} fill={v.body} />
        <Circle cx={p.cx} cy={p.cy} r={p.r} fill={v.porthole} />
      </G>
    </Svg>
  )
}

/** Draws a chart's shapes with react-pdf vector primitives (light theme). */
function ChartPdf({ chart, width }: { chart: Chart; width: number }) {
  const c = CHART_THEMES.light
  return (
    <Svg width={width} height={(width * chart.height) / chart.width} viewBox={`0 0 ${chart.width} ${chart.height}`}>
      {chart.shapes.map((sh, i) => {
        switch (sh.kind) {
          case 'rect':
            return (
              <Rect
                key={i}
                x={sh.x}
                y={sh.y}
                width={Math.max(0, sh.w)}
                height={Math.max(0, sh.h)}
                rx={sh.rx}
                fill={sh.fill === 'bg' ? '#F8FAFC' : c[sh.fill]}
                fillOpacity={sh.opacity}
                stroke={sh.stroke ? c[sh.stroke] : undefined}
              />
            )
          case 'line':
            return (
              <Line
                key={i}
                x1={sh.x1}
                y1={sh.y1}
                x2={sh.x2}
                y2={sh.y2}
                stroke={c[sh.stroke]}
                strokeWidth={sh.width ?? 1}
                strokeDasharray={sh.dash}
              />
            )
          case 'circle':
            return (
              <Circle
                key={i}
                cx={sh.cx}
                cy={sh.cy}
                r={sh.r}
                fill={sh.fill ? c[sh.fill] : 'none'}
                fillOpacity={sh.opacity}
                stroke={sh.stroke ? c[sh.stroke] : undefined}
                strokeWidth={sh.width}
                strokeDasharray={sh.dash}
              />
            )
          case 'path':
            return (
              <Path
                key={i}
                d={sh.d}
                fill={sh.fill ? c[sh.fill] : 'none'}
                fillOpacity={sh.opacity}
                stroke={sh.stroke ? c[sh.stroke] : undefined}
                strokeWidth={sh.width}
              />
            )
          case 'text':
            return (
              <Text
                key={i}
                x={sh.x}
                y={sh.y}
                fill={c[sh.fill]}
                textAnchor={sh.anchor ?? 'start'}
                style={{ fontFamily: 'Plex Sans', fontSize: sh.size, fontWeight: sh.bold ? 600 : 400 }}
              >
                {toPdf(sh.text)}
              </Text>
            )
        }
      })}
    </Svg>
  )
}

function Heading({ n, children }: { n?: number; children: string }) {
  return (
    <View style={s.h2} minPresenceAhead={90}>
      {n ? <Text style={s.h2Number}>{n}.</Text> : null}
      <Text>{children}</Text>
    </View>
  )
}

function Section({ n, title, children }: { n: number; title: (typeof SECTION_TITLES)[number]; children: ReactNode }) {
  return (
    <View>
      <Heading n={n}>{title}</Heading>
      <Text style={s.intro}>{toPdf(SECTION_INTRO[title])}</Text>
      {children}
    </View>
  )
}

function Paragraph({ children, cite }: { children: string; cite?: string }) {
  return (
    <Text style={s.p}>
      {toPdf(children)}
      {cite ? ' ' : null}
      {cite ? <Text style={s.mono}>{cite.replace(/, /g, ',')}</Text> : null}
    </Text>
  )
}

const NUMERIC = /^[+−-]?[0-9.]+$/

interface Column {
  header: string
  width: string
  numeric?: boolean
}

/** Table with a header row repeated on each page (fixed), rows kept whole, numbers right-aligned in mono. */
function Table({ columns, rows }: { columns: Column[]; rows: string[][] }) {
  return (
    <View style={s.table}>
      <View style={[s.tr, s.th]} fixed>
        {columns.map((c) => (
          <Text key={c.header} style={[s.cell, { width: c.width, fontWeight: 600, color: INK }, c.numeric ? { textAlign: 'right' } : {}]}>
            {toPdf(c.header)}
          </Text>
        ))}
      </View>
      {rows.map((row, ri) => (
        <View key={ri} style={s.tr} wrap={false}>
          {row.map((cell, i) => (
            <Text key={i} style={[s.cell, { width: columns[i].width }, columns[i].numeric && NUMERIC.test(cell) ? s.num : {}]}>
              {columns[i].numeric && NUMERIC.test(cell) ? monoSpaced(toPdf(cell)) : toPdf(cell)}
            </Text>
          ))}
        </View>
      ))}
    </View>
  )
}

const VALUE_COLUMNS: Column[] = [
  { header: 'Parameter', width: '30%' },
  { header: 'Value', width: '52%', numeric: true },
  { header: 'Unit', width: '18%' },
]
const METRIC_COLUMNS: Column[] = [
  { header: 'Metric', width: '22%' },
  { header: 'Value', width: '14%', numeric: true },
  { header: 'Unit', width: '12%' },
  { header: 'What it means', width: '52%' },
]
const NEIGHBOR_COLUMNS: Column[] = [
  { header: 'Test', width: '19%' },
  { header: 'Material', width: '21%' },
  { header: 'O2 %', width: '8%', numeric: true },
  { header: 'Airflow cm/s', width: '11%', numeric: true },
  { header: 'Thick. mm', width: '10%', numeric: true },
  { header: 'Burn mm/s', width: '10%', numeric: true },
  { header: 'Outcome', width: '21%' },
]

const KPI_COLOR: Record<Kpi['tone'], string> = { nominal: '#059669', warning: '#D97706', critical: '#DC2626', neutral: INK }

function KpiBox({ kpi, last }: { kpi: Kpi; last: boolean }) {
  const words = kpi.value.length > 12
  return (
    <View style={[s.kpi, last ? { marginRight: 0 } : {}]}>
      <Text style={s.kpiLabel}>
        {toPdf(kpi.label)}
        {kpi.tag ? ' ' : null}
        {kpi.tag ? <Text style={s.tag}>{kpi.tag}</Text> : null}
      </Text>
      {words ? (
        <Text style={[s.kpiWords, { color: KPI_COLOR[kpi.tone] }]}>{toPdf(kpi.value)}</Text>
      ) : (
        <Text style={[s.kpiValue, { color: KPI_COLOR[kpi.tone] }]}>
          {monoSpaced(toPdf(kpi.value))}
          {kpi.unit ? <Text style={{ fontSize: 8, color: MUTED }}>{monoSpaced(` ${toPdf(kpi.unit)}`)}</Text> : null}
        </Text>
      )}
      <Text style={s.kpiDetail}>{toPdf(kpi.detail)}</Text>
    </View>
  )
}

function Figure({ chart, caption, width = 400 }: { chart: Chart; caption: string; width?: number }) {
  return (
    <View style={s.figure} wrap={false}>
      <ChartPdf chart={chart} width={width} />
      <Text style={s.caption}>{toPdf(caption)}</Text>
    </View>
  )
}

export function ReportDocument({ report }: { report: ReportModel }) {
  const captions = figureCaptions(report)
  const [s1, s2, s3, s4, s5, s6, s7, s8, s9] = SECTION_TITLES
  const meta: [string, string, boolean?][] = [
    ['Scenario ID', report.scenarioId, true],
    ['Generated on', formatDateTime(report.generatedAt), true],
    ['Mode', report.mockNote ? `Mock (sample payload, not live engine output). ${report.mockNote}.` : 'Live'],
    ['Data', PROVENANCE],
  ]

  return (
    <Document title={`${report.title} · ${report.scenarioId}`} author={PRODUCT_NAME} creator={PRODUCT_NAME} producer={PRODUCT_NAME}>
      <Page size="A4" style={s.page}>
        {report.mock ? (
          <View style={s.watermarkWrap} fixed>
            <Text style={s.watermark}>{MOCK_WATERMARK}</Text>
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
        <Text style={s.subtitle}>{toPdf(report.subtitle)}</Text>

        <View style={s.meta}>
          {meta.map(([k, v, mono]) => (
            <View key={k} style={s.metaRow}>
              <Text style={s.metaKey}>{k}</Text>
              <Text style={[s.metaValue, mono ? s.mono : {}]}>{mono ? monoSpaced(v) : toPdf(v)}</Text>
            </View>
          ))}
        </View>

        <View style={s.abstractBox} wrap={false}>
          <Text style={s.boxTitle}>Abstract</Text>
          <Text style={[s.p, { marginBottom: 0 }]}>{toPdf(report.abstract)}</Text>
        </View>

        <Text style={s.intro}>{KPI_INTRO}</Text>
        <View style={s.kpiRow} wrap={false}>
          {report.kpis.map((k, i) => (
            <KpiBox key={k.label} kpi={k} last={i === report.kpis.length - 1} />
          ))}
        </View>

        <Section n={1} title={s1}>
          <Table columns={VALUE_COLUMNS} rows={report.parameters.map((r) => [r.label, r.value, r.unit])} />
        </Section>

        <Section n={2} title={s2}>
          <Table columns={METRIC_COLUMNS} rows={report.telemetry.map((r) => [r.label, r.value, r.unit, r.meaning])} />
          <Figure chart={riskBarChart(report.score)} caption={captions.riskBar} width={360} />
        </Section>

        <Section n={3} title={s3}>
          <Paragraph>{report.flame.text}</Paragraph>
          <Figure chart={flameSchematic(report.flame)} caption={captions.schematic} width={340} />
        </Section>

        <View wrap={false}>
          <Section n={4} title={s4}>
            <Figure chart={regimeMap(report.regime)} caption={captions.regime} width={360} />
          </Section>
        </View>

        <Section n={5} title={s5}>
          <Paragraph>{report.neighbors.note}</Paragraph>
          <Table
            columns={NEIGHBOR_COLUMNS}
            rows={report.neighbors.rows.map((r) => [
              r.test_id,
              r.material_name,
              fmt(r.initial_o2_pct, 1),
              fmt(r.airflow_cm_s, 1),
              fmt(r.thickness_mm, 2),
              fmt(r.spread_rate_mm_s, 3),
              r.outcome,
            ])}
          />
        </Section>

        <Section n={6} title={s6}>
          <Paragraph cite={report.cite}>{report.interpretation}</Paragraph>
        </Section>

        <View wrap={false}>
          <Section n={7} title={s7}>
            <Paragraph cite={report.cite}>{report.suppression.action}</Paragraph>
            {report.suppression.sizing ? (
              <View wrap={false}>
                <Text style={[s.p, { fontWeight: 600, color: INK, fontSize: 9 }]}>
                  ISS water-mist extinguisher sizing (engine estimate)
                </Text>
                <Table columns={METRIC_COLUMNS} rows={report.suppression.sizing.map((r) => [r.label, r.value, r.unit, r.meaning])} />
                {report.suppression.note ? <Text style={s.small}>{toPdf(report.suppression.note)}</Text> : null}
              </View>
            ) : (
              <Text style={[s.small, { marginBottom: 4 }]}>{SIZING_AWAITING}</Text>
            )}
            <Text style={s.small}>{GUIDANCE_NOTE}</Text>
          </Section>
        </View>

        <Section n={8} title={s8}>
          <Paragraph>{report.terrestrial}</Paragraph>
        </Section>

        <Section n={9} title={s9}>
          <Paragraph cite={report.cite}>{report.limitations}</Paragraph>
          <Paragraph>{`Data grounding: ${report.groundingLabel}. ${report.groundingMeaning}`}</Paragraph>
        </Section>

        <Heading>References</Heading>
        <View style={{ marginTop: 6 }}>
          {report.references.map((r) => (
            <View key={r.n} style={s.refItem} wrap={false}>
              <Text style={s.refNumber}>[{r.n}]</Text>
              <View style={s.refBody}>
                <Text>
                  {toPdf(`${r.id}. ${r.title}. `)}
                  <Link src={r.url} style={s.link}>
                    {r.url}
                  </Link>
                </Text>
                <Text style={[s.small, { marginTop: 1 }]}>{toPdf(r.finding)}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={{ marginTop: 12, borderTopWidth: 0.5, borderColor: RULE, paddingTop: 6 }} wrap={false}>
          <Text style={s.small}>{SI_NOTE}</Text>
          <Text style={s.small}>{DISCLAIMER}</Text>
        </View>
      </Page>
    </Document>
  )
}
