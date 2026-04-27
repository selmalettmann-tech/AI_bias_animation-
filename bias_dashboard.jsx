import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, Legend,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";

const C = {
  bg: "#0d1117", card: "#161b22", border: "#21262d",
  text: "#e6edf3", muted: "#8b949e",
  amber: "#f59e0b", blue: "#3b82f6", green: "#22c55e",
  purple: "#a855f7", rose: "#f87171",
  GB: "#3b82f6", LR: "#22c55e", MLP: "#a855f7", RF: "#f59e0b",
};

const modelData = [
  { model: "Gradient Boosting", short: "GB", accuracy: 86.8, precision: 82.8, recall: 71.8, auc: 90.9 },
  { model: "Logistic Regression", short: "LR", accuracy: 87.8, precision: 85.0, recall: 73.3, auc: 91.4 },
  { model: "MLP", short: "MLP", accuracy: 85.2, precision: 77.2, recall: 73.7, auc: 89.9 },
  { model: "Random Forest", short: "RF", accuracy: 86.8, precision: 86.0, recall: 67.9, auc: 91.0 },
];

const radarData = [
  { metric: "Accuracy", GB: 86.8, LR: 87.8, MLP: 85.2, RF: 86.8 },
  { metric: "Precision", GB: 82.8, LR: 85.0, MLP: 77.2, RF: 86.0 },
  { metric: "Recall", GB: 71.8, LR: 73.3, MLP: 73.7, RF: 67.9 },
  { metric: "AUC", GB: 90.9, LR: 91.4, MLP: 89.9, RF: 91.0 },
];

const fprData = [
  { name: "Tuition (No)", GB: 64.3, LR: 35.7, MLP: 64.3, RF: 42.9, financial: true },
  { name: "Debtor (Yes)", GB: 28.6, LR: 34.3, MLP: 34.3, RF: 25.7, financial: true },
  { name: "Father Serv.", GB: 14.3, LR: 9.5, MLP: 15.9, RF: 12.7, financial: false },
  { name: "Gender (M)", GB: 12.6, LR: 11.4, MLP: 17.1, RF: 9.1, financial: false },
  { name: "Displaced (N)", GB: 9.9, LR: 7.3, MLP: 12.4, RF: 6.0, financial: false },
  { name: "Scholarship (N)", GB: 9.1, LR: 7.9, MLP: 12.6, RF: 6.7, financial: false },
  { name: "Gender (F)", GB: 4.1, LR: 3.4, MLP: 6.5, RF: 3.1, financial: false },
  { name: "Scholarship (Y)", GB: 1.1, LR: 1.1, MLP: 3.2, RF: 1.1, financial: false },
];

const featureData = [
  { feature: "2nd sem approved", value: 15.09, financial: false },
  { feature: "2nd sem grade", value: 13.19, financial: false },
  { feature: "1st sem approved", value: 7.96, financial: false },
  { feature: "1st sem grade", value: 7.06, financial: false },
  { feature: "★ Tuition fees", value: 6.72, financial: true },
  { feature: "2nd sem eval.", value: 4.13, financial: false },
  { feature: "Age at enrollment", value: 4.00, financial: false },
  { feature: "1st sem eval.", value: 3.36, financial: false },
  { feature: "Admission grade", value: 3.06, financial: false },
  { feature: "Prev. qual. grade", value: 2.82, financial: false },
  { feature: "Unemployment rate", value: 1.83, financial: false },
  { feature: "★ Debtor", value: 1.83, financial: true },
  { feature: "GDP", value: 1.65, financial: false },
  { feature: "Scholarship holder", value: 1.35, financial: false },
  { feature: "Gender", value: 1.08, financial: false },
].sort((a, b) => a.value - b.value);

const corrDebtor = [
  { metric: "1st sem (approved)", test: -0.117, train: -0.107 },
  { metric: "1st sem (grade)", test: -0.100, train: -0.112 },
  { metric: "2nd sem (approved)", test: -0.173, train: -0.147 },
  { metric: "2nd sem (grade)", test: -0.149, train: -0.146 },
];

const corrTuition = [
  { metric: "1st sem (approved)", test: 0.196, train: 0.245 },
  { metric: "1st sem (grade)", test: 0.179, train: 0.266 },
  { metric: "2nd sem (approved)", test: 0.246, train: 0.300 },
  { metric: "2nd sem (grade)", test: 0.231, train: 0.310 },
];

