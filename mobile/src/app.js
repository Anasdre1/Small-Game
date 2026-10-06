// Crosswind app glue: shared online leaderboard (Firebase) + native app behaviour (Capacitor).
// Bundled into ../crosswind-app.js by `npm run bundle` so no code is loaded from the internet at runtime.

import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import {
  initializeFirestore, doc, getDoc, setDoc, collection, query, orderBy, limit, getDocs,
  getCountFromServer, where, serverTimestamp, addDoc,
} from "firebase/firestore";
import { Capacitor } from "@capacitor/core";
import { App } from "@capacitor/app";
import { StatusBar } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";

const platform = Capacitor.getPlatform(); // "ios" | "android" | "web"

// ---------- nickname rules (kept in sync with firebase/firestore.rules) ----------
const NAME_RE = /^[A-Za-z0-9 _-]{2,14}$/;
const BLOCKED = ["fuck","shit","bitch","cunt","nigg","fag","whore","slut","dick","cock","pussy","rape","nazi","hitler","porn","sex","anal","penis","vagina","retard","kys"];
export function checkName(raw) {
  const name = String(raw || "").trim().replace(/\s+/g, " ");
  if (!NAME_RE.test(name)) return { ok: false, name, error: "Use 2–14 letters, numbers, spaces, - or _." };
  const flat = name.toLowerCase().replace(/[^a-z]/g, "").replace(/0/g, "o").replace(/1/g, "i").replace(/3/g, "e");
  if (BLOCKED.some(w => flat.includes(w))) return { ok: false, name, error: "Please pick a different name." };
  return { ok: true, name };
}

// ---------- leaderboard ----------
const cfg = window.CROSSWIND_FIREBASE;
let db = null, auth = null, uid = null, readyPromise = null;

function init() {
  if (readyPromise) return readyPromise;
  if (!cfg || !cfg.apiKey || !cfg.projectId) {
    readyPromise = Promise.resolve(false);
    return readyPromise;
  }
  readyPromise = (async () => {
    try {
      const app = initializeApp(cfg);
      db = initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
      auth = getAuth(app);
      await new Promise(res => { const off = onAuthStateChanged(auth, u => { off(); res(u); }); });
      if (!auth.currentUser) await signInAnonymously(auth);
      uid = auth.currentUser.uid;
      return true;
    } catch (e) {
      console.warn("Leaderboard unavailable:", e);
      return false;
    }
  })();
  return readyPromise;
}

const withTimeout = (p, ms = 8000) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), ms))]);

async function top(n = 25) {
  if (!(await init())) return { ok: false, reason: "offline-config" };
  try {
    const snap = await withTimeout(getDocs(query(collection(db, "scores"), orderBy("score", "desc"), limit(n))));
    return { ok: true, uid, rows: snap.docs.map(d => ({ id: d.id, ...d.data() })) };
  } catch (e) {
    return { ok: false, reason: "network" };
  }
}

async function myBest() {
  if (!(await init())) return null;
  try { const s = await withTimeout(getDoc(doc(db, "scores", uid))); return s.exists() ? s.data() : null; }
  catch { return null; }
}

async function submit({ name, score, kills, dist }) {
  const check = checkName(name);
  if (!check.ok) return { ok: false, reason: "name", error: check.error };
  if (!(await init())) return { ok: false, reason: "offline-config" };
  try {
    const ref = doc(db, "scores", uid);
    const prev = await withTimeout(getDoc(ref));
    const prevScore = prev.exists() ? prev.data().score : -1;
    const best = Math.max(prevScore, score);
    // One entry per player: always keep their best score; let them rename.
    const data = prevScore >= score
      ? { ...prev.data(), name: check.name, ts: serverTimestamp() }
      : { name: check.name, score: Math.floor(score), kills: Math.floor(kills), dist: Math.round(dist * 10) / 10, platform, ts: serverTimestamp() };
    await withTimeout(setDoc(ref, data));
    const higher = await withTimeout(getCountFromServer(query(collection(db, "scores"), where("score", ">", best))));
    return { ok: true, best, rank: higher.data().count + 1, improved: score > prevScore };
  } catch (e) {
    console.warn(e);
    return { ok: false, reason: "network" };
  }
}

async function report(targetId, name) {
  if (!(await init())) return { ok: false };
  try {
    await withTimeout(addDoc(collection(db, "reports"), { target: String(targetId), name: String(name).slice(0, 14), by: uid, ts: serverTimestamp() }));
    return { ok: true };
  } catch (e) { return { ok: false }; }
}

window.Leaderboard = { init, top, submit, myBest, report, checkName, get enabled() { return !!(cfg && cfg.apiKey); }, get uid() { return uid; } };

// ---------- native app behaviour ----------
window.Native = {
  platform,
  isNative: Capacitor.isNativePlatform(),
  onBack: null,   // set by the game: return true if it handled the back button
  onPause: null,  // set by the game: called when the app goes to the background
};

if (Capacitor.isNativePlatform()) {
  StatusBar.hide().catch(() => {});
  if (platform === "android") StatusBar.setOverlaysWebView({ overlay: true }).catch(() => {});
  App.addListener("backButton", () => {
    if (window.Native.onBack && window.Native.onBack()) return;
    App.minimizeApp().catch(() => App.exitApp());
  });
  App.addListener("pause", () => window.Native.onPause && window.Native.onPause());
  window.addEventListener("load", () => setTimeout(() => SplashScreen.hide().catch(() => {}), 200));
}

init();
