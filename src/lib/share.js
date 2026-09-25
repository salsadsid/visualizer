import { PAD_TOKEN } from "./array/parser.js";
import { parseArrayInput } from "./algorithms/presets.js";

const MAX_LENGTH = 2000;
const COLOR = /^#[0-9a-f]{6}$/i;

const validCell = (v) =>
    typeof v === "number" || typeof v === "string" || typeof v === "boolean" || v === null;

function toBase64Url(text) {
    const bytes = new TextEncoder().encode(text);
    const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
    return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(encoded) {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const bytes = Uint8Array.from(atob(padded), (ch) => ch.charCodeAt(0));
    return new TextDecoder().decode(bytes);
}

function readHash(hash) {
    if (typeof hash !== "string" || !hash.startsWith("#")) return null;
    return new URLSearchParams(hash.slice(1));
}

function trimPadding(matrix) {
    return matrix.map((row) => {
        let end = row.length;
        while (end > 0 && row[end - 1] === PAD_TOKEN) end--;
        return row.slice(0, end);
    });
}

export function encodeGrid({ matrix, colors = {}, showIndices = false }) {
    const payload = { v: 1, m: trimPadding(matrix) };
    const c = Object.fromEntries(
        Object.entries(colors).filter(([, value]) => typeof value === "string" && COLOR.test(value))
    );
    if (Object.keys(c).length > 0) payload.c = c;
    if (showIndices) payload.i = true;
    const encoded = toBase64Url(JSON.stringify(payload));
    return encoded.length > MAX_LENGTH ? null : `#g=${encoded}`;
}

export function decodeGrid(hash) {
    const encoded = readHash(hash)?.get("g");
    if (!encoded || encoded.length > MAX_LENGTH) return null;
    let payload;
    try {
        payload = JSON.parse(fromBase64Url(encoded));
    } catch (_) {
        return null;
    }
    if (!payload || payload.v !== 1 || !Array.isArray(payload.m) || payload.m.length === 0) return null;
    if (!payload.m.every((row) => Array.isArray(row) && row.every(validCell))) return null;
    const colors = {};
    if (payload.c && typeof payload.c === "object" && !Array.isArray(payload.c)) {
        for (const [key, value] of Object.entries(payload.c)) {
            if (typeof value === "string" && COLOR.test(value)) colors[key] = value;
        }
    }
    return { matrix: payload.m, colors, showIndices: payload.i === true };
}

export function encodeSort({ values, step = 0 }) {
    const at = Number.isFinite(step) && step > 0 ? Math.floor(step) : 0;
    return `#a=${values.join(",")}&s=${at}`;
}

export function readStep(hash) {
    const step = Number.parseInt(readHash(hash)?.get("s") ?? "0", 10);
    return Number.isFinite(step) && step > 0 ? step : 0;
}

export function readPoint(hash, name) {
    const raw = readHash(hash)?.get(name);
    if (!raw || !/^\d+,\d+$/.test(raw)) return null;
    return raw.split(",").map(Number);
}

export function readVariant(hash) {
    const raw = readHash(hash)?.get("v");
    return raw && /^[a-z][a-z0-9-]*$/.test(raw) ? raw : null;
}

export function decodeSort(hash) {
    const a = readHash(hash)?.get("a");
    if (!a) return null;
    const { values } = parseArrayInput(a);
    if (!values) return null;
    return { values, step: readStep(hash) };
}
