type ResumeWasmModule = {
  default: (
    moduleOrPath?:
      | string
      | URL
      | Request
      | Response
      | BufferSource
      | WebAssembly.Module
      | { module_or_path: string | URL | Request | Response | BufferSource | WebAssembly.Module }
  ) => Promise<unknown>;
  compile_resume_preview: (
    mainPath: string,
    files: Record<string, string>,
    fonts: Uint8Array[]
  ) => {
    pages: string[];
    warnings: string[];
  };
  compile_resume_pdf: (
    mainPath: string,
    files: Record<string, string>,
    fonts: Uint8Array[]
  ) => {
    pdf_bytes: Uint8Array;
    warnings: string[];
  };
};

type ResumeWasmWindow = Window &
  typeof globalThis & {
    resumeTypstWasm?: ResumeWasmModule;
  };

type ResumeIdleWindow = Window &
  typeof globalThis & {
    requestIdleCallback?: (callback: () => void, options?: { timeout?: number }) => number;
  };

type ResumePdfApp = HTMLElement & {
  dataset: DOMStringMap & {
    mainPath: string;
    dataPath: string;
    dataUrl: string;
    fileName: string;
    fontUrls: string;
    wasmBaseUrl: string;
    statusLoading: string;
    statusCompiling: string;
    statusReady: string;
    statusPdf: string;
    statusFailed: string;
  };
};

let wasmModulePromise: Promise<ResumeWasmModule> | undefined;
let wasmBaseUrl = "/resume-typst-wasm";

const assetUrl = (path: string) => {
  const base = wasmBaseUrl.replace(/\/+$/, "");
  return `${base}/${path.replace(/^\/+/, "")}`;
};

const loadWasmModule = (baseUrl: string) => {
  const runtimeWindow = window as ResumeWasmWindow;
  wasmBaseUrl = baseUrl || wasmBaseUrl;

  if (runtimeWindow.resumeTypstWasm) {
    return Promise.resolve(runtimeWindow.resumeTypstWasm);
  }

  if (wasmModulePromise) {
    return wasmModulePromise;
  }

  wasmModulePromise = new Promise<ResumeWasmModule>((resolve, reject) => {
    const cleanup = () => {
      window.removeEventListener("resume-typst-wasm-ready", onReady);
    };

    const onReady = () => {
      cleanup();
      if (runtimeWindow.resumeTypstWasm) {
        resolve(runtimeWindow.resumeTypstWasm);
        return;
      }

      reject(new Error("Typst WASM module loaded without exposing runtime exports"));
    };

    const script = document.createElement("script");
    script.type = "module";
    script.src = assetUrl("browser.js");
    script.crossOrigin = "anonymous";
    script.dataset.resumeTypstWasm = "true";
    script.addEventListener(
      "error",
      () => {
        cleanup();
        wasmModulePromise = undefined;
        reject(new Error("Failed to load Typst WASM browser bridge"));
      },
      { once: true }
    );

    window.addEventListener("resume-typst-wasm-ready", onReady, { once: true });
    document.head.append(script);
  });

  return wasmModulePromise;
};

const app = document.getElementById("resume-pdf-app") as ResumePdfApp | null;

