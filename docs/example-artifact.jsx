import { useState } from "react";

const PHASES = {
  prep: { label: "準備", color: "#4a9eff", icon: "🔪" },
  heat: { label: "加熱", color: "#ff6b35", icon: "🔥" },
  finish: { label: "仕上げ", color: "#7ecf52", icon: "✨" },
};

const STEPS = [
  {
    phase: "prep",
    title: "玄米を温める",
    actions: [
      "炊いた玄米【シンク下】を電子レンジで温め直す（600W 2分）。",
    ],
    hint: "加熱中に次の切り物へ進もう。",
  },
  {
    phase: "prep",
    title: "野菜を切る",
    actions: [
      "キャベツをざく切り（3cm角くらい）にする。",
      "もやしをザルで軽く洗う。",
      "キャベツともやしをまとめて「皿A」に入れる。",
      "ねぎの白い部分を斜め薄切りにし、「皿A」に追加する（キャベツと同時投入用）。",
      "ねぎの青い部分を粗みじんにし、「皿C」に入れておく（ニンニクと一緒に炒める用）。",
      "大葉を千切りにし、「小皿B」に分けておく（仕上げ用）。",
    ],
    alert: "まな板を軽く洗い、次の肉工程へ。",
    hint: "ねぎは白と青で役割が違う。白=食感、青=香味ベース。",
  },
  {
    phase: "prep",
    title: "ニンニクを切る・合わせ調味料を作る",
    actions: [
      "ニンニクを粗みじん切りにし、「皿C」のねぎの青い部分と合わせる。",
      "「小皿D（合わせ調味料）」に以下を混ぜておく：",
      "　・甜面醤 大さじ1.5【冷蔵庫】",
      "　・醤油 大さじ1【前のラック(中段)】",
      "　・酒 大さじ1【前のラック(中段)】",
      "　・てんさい糖 小さじ1【前のラック(上段)】",
      "　・豆板醤 小さじ1/2〜1（お好みで）【冷蔵庫】",
    ],
    hint: "辛さは豆板醤の量で調整。",
  },
  {
    phase: "heat",
    title: "香味ベースと豚ひき肉を炒める",
    actions: [
      "中華鍋に米油 大さじ1【前のラック(中段)】を入れ、弱火〜中火にかける。",
      "「皿C」のニンニク＋ねぎの青い部分を入れ、香りが立つまで炒める（焦がさない）。",
      "豚ひき肉（150〜200g）を加え、中火〜強火でほぐしながら炒める。",
      "肉の色が8割変わったら、脂が出てパチパチ音がするまでしっかり焼きつける。",
    ],
    hint: "ねぎの青い部分がニンニクと一緒に香味の土台になる。",
  },
  {
    phase: "heat",
    title: "合わせ調味料を入れ、肉味噌にする",
    actions: [
      "「小皿D」の合わせ調味料を鍋に一気に加え、強火で全体に絡める。",
      "水分がほぼ飛んで、照りが出たら肉味噌の完成。いったん「皿E」に取り出す。",
    ],
    hint: "鍋は洗わずそのまま次へ。旨味が残ってる。",
  },
  {
    phase: "heat",
    title: "野菜を炒め、肉味噌と合わせる",
    actions: [
      "同じ中華鍋にごま油 小さじ1【横のラック】を足し、強火にする。",
      "「皿A」のキャベツ・もやし・ねぎ（白い部分）を一気に入れる。",
      "おたまで押さえつけながら30秒〜1分焼く（あまり動かさない）。",
      "軽く焦げ目がついたら、「皿E」の肉味噌を戻して全体をざっと混ぜる。",
    ],
    hint: "もやしとねぎは火が通りやすい。キャベツの焼き目を優先して短時間で。",
  },
  {
    phase: "heat",
    title: "目玉焼きを焼く",
    actions: [
      "炒め物を皿に盛りつけたら、中華鍋を軽く拭く。",
      "米油を少量ひき、卵2個を割り入れる。",
      "弱火〜中火でフタをして2分。白身が固まり黄身が半熟になったら取り出す。",
    ],
    hint: "フタがなければアルミホイルで代用OK。",
  },
  {
    phase: "finish",
    title: "盛りつけ・完成",
    actions: [
      "皿に玄米、肉味噌キャベツ炒めを盛る。",
      "目玉焼きを炒め物の上にのせる。",
      "「小皿B」の大葉をふわっと散らす。",
      "お好みで胡椒【前のラック(上段)】、山椒【前のラック(上段)】をふって完成！",
    ],
    hint: "黄身を崩しながら、玄米と一緒にかき込もう 🍚",
  },
];

