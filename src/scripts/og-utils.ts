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
