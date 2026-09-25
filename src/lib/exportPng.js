import { siteConfig } from "./site.js";

const TRANSPARENT = /^(rgba\(0, 0, 0, 0\)|transparent)$/;
const px = (value) => Number.parseFloat(value) || 0;

export const siteHost = () => new URL(siteConfig.url).host;

export function snapshotFilename({ page, step }) {
    const slug = String(page)
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
    return `dsa-visualizer-${slug}${Number.isInteger(step) ? `-step-${step}` : ""}.png`;
}

export function captionFor({ name, step, total }) {
    const parts = [name];
    if (Number.isInteger(step) && Number.isInteger(total) && total > 1) parts.push(`step ${step} of ${total}`);
    parts.push(siteHost());
    return parts.filter(Boolean).join(" · ");
}

const isVisible = (style, rect) =>
    style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;

function effectiveOpacity(element, root) {
    let opacity = 1;
    for (let node = element; node; node = node.parentElement) {
        opacity *= Number.parseFloat(getComputedStyle(node).opacity);
        if (node === root) break;
    }
    return Number.isFinite(opacity) ? opacity : 1;
}

function collectBoxes(root) {
    const boxes = [];
    [root, ...root.querySelectorAll("*")].forEach((element, order) => {
        if (element.closest("svg")) return;
        const style = getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        if (!isVisible(style, rect)) return;
        const fill = TRANSPARENT.test(style.backgroundColor) ? null : style.backgroundColor;
        const borderWidth = px(style.borderTopWidth);
        const stroke = borderWidth > 0 && !TRANSPARENT.test(style.borderTopColor) ? style.borderTopColor : null;
        if (!fill && !stroke) return;
        boxes.push({
            rect,
            fill,
            stroke,
            borderWidth,
            dashed: style.borderTopStyle === "dashed",
            radius: px(style.borderTopLeftRadius),
            opacity: effectiveOpacity(element, root),
            z: Number.parseInt(style.zIndex, 10) || 0,
            order,
        });
    });
    return boxes.sort((a, b) => a.z - b.z || a.order - b.order);
}

function collectText(root) {
    const texts = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const content = node.textContent.replace(/\s+/g, " ");
        const parent = node.parentElement;
        if (!content.trim() || !parent || parent.closest("svg")) continue;
        const style = getComputedStyle(parent);
        const range = document.createRange();
        range.selectNodeContents(node);
        const rect = range.getBoundingClientRect();
        if (!isVisible(style, rect) || rect.width < 2) continue;
        texts.push({
            content,
            rect,
            color: style.color,
            font: `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`,
            opacity: effectiveOpacity(parent, root),
        });
    }
    return texts;
}

function backgroundOf(element) {
    for (let node = element; node; node = node.parentElement) {
        const background = getComputedStyle(node).backgroundColor;
        if (!TRANSPARENT.test(background)) return background;
    }
    return "#ffffff";
}

function unionOf(rootRect, items) {
    let left = rootRect.left;
    let top = rootRect.top;
    let right = rootRect.right;
    let bottom = rootRect.bottom;
    for (const { rect } of items) {
        left = Math.min(left, rect.left);
        top = Math.min(top, rect.top);
        right = Math.max(right, rect.right);
        bottom = Math.max(bottom, rect.bottom);
    }
    return { left, top, width: right - left, height: bottom - top };
}

function roundedPath(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    const r = Math.max(0, Math.min(radius, width / 2, height / 2));
    if (typeof ctx.roundRect === "function") ctx.roundRect(x, y, width, height, r);
    else ctx.rect(x, y, width, height);
}

function drawBox(ctx, box, dx, dy) {
    const { rect } = box;
    const x = rect.left + dx;
    const y = rect.top + dy;
    ctx.globalAlpha = box.opacity;
    if (box.fill) {
        roundedPath(ctx, x, y, rect.width, rect.height, box.radius);
        ctx.fillStyle = box.fill;
        ctx.fill();
    }
    if (box.stroke) {
        const inset = box.borderWidth / 2;
        roundedPath(ctx, x + inset, y + inset, rect.width - box.borderWidth, rect.height - box.borderWidth, box.radius - inset);
        ctx.lineWidth = box.borderWidth;
        ctx.strokeStyle = box.stroke;
        ctx.setLineDash(box.dashed ? [4, 3] : []);
        ctx.stroke();
        ctx.setLineDash([]);
    }
}

function drawText(ctx, text, dx, dy) {
    ctx.globalAlpha = text.opacity;
    ctx.font = text.font;
    ctx.fillStyle = text.color;
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.fillText(text.content, text.rect.left + dx, text.rect.top + dy + text.rect.height / 2);
}

export async function renderNodeToCanvas(node, { caption, scale = 2, padding = 24 } = {}) {
    await document.fonts.ready;
    await Promise.all(node.getAnimations({ subtree: true }).map((animation) => animation.finished.catch(() => {})));
    const boxes = collectBoxes(node);
    const texts = collectText(node);
    const area = unionOf(node.getBoundingClientRect(), [...boxes, ...texts]);
    const captionHeight = caption ? 26 : 0;
    const width = Math.ceil(area.width + padding * 2);
    const height = Math.ceil(area.height + padding * 2 + captionHeight);
    const canvas = document.createElement("canvas");
    canvas.width = width * scale;
    canvas.height = height * scale;
    const ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);
    ctx.fillStyle = backgroundOf(node);
    ctx.fillRect(0, 0, width, height);
    const dx = padding - area.left;
    const dy = padding - area.top;
    for (const box of boxes) drawBox(ctx, box, dx, dy);
    for (const text of texts) drawText(ctx, text, dx, dy);
    if (caption) {
        const rootStyle = getComputedStyle(document.documentElement);
        ctx.globalAlpha = 1;
        ctx.font = `500 12px ${getComputedStyle(document.body).fontFamily}`;
        ctx.fillStyle = rootStyle.getPropertyValue("--text-subtle").trim() || "#64748b";
        ctx.textBaseline = "middle";
        ctx.textAlign = "left";
        ctx.fillText(caption, padding, height - padding / 2 - captionHeight / 2 + 4);
    }
    return canvas;
}

export async function exportNodeAsPng(node, { filename = "snapshot.png", ...options } = {}) {
    const canvas = await renderNodeToCanvas(node, options);
    const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) return null;
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return blob;
}