const SHOPPING = [];

const INGREDIENTS = [
  { name: "キャベツ", amount: "1/4玉", category: "野菜" },
  { name: "ねぎ", amount: "2〜3本", category: "野菜" },
  { name: "もやし", amount: "1/2袋", category: "野菜" },
  { name: "大葉", amount: "数枚", category: "野菜" },
  { name: "ニンニク", amount: "4〜5片", category: "野菜" },
  { name: "豚ひき肉（粗挽き）", amount: "150〜200g", category: "肉" },
  { name: "卵", amount: "2個", category: "卵" },
];

const DISHES = [
  { id: "皿A", use: "キャベツ＋もやし＋ねぎ白（炒め用）", steps: "2, 6" },
  { id: "小皿B", use: "大葉（千切り・仕上げ用）", steps: "2, 8" },
  { id: "皿C", use: "ニンニク＋ねぎ青（香味ベース）", steps: "2, 3, 4" },
  { id: "小皿D", use: "合わせ調味料", steps: "3, 5" },
  { id: "皿E", use: "肉味噌（一時退避）", steps: "5, 6" },
];

const TIPS = [
  "ねぎは白と青で使い分ける。青い部分→香味ベース、白い部分→食感の具材。",
  "ニンニクとねぎ青は弱火スタートで焦がさず香りを引き出す。",
  "ひき肉は広げて焼きつけ→崩す、を繰り返すとカリッと仕上がる。",
  "キャベツ・もやし・ねぎ白は強火短時間。おたまで押さえて焼き目をつけるのがプロの技。",
  "目玉焼きの黄身は半熟が肉味噌と最高に合う。",
];

/* ─── styles ─── */
const cssVars = {
  "--bg": "#0f1117",
  "--bg-card": "#1a1d27",
  "--bg-card-hover": "#222633",
  "--text": "#e8e6e3",
  "--text-dim": "#8a8f9c",
  "--text-bright": "#ffffff",
  "--border": "#2a2e3a",
  "--prep": PHASES.prep.color,
  "--heat": PHASES.heat.color,
  "--finish": PHASES.finish.color,
};

