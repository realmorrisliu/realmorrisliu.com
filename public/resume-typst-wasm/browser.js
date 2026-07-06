import init, { compile_resume_pdf, compile_resume_preview } from "./resume_typst_wasm.js";

window.resumeTypstWasm = {
  default: init,
  compile_resume_pdf,
  compile_resume_preview,
};

window.dispatchEvent(new CustomEvent("resume-typst-wasm-ready"));