const fullFpr = [
  { variable: "Debtor", modality: "No",  share: 88.4, GB: 5.2,  LR: 3.9,  MLP: 8.1,  RF: 3.6,  flag: false },
  { variable: "Debtor", modality: "Yes", share: 11.6, GB: 28.6, LR: 34.3, MLP: 34.3, RF: 25.7, flag: true  },
  { variable: "Displaced", modality: "No",  share: 43.7, GB: 9.9,  LR: 7.3,  MLP: 12.4, RF: 6.0, flag: false },
  { variable: "Displaced", modality: "Yes", share: 56.3, GB: 4.5,  LR: 4.7,  MLP: 7.8,  RF: 4.2, flag: false },
  { variable: "Gender", modality: "Female", share: 63.8, GB: 4.1,  LR: 3.4,  MLP: 6.5, RF: 3.1, flag: false },
  { variable: "Gender", modality: "Male",   share: 36.2, GB: 12.6, LR: 11.4, MLP: 17.1, RF: 9.1, flag: false },
  { variable: "Scholarship", modality: "No",  share: 74.7, GB: 9.1,  LR: 7.9,  MLP: 12.6, RF: 6.7, flag: false },
  { variable: "Scholarship", modality: "Yes", share: 25.3, GB: 1.1,  LR: 1.1,  MLP: 3.2,  RF: 1.1, flag: false },
  { variable: "Tuition fees", modality: "No",  share: 11.1, GB: 64.3, LR: 35.7, MLP: 64.3, RF: 42.9, flag: true  },
  { variable: "Tuition fees", modality: "Yes", share: 88.9, GB: 5.2,  LR: 5.0,  MLP: 8.3,  RF: 4.0, flag: false },
  { variable: "Father qual.", modality: "Basic",     share: 66.7, GB: 5.2,  LR: 4.4, MLP: 8.4,  RF: 3.9, flag: false },
  { variable: "Father qual.", modality: "Secondary", share: 24.8, GB: 10.2, LR: 7.5, MLP: 12.9, RF: 7.5, flag: false },
  { variable: "Mother qual.", modality: "Basic",        share: 58.8, GB: 7.5, LR: 6.1, MLP: 9.5, RF: 5.8, flag: false },
  { variable: "Mother qual.", modality: "Secondary",    share: 27.2, GB: 3.1, LR: 2.5, MLP: 9.4, RF: 1.9, flag: false },
  { variable: "Nationality", modality: "Portuguese", share: 97.5, GB: 6.7, LR: 5.9, MLP: 9.7, RF: 5.0, flag: false },
];

const modelColors = [C.GB, C.LR, C.MLP, C.RF];
const metrics = ["accuracy", "precision", "recall", "auc"];
const metricLabels = ["Accuracy", "Precision", "Recall", "AUC"];

function Card({ children, style = {} }) {
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: "0.75rem", padding: "1.25rem", ...style }}>
      {children}
    </div>
  );
}

function MiniBar({ value, max = 100, color }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
      <div style={{ flex: 1, height: "5px", background: C.border, borderRadius: "3px" }}>
        <div style={{ width: `${(value / max) * 100}%`, height: "100%", background: color, borderRadius: "3px" }} />
      </div>
      <span style={{ fontSize: "0.78rem", color: C.text, fontFamily: "monospace", width: "3.2rem", textAlign: "right" }}>
        {value.toFixed(1)}%
      </span>
    </div>
  );
}

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1c2128", border: `1px solid ${C.border}`, borderRadius: "0.5rem", padding: "0.75rem", fontSize: "0.78rem" }}>
      <p style={{ color: C.muted, marginBottom: "0.4rem", fontWeight: 600 }}>{label}</p>
      {payload.map(p => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <span style={{ color: C.text }}>{typeof p.value === "number" ? p.value.toFixed(1) + "%" : p.value}</span>
        </p>
      ))}
    </div>
  );
};

function fprColor(v) {
  if (v > 40) return C.amber;
  if (v > 20) return C.rose;
  if (v > 10) return "#fbbf24";
  return C.text;
}