const s = {
  root: {
    ...cssVars,
    background: "var(--bg)",
    color: "var(--text)",
    fontFamily:
      '"Hiragino Kaku Gothic ProN", "Hiragino Sans", "Noto Sans JP", system-ui, sans-serif',
    WebkitTextSizeAdjust: "100%",
    minHeight: "100vh",
    padding: "1.25rem",
    lineHeight: 1.7,
    fontSize: "1rem",
    boxSizing: "border-box",
    maxWidth: "40rem",
    margin: "0 auto",
  },
  header: {
    textAlign: "center",
    marginBottom: "1.5rem",
    paddingBottom: "1rem",
    borderBottom: "0.0625rem solid var(--border)",
  },
  title: {
    fontSize: "1.6rem",
    fontWeight: 800,
    margin: 0,
    letterSpacing: "-0.02em",
    background: "linear-gradient(135deg, #ff6b35, #ffb347)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: {
    fontSize: "0.85rem",
    color: "var(--text-dim)",
    marginTop: "0.25rem",
  },
  progressWrap: {
    marginTop: "0.75rem",
  },
  progressLabel: {
    fontSize: "0.75rem",
    color: "var(--text-dim)",
    marginBottom: "0.3rem",
  },
  progressBar: {
    height: "0.375rem",
    borderRadius: "0.1875rem",
    background: "#2a2e3a",
    overflow: "hidden",
  },
  progressFill: (pct, color) => ({
    height: "100%",
    width: `${pct}%`,
    background: color,
    borderRadius: "0.1875rem",
    transition: "width 0.4s ease",
  }),
  section: {
    marginBottom: "1rem",
  },
  collapsible: {
    background: "var(--bg-card)",
    borderRadius: "0.75rem",
    border: "0.0625rem solid var(--border)",
    overflow: "hidden",
    marginBottom: "0.75rem",
  },
  collapseHeader: (open) => ({
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0.75rem 1rem",
    cursor: "pointer",
    userSelect: "none",
    fontSize: "0.95rem",
    fontWeight: 600,
    background: open ? "var(--bg-card-hover)" : "transparent",
    transition: "background 0.2s",
  }),
  collapseBody: {
    padding: "0 1rem 0.75rem",
    fontSize: "0.9rem",
  },
  badge: {
    display: "inline-block",
    padding: "0.25rem 0.6rem",
    borderRadius: "1rem",
    fontSize: "0.8rem",
    fontWeight: 600,
    marginRight: "0.4rem",
    marginBottom: "0.4rem",
  },
  table: {
    width: "100%",
    fontSize: "0.85rem",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "0.4rem 0.5rem",
    borderBottom: "0.0625rem solid var(--border)",
    color: "var(--text-dim)",
    fontWeight: 600,
    fontSize: "0.8rem",
  },
  td: {
    padding: "0.4rem 0.5rem",
    borderBottom: "0.0625rem solid #1e2130",
  },
  stepNav: {
    display: "flex",
    flexWrap: "wrap",
    gap: "0.4rem",
    justifyContent: "center",
    marginBottom: "1rem",
  },
  stepDot: (state, color) => ({
    width: "2.2rem",
    height: "2.2rem",
    borderRadius: "50%",
    border:
      state === "current"
        ? `0.15rem solid ${color}`
        : "0.0625rem solid var(--border)",
    background: state === "done" ? color : "var(--bg-card)",
    color:
      state === "done"
        ? "#fff"
        : state === "current"
          ? color
          : "var(--text-dim)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.85rem",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.25s ease",
    opacity: state === "future" ? 0.45 : 1,
  }),
  card: (color) => ({
    background: "var(--bg-card)",
    borderRadius: "0.75rem",
    border: "0.0625rem solid var(--border)",
    borderLeft: `0.25rem solid ${color}`,
    padding: "1.25rem",
    marginBottom: "1rem",
  }),
  phaseLabel: (color) => ({
    fontSize: "0.7rem",
    fontWeight: 700,
    textTransform: "uppercase",
    color: color,
    letterSpacing: "0.08em",
    marginBottom: "0.15rem",
  }),
  stepTitle: {
    fontSize: "1.2rem",
    fontWeight: 700,
    color: "var(--text-bright)",
    marginBottom: "0.75rem",
  },
  alert: {
    background: "rgba(255,107,53,0.12)",
    border: "0.0625rem solid rgba(255,107,53,0.3)",
    borderRadius: "0.5rem",
    padding: "0.6rem 0.8rem",
    fontSize: "0.85rem",
    marginBottom: "0.75rem",
    color: "#ffb088",
  },
  actionList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  actionItem: {
    display: "flex",
    gap: "0.6rem",
    marginBottom: "0.5rem",
    fontSize: "0.95rem",
    lineHeight: 1.65,
  },
  actionNum: (color) => ({
    flexShrink: 0,
    width: "1.5rem",
    height: "1.5rem",
    borderRadius: "50%",
    background: `${color}22`,
    color: color,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "0.75rem",
    fontWeight: 700,
    marginTop: "0.15rem",
  }),
  hint: {
    marginTop: "0.75rem",
    padding: "0.5rem 0.75rem",
    background: "rgba(126,207,82,0.08)",
    borderRadius: "0.5rem",
    fontSize: "0.85rem",
    color: "#a8d89a",
  },
  navButtons: {
    display: "flex",
    gap: "0.75rem",
    marginTop: "0.5rem",
  },
  btn: (primary, color) => ({
    flex: 1,
    padding: "0.75rem",
    borderRadius: "0.6rem",
    border: primary ? "none" : "0.0625rem solid var(--border)",
    background: primary ? color : "var(--bg-card)",
    color: primary ? "#fff" : "var(--text-dim)",
    fontSize: "0.95rem",
    fontWeight: 700,
    cursor: "pointer",
    transition: "opacity 0.2s",
  }),
};

/* ─── sub-components ─── */
function Collapsible({ title, defaultOpen, children }) {
  const [open, setOpen] = useState(defaultOpen || false);
  return (
    <div style={s.collapsible}>
      <div style={s.collapseHeader(open)} onClick={() => setOpen(!open)}>
        <span>{title}</span>
        <span style={{ fontSize: "0.8rem", transition: "transform 0.2s", transform: open ? "rotate(180deg)" : "rotate(0)" }}>▼</span>
      </div>
      {open && <div style={s.collapseBody}>{children}</div>}
    </div>
  );
}