if (app) {
  const statusEl = document.getElementById("resume-pdf-status");
  const errorEl = document.getElementById("resume-pdf-error");
  const downloadButton = (document.getElementById("resume-pdf-download") ??
    document.getElementById("print-button")) as HTMLButtonElement | null;
  const retryButton = document.getElementById("resume-pdf-retry") as HTMLButtonElement | null;

  type ResumeCompileAssets = {
    wasmModule: ResumeWasmModule;
    files: Record<string, string>;
    fonts: Uint8Array[];
  };

  let assetsPromise: Promise<ResumeCompileAssets> | undefined;

  const setStatus = (
    state: "loading" | "compiling" | "ready" | "pdf" | "failed",
    message: string
  ) => {
    app.dataset.state = state;
    if (statusEl) {
      statusEl.textContent = message;
    }
  };

  const setError = (message: string) => {
    if (errorEl) {
      errorEl.textContent = message;
      errorEl.classList.remove("hidden");
    }
    retryButton?.classList.remove("hidden");
  };

  const clearError = () => {
    if (errorEl) {
      errorEl.textContent = "";
      errorEl.classList.add("hidden");
    }
    retryButton?.classList.add("hidden");
  };

  const fetchText = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }
    return response.text();
  };

  const fetchBytes = async (url: string) => {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.status}`);
    }
    return new Uint8Array(await response.arrayBuffer());
  };

  const loadCompileAssets = async () => {
    if (!assetsPromise) {
      assetsPromise = (async () => {
        const fontUrls = JSON.parse(app.dataset.fontUrls) as string[];
        wasmBaseUrl = app.dataset.wasmBaseUrl || wasmBaseUrl;
        const wasmBinaryUrl = assetUrl("resume_typst_wasm_bg.wasm");
        const wasmResponsePromise = fetch(wasmBinaryUrl);
        const wasmModulePromise = (async () => {
          const wasmModule = await loadWasmModule(app.dataset.wasmBaseUrl);
          const wasmResponse = await wasmResponsePromise;
          if (!wasmResponse.ok) {
            throw new Error(`Failed to fetch ${wasmBinaryUrl}: ${wasmResponse.status}`);
          }
          await wasmModule.default({ module_or_path: wasmResponse });
          return wasmModule;
        })();

        const [wasmModule, sharedSource, entrySource, resumeData, ...fonts] = await Promise.all([
          wasmModulePromise,
          fetchText("/resume-typst/resume.typ"),
          fetchText(`/resume-typst/${app.dataset.mainPath}`),
          fetchText(app.dataset.dataUrl),
          ...fontUrls.map(fetchBytes),
        ]);

        return {
          wasmModule,
          files: {
            "resume.typ": sharedSource,
            [app.dataset.mainPath]: entrySource,
            [app.dataset.dataPath]: resumeData,
          },
          fonts,
        };
      })();
    }

    try {
      return await assetsPromise;
    } catch (error) {
      assetsPromise = undefined;
      throw error;
    }
  };

  const downloadPdf = (pdfBytes: Uint8Array) => {
    const pdfBuffer = new ArrayBuffer(pdfBytes.byteLength);
    new Uint8Array(pdfBuffer).set(pdfBytes);
    const blob = new Blob([pdfBuffer], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);

    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = app.dataset.fileName;
    anchor.click();

    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const setDownloadReady = () => {
    if (downloadButton) {
      downloadButton.disabled = false;
      downloadButton.onclick = compilePdf;
    }
  };

  const compilePdf = async () => {
    if (!downloadButton) {
      return;
    }

    clearError();
    downloadButton.disabled = true;
    downloadButton.onclick = null;

    try {
      setStatus("pdf", app.dataset.statusPdf);
      const { wasmModule, files, fonts } = await loadCompileAssets();
      const result = wasmModule.compile_resume_pdf(app.dataset.mainPath, files, fonts);
      downloadPdf(result.pdf_bytes);
      setStatus("ready", app.dataset.statusReady);
      setDownloadReady();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setStatus("failed", app.dataset.statusFailed);
      setError(message);
      setDownloadReady();
    }
  };

  const shouldWarmCompileAssets = () => {
    const connection = (
      navigator as typeof navigator & {
        connection?: {
          effectiveType?: string;
          saveData?: boolean;
        };
      }
    ).connection;
    const effectiveType = connection?.effectiveType?.toLowerCase();

    return !connection?.saveData && effectiveType !== "2g" && effectiveType !== "slow-2g";
  };

  const warmCompileAssets = () => {
    void loadCompileAssets().catch(() => {
      assetsPromise = undefined;
    });
  };

  const scheduleCompileAssetWarmup = () => {
    if (!shouldWarmCompileAssets()) {
      return;
    }

    const idleWindow = window as ResumeIdleWindow;
    const scheduleIdleWarmup = () => {
      if (idleWindow.requestIdleCallback) {
        idleWindow.requestIdleCallback(warmCompileAssets, { timeout: 2000 });
        return;
      }

      window.setTimeout(warmCompileAssets, 1200);
    };

    if (document.readyState === "complete") {
      scheduleIdleWarmup();
      return;
    }

    window.addEventListener("load", scheduleIdleWarmup, { once: true });
  };

  retryButton?.addEventListener("click", compilePdf);
  setStatus("ready", app.dataset.statusReady);
  setDownloadReady();
  scheduleCompileAssetWarmup();
}
