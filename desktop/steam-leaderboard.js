// Swaps the game's leaderboard over to Steam's built-in leaderboard when running in the Steam app.
(function () {
  const bridge = window.SteamBridge;
  if (!bridge) return;
  let status = { ready: false, error: "", name: "" };
  const ready = bridge.status().then(s => (status = s));
  window.Leaderboard = {
    get enabled() { return true; },
    usesAccountName: true,
    boardLabel: "Top pilots on Steam.",
    get accountName() { return status.name; },
    checkName: n => ({ ok: true, name: n }),
    async submit({ score }) {
      await ready;
      if (!status.ready) return { ok: false, reason: "steam", error: status.error || "Steam isn't available." };
      const r = await bridge.submit(score);
      if (!r.ok) return { ok: false, reason: "network" };
      return { ok: true, improved: r.improved, rank: r.rank, best: r.best ?? score };
    },
    async top(n) {
      await ready;
      if (!status.ready) return { ok: false, reason: "steam", error: status.error || "Steam isn't available." };
      return bridge.top(n);
    },
  };
  window.CrosswindDesktop = { quit: bridge.quit, toggleFullscreen: bridge.toggleFullscreen };
})();