export default function Dashboard() {
  const [tab, setTab] = useState("performance");

  const tabs = [
    { id: "performance", label: "📊 Model Performance" },
    { id: "fpr", label: "⚠️ FPR Disparities" },
    { id: "features", label: "🔍 Feature Importance" },
    { id: "corr", label: "📈 Correlations" },
  ];

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: C.bg, minHeight: "100vh", color: C.text, padding: "1.5rem", boxSizing: "border-box" }}>

      {/* Header */}
      <div style={{ marginBottom: "1.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.4rem" }}>
          <div style={{ width: "4px", height: "2rem", background: C.amber, borderRadius: "2px", flexShrink: 0 }} />
          <h1 style={{ fontSize: "1.3rem", fontWeight: 700, margin: 0 }}>Bias Audit — Student Dropout Prediction</h1>
        </div>
        <p style={{ color: C.muted, fontSize: "0.82rem", paddingLeft: "1.25rem", margin: 0 }}>
          Portuguese secondary education · UCI dataset · 4 ML models evaluated for socio-demographic bias
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "0.25rem", borderBottom: `1px solid ${C.border}`, marginBottom: "1.75rem" }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            padding: "0.5rem 1rem", background: "transparent", border: "none",
            borderBottom: tab === t.id ? `2px solid ${C.amber}` : "2px solid transparent",
            color: tab === t.id ? C.amber : C.muted, cursor: "pointer",
            fontSize: "0.82rem", fontWeight: tab === t.id ? 700 : 400,
            marginBottom: "-1px", transition: "color 0.15s",
          }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── TAB: Performance ── */}
      {tab === "performance" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "1rem", marginBottom: "1rem" }}>

            {/* Table */}
            <Card>
              <p style={{ fontSize: "0.75rem", color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "1rem" }}>Performance Metrics</p>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                    <th style={{ textAlign: "left", color: C.muted, fontWeight: 500, paddingBottom: "0.6rem" }}>Model</th>
                    {metricLabels.map(m => (
                      <th key={m} style={{ textAlign: "right", color: C.muted, fontWeight: 500, paddingBottom: "0.6rem" }}>{m}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {modelData.map((m, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                      <td style={{ padding: "0.65rem 0" }}>
                        <span style={{ background: modelColors[i] + "22", color: modelColors[i], padding: "0.15rem 0.45rem", borderRadius: "0.2rem", fontSize: "0.7rem", marginRight: "0.5rem", fontWeight: 700 }}>{m.short}</span>
                        <span style={{ color: C.muted, fontSize: "0.8rem" }}>{m.model}</span>
                      </td>
                      {metrics.map((key, j) => (
                        <td key={j} style={{ textAlign: "right", fontFamily: "monospace", color: m[key] > 85 ? C.green : C.text }}>
                          {m[key].toFixed(1)}%
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>

            {/* Radar */}
            <Card style={{ display: "flex", flexDirection: "column" }}>
              <p style={{ fontSize: "0.75rem", color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.5rem" }}>Radar Comparison</p>
              <ResponsiveContainer width="100%" height={210}>
                <RadarChart data={radarData} outerRadius={75}>
                  <PolarGrid stroke={C.border} />
                  <PolarAngleAxis dataKey="metric" tick={{ fill: C.muted, fontSize: 11 }} />
                  <PolarRadiusAxis domain={[65, 95]} tick={false} axisLine={false} />
                  {["GB","LR","MLP","RF"].map((k, i) => (
                    <Radar key={k} name={k} dataKey={k} stroke={modelColors[i]} fill={modelColors[i]} fillOpacity={0.08} strokeWidth={1.5} />
                  ))}
                  <Legend iconSize={8} wrapperStyle={{ fontSize: "0.75rem", paddingTop: "0.5rem" }} />
                </RadarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Mini bar cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
            {metrics.map((metric, mi) => (
              <Card key={metric} style={{ padding: "1rem" }}>
                <p style={{ fontSize: "0.7rem", color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.8rem" }}>
                  {metricLabels[mi]}
                </p>
                {modelData.map((m, i) => (
                  <div key={i} style={{ marginBottom: "0.55rem" }}>
                    <p style={{ fontSize: "0.68rem", color: modelColors[i], marginBottom: "0.2rem", fontWeight: 600 }}>{m.short}</p>
                    <MiniBar value={m[metric]} max={100} color={modelColors[i]} />
                  </div>
                ))}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* ── TAB: FPR ── */}
      {tab === "fpr" && (
        <div>
          {/* Alert */}
          <div style={{ background: C.amber + "11", border: `1px solid ${C.amber}44`, borderRadius: "0.65rem", padding: "0.9rem 1rem", marginBottom: "1.25rem", display: "flex", gap: "0.75rem", alignItems: "flex-start" }}>
            <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>⚠️</span>
            <div>
              <p style={{ color: C.amber, fontWeight: 700, marginBottom: "0.2rem", fontSize: "0.875rem" }}>Financial variables drive extreme miscategorisation</p>
              <p style={{ color: C.muted, fontSize: "0.8rem" }}>
                Students with unpaid tuition fees are miscategorised as dropouts at rates up to <strong style={{ color: C.amber }}>64.3%</strong>. Debtors reach up to <strong style={{ color: C.rose }}>34.3%</strong>. The baseline for other groups sits around 5–12% — a 5× to 12× disparity.
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 0.8fr", gap: "1rem", marginBottom: "1rem" }}>
            {/* Bar chart */}
            <Card>
              <p style={{ fontSize: "0.75rem", color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>FPR by Group & Model</p>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={fprData} layout="vertical" margin={{ left: 0, right: 30, top: 0, bottom: 0 }}>
                  <XAxis type="number" domain={[0, 70]} tick={{ fill: C.muted, fontSize: 10 }} unit="%" />
                  <YAxis type="category" dataKey="name" tick={{ fill: C.text, fontSize: 10 }} width={90} />
                  <Tooltip content={<Tip />} />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: "0.75rem" }} />
                  {["GB","LR","MLP","RF"].map((k, i) => (
                    <Bar key={k} dataKey={k} name={k} fill={modelColors[i]} radius={[0, 3, 3, 0]} maxBarSize={8} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </Card>

            {/* Key callouts */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {[
                { label: "Tuition fees — unpaid", values: [["GB", 64.3], ["LR", 35.7], ["MLP", 64.3], ["RF", 42.9]], color: C.amber },
                { label: "Debtor — Yes", values: [["GB", 28.6], ["LR", 34.3], ["MLP", 34.3], ["RF", 25.7]], color: C.rose },
              ].map((item) => (
                <Card key={item.label} style={{ borderColor: item.color + "44" }}>
                  <p style={{ fontSize: "0.78rem", color: item.color, fontWeight: 700, marginBottom: "0.85rem" }}>{item.label}</p>
                  {item.values.map(([model, val]) => (
                    <div key={model} style={{ marginBottom: "0.5rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.18rem" }}>
                        <span style={{ fontSize: "0.72rem", color: C.muted }}>{model}</span>
                        <span style={{ fontSize: "0.72rem", fontFamily: "monospace", color: item.color, fontWeight: 700 }}>{val}%</span>
                      </div>
                      <div style={{ height: "4px", background: C.border, borderRadius: "2px" }}>
                        <div style={{ width: `${val}%`, height: "100%", background: item.color, borderRadius: "2px" }} />
                      </div>
                    </div>
                  ))}
                </Card>
              ))}
              <Card style={{ padding: "0.85rem" }}>
                <p style={{ fontSize: "0.72rem", color: C.muted, marginBottom: "0.5rem" }}>Baseline — Gender (Male)</p>
                <div style={{ display: "flex", justifyContent: "space-around" }}>
                  {[["GB", 12.6], ["LR", 11.4], ["MLP", 17.1], ["RF", 9.1]].map(([m, v]) => (
                    <div key={m} style={{ textAlign: "center" }}>
                      <div style={{ fontSize: "1rem", fontWeight: 700, fontFamily: "monospace", color: C.text }}>{v}%</div>
                      <div style={{ fontSize: "0.68rem", color: C.muted }}>{m}</div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          {/* Full table */}
          <Card>
            <p style={{ fontSize: "0.75rem", color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.85rem" }}>Complete FPR Table — All Variables</p>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.78rem" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                    {["Variable", "Modality", "Share %", "Gradient Boosting", "Logistic Regression", "MLP", "Random Forest"].map((h, i) => (
                      <th key={h} style={{ padding: "0.4rem 0.75rem", textAlign: i < 2 ? "left" : "right", color: C.muted, fontWeight: 500, paddingBottom: "0.6rem" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {fullFpr.map((row, i) => (
                    <tr key={i} style={{ borderBottom: `1px solid ${C.border}`, background: row.flag ? C.amber + "0d" : "transparent" }}>
                      <td style={{ padding: "0.45rem 0.75rem", color: row.flag ? C.amber : C.muted }}>{row.variable}</td>
                      <td style={{ padding: "0.45rem 0.75rem", color: row.flag ? C.amber : C.text, fontWeight: row.flag ? 700 : 400 }}>
                        {row.flag ? "★ " : ""}{row.modality}
                      </td>
                      <td style={{ padding: "0.45rem 0.75rem", textAlign: "right", fontFamily: "monospace", color: C.muted }}>{row.share}%</td>
                      {[row.GB, row.LR, row.MLP, row.RF].map((v, j) => (
                        <td key={j} style={{ padding: "0.45rem 0.75rem", textAlign: "right", fontFamily: "monospace", fontWeight: v > 20 ? 700 : 400, color: fprColor(v) }}>
                          {v.toFixed(1)}%
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* ── TAB: Feature Importance ── */}
      {tab === "features" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.7fr", gap: "1rem" }}>
            <Card>
              <p style={{ fontSize: "0.75rem", color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.75rem" }}>
                Permutation Importance — <span style={{ color: C.amber }}>★ Financial variables</span>
              </p>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={featureData} layout="vertical" margin={{ left: 0, right: 40, top: 0, bottom: 0 }}>
                  <XAxis type="number" domain={[0, 16]} tick={{ fill: C.muted, fontSize: 10 }} unit="%" />
                  <YAxis type="category" dataKey="feature" tick={{ fontSize: 10, fill: C.text }} width={150} />
                  <Tooltip content={<Tip />} formatter={(v) => [`${v.toFixed(2)}%`, "Importance"]} />
                  <Bar dataKey="value" name="Importance" radius={[0, 3, 3, 0]}>
                    {featureData.map((e, i) => (
                      <Cell key={i} fill={e.financial ? C.amber : C.blue} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <Card>
                <p style={{ fontSize: "0.75rem", color: C.muted, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "1rem" }}>Top 5 Predictors</p>
                {[...featureData].reverse().slice(0, 5).map((f, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.65rem", marginBottom: "0.75rem" }}>
                    <span style={{ width: "1.4rem", height: "1.4rem", background: C.border, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.65rem", color: C.muted, flexShrink: 0 }}>
                      {i + 1}
                    </span>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "0.75rem", color: f.financial ? C.amber : C.text, marginBottom: "0.2rem" }}>{f.feature}</p>
                      <div style={{ height: "4px", background: C.border, borderRadius: "2px" }}>
                        <div style={{ width: `${(f.value / 15.09) * 100}%`, height: "100%", background: f.financial ? C.amber : C.blue, borderRadius: "2px" }} />
                      </div>
                    </div>
                    <span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: f.financial ? C.amber : C.text, fontWeight: 600 }}>{f.value.toFixed(2)}%</span>
                  </div>
                ))}
              </Card>

              <Card style={{ borderColor: C.amber + "44", background: C.amber + "06" }}>
                <p style={{ color: C.amber, fontWeight: 700, fontSize: "0.82rem", marginBottom: "0.6rem" }}>🔑 Key Finding</p>
                <p style={{ color: C.muted, fontSize: "0.77rem", lineHeight: "1.65" }}>
                  Academic performance (grades & unit completions) dominates predictions.
                  <strong style={{ color: C.amber }}> "Tuition fees up to date"</strong> ranks 5th at 6.72% — above unemployment rate, GDP, and all demographic variables.
                  Financial status is structurally embedded in what the model calls "dropout risk".
                </p>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* ── TAB: Correlations ── */}
      {tab === "corr" && (
        <div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            {/* Debtor table */}
            <Card>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                <div style={{ width: "3px", height: "1.1rem", background: C.rose, borderRadius: "2px" }} />
                <p style={{ fontWeight: 700, fontSize: "0.875rem" }}>Debtor (Yes)</p>
                <span style={{ fontSize: "0.72rem", color: C.muted }}>correlation with grades</span>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                    <th style={{ textAlign: "left", color: C.muted, fontWeight: 500, paddingBottom: "0.5rem" }}>Metric</th>
                    <th style={{ textAlign: "right", color: "#60a5fa", fontWeight: 500, paddingBottom: "0.5rem" }}>Test</th>
                    <th style={{ textAlign: "right", color: "#34d399", fontWeight: 500, paddingBottom: "0.5rem" }}>Train</th>
                    <th style={{ textAlign: "right", color: C.muted, fontWeight: 500, paddingBottom: "0.5rem" }}>Δ</th>
                  </tr>
                </thead>
                <tbody>
                  {corrDebtor.map((r, i) => {
                    const d = (r.test - r.train).toFixed(3);
                    return (
                      <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                        <td style={{ padding: "0.55rem 0", color: C.text, fontSize: "0.78rem" }}>{r.metric}</td>
                        <td style={{ padding: "0.55rem 0", textAlign: "right", fontFamily: "monospace", color: "#60a5fa" }}>{r.test.toFixed(3)}</td>
                        <td style={{ padding: "0.55rem 0", textAlign: "right", fontFamily: "monospace", color: "#34d399" }}>{r.train.toFixed(3)}</td>
                        <td style={{ padding: "0.55rem 0", textAlign: "right", fontFamily: "monospace", color: C.muted, fontSize: "0.72rem" }}>{d > 0 ? "+" : ""}{d}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div style={{ marginTop: "0.85rem", padding: "0.65rem", background: C.rose + "11", borderRadius: "0.4rem", border: `1px solid ${C.rose}33` }}>
                <p style={{ fontSize: "0.75rem", color: C.muted }}>
                  Debtor correlations are <strong style={{ color: C.rose }}>relatively stable</strong> between Train and Test — suggesting structural bias rather than simple distributional shift.
                </p>
              </div>
            </Card>

            {/* Tuition table */}
            <Card>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1rem" }}>
                <div style={{ width: "3px", height: "1.1rem", background: C.amber, borderRadius: "2px" }} />
                <p style={{ fontWeight: 700, fontSize: "0.875rem" }}>Tuition fees (No)</p>
                <span style={{ fontSize: "0.72rem", color: C.muted }}>correlation with grades</span>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8rem" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${C.border}` }}>
                    <th style={{ textAlign: "left", color: C.muted, fontWeight: 500, paddingBottom: "0.5rem" }}>Metric</th>
                    <th style={{ textAlign: "right", color: "#60a5fa", fontWeight: 500, paddingBottom: "0.5rem" }}>Test</th>
                    <th style={{ textAlign: "right", color: "#34d399", fontWeight: 500, paddingBottom: "0.5rem" }}>Train</th>
                    <th style={{ textAlign: "right", color: C.amber, fontWeight: 500, paddingBottom: "0.5rem" }}>Δ</th>
                  </tr>
                </thead>
                <tbody>
                  {corrTuition.map((r, i) => {
                    const d = (r.test - r.train).toFixed(3);
                    return (
                      <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                        <td style={{ padding: "0.55rem 0", color: C.text, fontSize: "0.78rem" }}>{r.metric}</td>
                        <td style={{ padding: "0.55rem 0", textAlign: "right", fontFamily: "monospace", color: "#60a5fa" }}>{r.test.toFixed(3)}</td>
                        <td style={{ padding: "0.55rem 0", textAlign: "right", fontFamily: "monospace", color: "#34d399" }}>{r.train.toFixed(3)}</td>
                        <td style={{ padding: "0.55rem 0", textAlign: "right", fontFamily: "monospace", color: C.amber, fontSize: "0.72rem" }}>{d > 0 ? "+" : ""}{d}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div style={{ marginTop: "0.85rem", padding: "0.65rem", background: C.amber + "11", borderRadius: "0.4rem", border: `1px solid ${C.amber}33` }}>
                <p style={{ fontSize: "0.75rem", color: C.muted }}>
                  Train correlations are <strong style={{ color: C.amber }}>significantly stronger</strong> than Test — models overlearn the "fees unpaid → low grades → dropout" pattern.
                </p>
              </div>
            </Card>
          </div>

          {/* Explanation */}
          <Card style={{ borderColor: C.amber + "33" }}>
            <p style={{ fontWeight: 700, fontSize: "0.875rem", marginBottom: "0.75rem" }}>🧠 The Distributional Shift Explanation</p>
            <p style={{ color: C.muted, fontSize: "0.82rem", lineHeight: "1.75" }}>
              During training, models learn two correlations simultaneously:{" "}
              <strong style={{ color: "#60a5fa" }}>grades predict dropout</strong>, and{" "}
              <strong style={{ color: C.amber }}>financially unstable students tend to have lower grades and drop out more</strong>.
              In the test set, however, those correlations are weaker — financially struggling students are not necessarily poor academic performers.
              As a result, models penalise these students based on patterns learned in training that don't generalise, producing a systematic and unfair bias against financially vulnerable individuals.
              The <strong style={{ color: C.RF }}>Random Forest</strong> is less affected because ensemble tree methods are architecturally designed to overfit less on training distributions.
            </p>
          </Card>
        </div>
      )}

      {/* Footer */}
      <div style={{ marginTop: "2rem", paddingTop: "1rem", borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between" }}>
        <p style={{ color: C.muted, fontSize: "0.7rem" }}>★ Financial variables · UCI Student Performance Dataset · Portugal</p>
        <p style={{ color: C.muted, fontSize: "0.7rem" }}>4 models · FPR bias analysis · Permutation importance</p>
      </div>
    </div>
  );
}