/* ─── main ─── */
export default function CookingAutopilot() {
  const [current, setCurrent] = useState(0);
  const [done, setDone] = useState(new Set());

  const step = STEPS[current];
  const phase = PHASES[step.phase];
  const progress = Math.round((done.size / STEPS.length) * 100);

  function goTo(i) {
    setCurrent(i);
  }
  function markDoneAndNext() {
    const nd = new Set(done);
    nd.add(current);
    setDone(nd);
    if (current < STEPS.length - 1) setCurrent(current + 1);
  }
  function goPrev() {
    if (current > 0) setCurrent(current - 1);
  }

  const isLast = current === STEPS.length - 1;
  const allDone = done.size === STEPS.length || (isLast && done.has(current));

  return (
    <div style={s.root}>
      {/* Header */}
      <header style={s.header}>
        <h1 style={s.title}>ニンニク爆弾の肉味噌キャベツ炒め</h1>
        <p style={s.subtitle}>🧅 ねぎ・もやし増強版 ── 🍳 半熟目玉焼きのせ ── 2人分 × 玄米</p>
        <div style={s.progressWrap}>
          <div style={s.progressLabel}>
            {done.size} / {STEPS.length} ステップ完了
          </div>
          <div style={s.progressBar}>
            <div style={s.progressFill(progress, phase.color)} />
          </div>
        </div>
      </header>

      {/* Info Section */}
      <div style={s.section}>
        {/* Shopping */}
        {SHOPPING.length === 0 && (
          <div style={{ ...s.badge, background: "rgba(126,207,82,0.12)", color: "#a8d89a", marginBottom: "0.75rem" }}>
            🛒 追加購入なし ── 手持ちの食材でOK！
          </div>
        )}

        {/* Tips */}
        <Collapsible title="💡 調理のポイント" defaultOpen={true}>
          <ul style={{ padding: "0 0 0 1.1rem", margin: 0 }}>
            {TIPS.map((t, i) => (
              <li key={i} style={{ marginBottom: "0.35rem", fontSize: "0.88rem", color: "var(--text-dim)" }}>{t}</li>
            ))}
          </ul>
        </Collapsible>

        {/* Ingredients */}
        <Collapsible title="📋 食材リスト">
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>食材</th>
                <th style={s.th}>分量</th>
              </tr>
            </thead>
            <tbody>
              {INGREDIENTS.map((ing, i) => (
                <tr key={i}>
                  <td style={s.td}>{ing.name}</td>
                  <td style={s.td}>{ing.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Collapsible>

        {/* Dishes */}
        <Collapsible title="🍽 皿・器リスト">
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>ID</th>
                <th style={s.th}>用途</th>
                <th style={s.th}>使用</th>
              </tr>
            </thead>
            <tbody>
              {DISHES.map((d, i) => (
                <tr key={i}>
                  <td style={{ ...s.td, fontWeight: 700, color: "var(--text-bright)" }}>{d.id}</td>
                  <td style={s.td}>{d.use}</td>
                  <td style={{ ...s.td, color: "var(--text-dim)", fontSize: "0.8rem" }}>Step {d.steps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Collapsible>
      </div>

      {/* Step Navigation Dots */}
      <div style={s.stepNav}>
        {STEPS.map((st, i) => {
          const ph = PHASES[st.phase];
          const state = done.has(i) ? "done" : i === current ? "current" : "future";
          return (
            <div
              key={i}
              style={s.stepDot(state, ph.color)}
              onClick={() => goTo(i)}
            >
              {done.has(i) ? "✓" : i + 1}
            </div>
          );
        })}
      </div>

      {/* Current Step Card */}
      {allDone ? (
        <div style={{ ...s.card(PHASES.finish.color), textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🎉</div>
          <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--text-bright)" }}>完成！</div>
          <p style={{ color: "var(--text-dim)", fontSize: "0.9rem", marginTop: "0.4rem" }}>
            黄身を崩しながら、玄米と一緒にかき込もう。お疲れさま！
          </p>
        </div>
      ) : (
        <div style={s.card(phase.color)}>
          <div style={s.phaseLabel(phase.color)}>
            {phase.icon} {phase.label}
          </div>
          <div style={s.stepTitle}>
            {current + 1}. {step.title}
          </div>

          {step.alert && <div style={s.alert}>⚠ {step.alert}</div>}

          <ol style={s.actionList}>
            {step.actions.map((a, i) => (
              <li key={i} style={s.actionItem}>
                <span style={s.actionNum(phase.color)}>{i + 1}</span>
                <span>{a}</span>
              </li>
            ))}
          </ol>

          {step.hint && (
            <div style={s.hint}>💡 {step.hint}</div>
          )}

          {/* Nav Buttons */}
          <div style={s.navButtons}>
            {current > 0 && (
              <button style={s.btn(false, phase.color)} onClick={goPrev}>
                ← 前へ
              </button>
            )}
            <button style={s.btn(true, phase.color)} onClick={markDoneAndNext}>
              {isLast ? "🎉 完成！" : "完了して次へ →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
