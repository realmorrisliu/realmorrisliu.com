// OG Image 生成工具函数

/**
 * 等待字体加载完成
 */
export async function waitForFonts(): Promise<void> {
  if ("fonts" in document) {
    await document.fonts.ready;
  } else {
    // 降级方案：等待一段时间
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

/**
 * 终端启动动画控制器
 */
export class TerminalBootAnimation {
  private readonly STORAGE_KEY = "og-generator-visited";
  private terminalBoot: HTMLElement | null;
  private asciiLogo: HTMLElement | null;
  private bootSequence: HTMLElement | null;
  private isSkipped = false;

  constructor() {
    this.terminalBoot = document.getElementById("terminal-boot");
    this.asciiLogo = document.getElementById("ascii-logo");
    this.bootSequence = document.getElementById("boot-sequence");
  }

  /**
   * 初始化动画
   */
  public init(): void {
    if (!this.terminalBoot || !this.asciiLogo || !this.bootSequence) return;

    const hasVisited = localStorage.getItem(this.STORAGE_KEY);
    if (hasVisited) return;

    this.setupEventListeners();
    this.startAnimation();
  }

  private setupEventListeners(): void {
    const handleKeydown = (e: KeyboardEvent) => {
      this.skipAnimation();
      document.removeEventListener("keydown", handleKeydown);
    };

    const handleClick = () => {
      this.skipAnimation();
      this.terminalBoot?.removeEventListener("click", handleClick);
    };

    document.addEventListener("keydown", handleKeydown);
    this.terminalBoot?.addEventListener("click", handleClick);
  }

  private skipAnimation(): void {
    if (this.isSkipped || !this.terminalBoot) return;
    
    this.isSkipped = true;
    localStorage.setItem(this.STORAGE_KEY, "true");
    this.terminalBoot.classList.add("fade-out");
    
    setTimeout(() => {
      if (this.terminalBoot) {
        this.terminalBoot.style.display = "none";
      }
    }, 500);
  }

  private startAnimation(): void {
    // Phase 1: 显示 ASCII logo
    setTimeout(() => {
      if (this.isSkipped || !this.asciiLogo) return;
      this.asciiLogo.classList.add("show");
    }, 500);

    // Phase 2: 显示启动序列
    setTimeout(() => {
      if (this.isSkipped || !this.bootSequence) return;
      this.bootSequence.classList.add("show");
      this.typeSequence();
    }, 1500);
  }

  private typeSequence(): void {
    const lines = [
      { id: "line1", text: "Morris Liu Terminal v1.0" },
      { id: "line2", text: "System initialized..." },
      { id: "line3", text: "🎉 Congratulations! You found the easter egg!" },
      { id: "line4", text: "Loading personal workspace..." },
      { id: "line5", text: "Welcome to the OG Generator." },
      { id: "continue-text", text: "Press any key to continue..." },
    ];
    
    let currentLineIndex = 0;

    const typeLine = (): void => {
      if (this.isSkipped || currentLineIndex >= lines.length) {
        this.startCountdown();
        return;
      }

      const currentLine = lines[currentLineIndex];
      const lineElement = document.getElementById(currentLine.id);
      if (!lineElement) {
        currentLineIndex++;
        setTimeout(typeLine, 100);
        return;
      }

      lineElement.textContent = "";
      lineElement.classList.add("typing-line");

      let charIndex = 0;
      const typeChar = (): void => {
        if (this.isSkipped) return;

        if (charIndex < currentLine.text.length) {
          lineElement.textContent += currentLine.text[charIndex];
          charIndex++;
          setTimeout(typeChar, 50);
        } else {
          lineElement.classList.remove("typing-line");
          lineElement.classList.add("typing-done");
          currentLineIndex++;
          setTimeout(typeLine, 500);
        }
      };

      typeChar();
    };

    typeLine();
  }

  private startCountdown(): void {
    const countdownElement = document.getElementById("countdown");
    if (!countdownElement) return;

    let countdown = 4;

    const countdownInterval = setInterval(() => {
      if (this.isSkipped) {
        clearInterval(countdownInterval);
        return;
      }

      countdown--;
      if (countdown > 0) {
        countdownElement.textContent = `(${countdown})`;
      } else {
        clearInterval(countdownInterval);
        this.skipAnimation();
      }
    }, 1000);
  }
}

/**
 * OG Generator 编辑器控制器
 */
export class OGGeneratorEditor {
  constructor() {
    this.initializeControls();
  }

  private initializeControls(): void {
    this.setupGenerateButton();
    this.setupResetButton();
    this.setupTaglineSuggestions();
    this.setupEditableText();
  }

  private setupGenerateButton(): void {
    const generateBtn = document.getElementById("generateBtn");
    generateBtn?.addEventListener("click", () => {
      const name = encodeURIComponent(
        getElementText('[data-original="Morris Liu"]', "Morris Liu")
      );
      const passion = encodeURIComponent(
        getElementText('[data-original="Building tools that matter"]', "Building tools that matter")
      );
      window.location.href = `/og-preview?name=${name}&passion=${passion}`;
    });
  }

  private setupResetButton(): void {
    const resetBtn = document.getElementById("resetBtn");
    resetBtn?.addEventListener("click", () => {
      document.querySelectorAll(".editable-text").forEach(el => {
        if (!(el instanceof HTMLElement)) return;
        const original = el.getAttribute("data-original");
        if (original) el.textContent = original;
      });
    });
  }

  private setupTaglineSuggestions(): void {
    document.querySelectorAll(".tagline-suggestion").forEach(el => {
      if (!(el instanceof HTMLElement)) return;
      el.addEventListener("click", () => {
        const passionEl = document.querySelector('[data-original="Building tools that matter"]');
        if (passionEl instanceof HTMLElement && el.textContent) {
          passionEl.textContent = el.textContent;
        }
      });
    });
  }

  private setupEditableText(): void {
    document.querySelectorAll(".editable-text").forEach(el => {
      if (!(el instanceof HTMLElement)) return;
      el.addEventListener("keydown", e => {
        if (e.key === "Enter") {
          e.preventDefault();
          el.blur();
        }
      });
    });
  }
}

/**
 * 1:1 复制 HTML 样式到 Canvas 生成 OG 图片
 */
export async function generateOGImage(): Promise<HTMLCanvasElement> {
  const container = document.getElementById("ogContainer");
  if (!container) throw new Error("Container not found");

  const scale = 2; // 2x 像素密度
  const canvas = document.createElement("canvas");
  canvas.width = 1200 * scale;
  canvas.height = 630 * scale;
  canvas.style.width = "1200px";
  canvas.style.height = "630px";

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Failed to get 2D context");

  ctx.scale(scale, scale);

  // 启用文字抗锯齿
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // 背景
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, 1200, 630);

  // 获取容器位置
  const containerRect = container.getBoundingClientRect();

  // 获取终端内容容器内的直接文本元素
  const terminalContent = container.querySelector(".absolute");
  const textElements = terminalContent ? terminalContent.children : [];

  for (const element of textElements) {
    if (!(element instanceof HTMLElement)) continue;

    const rect = element.getBoundingClientRect();
    const styles = getComputedStyle(element);

    // 计算相对于容器的位置
    const x = rect.left - containerRect.left;
    const y = rect.top - containerRect.top;

    // 设置字体
    const fontSize = parseInt(styles.fontSize);
    const fontFamily = styles.fontFamily;
    ctx.font = `${fontSize}px ${fontFamily}`;

    // 设置颜色
    ctx.fillStyle = styles.color;

    // 设置文本基线
    ctx.textBaseline = "top";

    // 绘制文本
    const text = element.textContent?.trim();
    if (text) {
      ctx.fillText(text, x, y);
    }
  }

  return canvas;
}

/**
 * 下载 Canvas 为 PNG 图片
 */
export function downloadCanvas(canvas: HTMLCanvasElement, filename?: string): void {
  const link = document.createElement("a");
  link.download = filename || `og-image-${new Date().getTime()}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

/**
 * 从 DOM 元素获取文本内容
 */
export function getElementText(selector: string, fallback: string): string {
  const element = document.querySelector(selector);
  return (element instanceof HTMLElement ? element.textContent : null) || fallback;
}
