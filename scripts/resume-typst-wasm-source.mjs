// Where the prebuilt Typst wasm lives. It is 20+ MB, so it stays out of git:
// built locally with `pnpm build:typst-wasm`, published once with
// `pnpm upload:typst-wasm`, and downloaded at build time (CI included).
//
// Bump WASM_VERSION whenever crates/resume-typst-wasm changes, then rebuild
// and re-upload. Old versions stay readable, so a rollback still builds.
export const WASM_VERSION = "v1";

// wasm-pack owns this directory, so nothing hand-written can live here.
export const WASM_DIR = "public/resume-typst-wasm";

// Emitted by wasm-pack, downloaded from R2 when absent.
export const WASM_FILES = ["resume_typst_wasm.js", "resume_typst_wasm_bg.wasm"];

// Hand-written bridge that exposes the wasm exports on window. Tracked in git
// and copied into WASM_DIR at build time.
export const WASM_BRIDGE_SOURCE = "crates/resume-typst-wasm/browser.js";
export const WASM_BRIDGE_FILE = "browser.js";

export const wasmSourceBaseUrl = () =>
  (
    process.env.RESUME_TYPST_WASM_SOURCE_BASE_URL?.trim() ||
    `https://assets.realmorrisliu.com/resume-typst-wasm/${WASM_VERSION}`
  ).replace(/\/+$/, "");
