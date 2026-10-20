CP.theme = {
  LIST: [["auto", "Auto (system)"], ["github-light", "GitHub Light"], ["github-dark", "GitHub Dark"], ["dracula", "Dracula"], ["monokai", "Monokai"], ["vscode-dark", "VS Code Dark"], ["vscode-light", "VS Code Light"]],
  pref: "auto",
  apply() {
    const dark = matchMedia("(prefers-color-scheme: dark)").matches;
    document.documentElement.dataset.theme = this.pref === "auto" ? (dark ? "github-dark" : "github-light") : this.pref;
  },
  init() {
    const sel = document.getElementById("theme");
    sel.innerHTML = this.LIST.map(([v, n]) => `<option value="${v}">${n}</option>`).join("");
    let v = localStorage.getItem("cp-theme") || "auto";
    v = { light: "github-light", dark: "github-dark" }[v] || v;           /* older saved values */
    this.pref = this.LIST.some(t => t[0] === v) ? v : "auto";
    sel.value = this.pref; this.apply();
    sel.onchange = () => { this.pref = sel.value; localStorage.setItem("cp-theme", this.pref); this.apply() };
    matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => this.pref === "auto" && this.apply());
  }
};