/* Summary stats, print header (with profile links), print button */
CP.report = {
  update() {
    const s = CP.state, e = s.entries, total = e.reduce((a, x) => a + x.dur, 0);
    const span = e.length ? Math.max(...e.map(x => x.end)) - Math.min(...e.map(x => x.start)) : 0;
    const n = d => e.filter(x => x.diff === d).length, col = d => `<span style="color:var(--${d})">${n(d)}</span>`;
    document.getElementById("stats").innerHTML = [
      [e.length, "Problems solved"], [CP.hms(total), "Time on problems"], [CP.hms(span), "Day span (first start → last finish)"],
      [e.length ? CP.hms(total / e.length) : "00:00:00", "Average per problem"],
      [`${col("easy")} · ${col("medium")} · ${col("hard")}`, "Easy · Medium · Hard"],
      [new Set(e.flatMap(x => x.tags)).size, "Distinct topics"]
    ].map(([v, k]) => `<div class="stat"><b>${v}</b><span>${k}</span></div>`).join("");
    const p = s.profile, link = (u, t) => `<a href="${u}">${t}</a>`;
    document.getElementById("rName").textContent = p.name || "Competitive Programmer";
    document.getElementById("rDate").textContent = new Date().toLocaleDateString([], { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    document.getElementById("rLinks").innerHTML =
      (p.cf ? link(CP.platforms.url("cf", p.cf), "codeforces.com/profile/" + CP.esc(p.cf)) : "") +
      (p.lc ? link(CP.platforms.url("lc", p.lc), "leetcode.com/u/" + CP.esc(p.lc)) : "");
  },
  init() { document.getElementById("printBtn").onclick = () => window.print() }
};