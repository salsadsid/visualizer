"use client";
import { useMemo, useRef, useState } from "react";
import InputPanel from "@/components/array/InputPanel";
import ArrayGrid from "@/components/array/ArrayGrid";
import ColorSettings from "@/components/array/ColorSettings";
import { useCopyLink } from "@/components/engagement/useCopyLink";
import { useLocationHash } from "@/components/engagement/useLocationHash";
import { PRESETS, formatMatrix } from "@/lib/array/presets";
import { parseArrayInput } from "@/lib/algorithms/presets";
import { parseInput } from "@/lib/array/parser";
import TrackedLink from "@/components/analytics/TrackedLink";
import { TRAVERSAL_LIST } from "@/lib/array/traversals";
import { GRID_ALGORITHM_LIST } from "@/lib/array/gridAlgorithms";
import { decodeGrid, encodeGrid, encodeSort } from "@/lib/share";
import { TOOLS, gridPageFor, traversalPageFor } from "@/lib/catalog";
import { track } from "@/lib/analytics";
import { siteConfig } from "@/lib/site";

const PAGE_URL = `${siteConfig.url}${TOOLS.arrays.path}`;

export default function ArrayVisualizer() {
    const hash = useLocationHash();
    const shared = useMemo(() => decodeGrid(hash), [hash]);
    const [prevHash, setPrevHash] = useState(hash);
    // Start on the chess board rather than a blank textarea: the beginner sees a grid
    // (and why grids matter) before touching anything. Deterministic → hydration-safe.
    const [inputValue, setInputValue] = useState(() =>
        formatMatrix(shared ? shared.matrix : PRESETS.chess.build())
    );
    const [colors, setColors] = useState(() => (shared ? shared.colors : {}));
    const [showIndices, setShowIndices] = useState(() => shared?.showIndices ?? false);
    const [copied, copy] = useCopyLink();
    const editedRef = useRef(false);

    if (hash !== prevHash) {
        setPrevHash(hash);
        if (shared) {
            setInputValue(formatMatrix(shared.matrix));
            setColors(shared.colors);
            setShowIndices(shared.showIndices);
        }
    }

    const { matrix, maxLen, error, note, format } = useMemo(
        () => parseInput(inputValue),
        [inputValue]
    );

    const hasData = matrix.length > 0;

    const shareUrl = useMemo(() => {
        if (matrix.length === 0) return null;
        const encoded = encodeGrid({ matrix, colors, showIndices });
        return encoded ? `${PAGE_URL}${encoded}` : null;
    }, [matrix, colors, showIndices]);

    const gridHash = useMemo(() => encodeGrid({ matrix }) ?? "", [matrix]);

    const applyPreset = (key) => {
        const preset = PRESETS[key];
        if (!preset) return;
        track("preset_select", { tool: "arrays", preset: key });
        setInputValue(formatMatrix(preset.build()));
    };

    const handleInput = (value) => {
        if (!editedRef.current) {
            editedRef.current = true;
            track("custom_input", { tool: "arrays" });
        }
        setInputValue(value);
    };

    const setColor = (key, value) => {
        setColors((prev) => ({ ...prev, [key]: value }));
    };

    const copyLink = () => {
        track("share_click", { tool: "arrays", from: "input" });
        copy(shareUrl);
    };

    const oneDLink = useMemo(() => {
        if (matrix.length !== 1) return null;
        const { values } = parseArrayInput(matrix[0].join(","));
        if (!values) return null;
        return {
            href: `${TOOLS.arrays1d.path}${encodeSort({ values })}`,
            label: "Open it in the 1D Array Visualizer →",
            params: { tool: "arrays1d", from: "arrays_note" },
        };
    }, [matrix]);

    const shareTitle = !hasData
        ? "Type or pick a grid first"
        : shareUrl
          ? "Copy a link that opens this grid"
          : "This grid is too large to share as a link";

    return (
        <>
            <div className="grid lg:grid-cols-[400px_1fr] gap-5 lg:h-[min(70vh,640px)]">
                <InputPanel
                    value={inputValue}
                    error={error}
                    note={note}
                    noteLink={oneDLink}
                    format={format}
                    onChange={handleInput}
                    onPreset={applyPreset}
                    onShare={shareUrl ? copyLink : null}
                    shareTitle={shareTitle}
                    copied={copied}
                />
                <ArrayGrid
                    matrix={matrix}
                    maxLen={maxLen}
                    colors={colors}
                    showIndices={showIndices}
                />
            </div>

            {hasData && (
                <nav
                    aria-label="Traverse this grid"
                    className="mt-4 flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-2 text-sm"
                >
                    <span className="text-subtle mr-1">Traverse this grid:</span>
                    {TRAVERSAL_LIST.map((t) => (
                        <TrackedLink
                            key={t.key}
                            href={`${traversalPageFor(t.key).path}${gridHash}`}
                            scroll={false}
                            onClick={() => window.scrollTo(0, 0)}
                            event="tool_open"
                            params={{ tool: "traversals", algo: t.key, from: "arrays" }}
                            className="px-2.5 py-1 rounded-full bg-accent-soft border border-accent/20 font-medium text-accent hover:bg-accent/15 transition-colors focus-ring"
                        >
                            {t.label}
                        </TrackedLink>
                    ))}
                </nav>
            )}

            {hasData && (
                <nav
                    aria-label="Run on this grid"
                    className="mt-2 flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-2 text-sm"
                >
                    <span className="text-subtle mr-1">Run on this grid:</span>
                    {GRID_ALGORITHM_LIST.map((a) => (
                        <TrackedLink
                            key={a.key}
                            href={`${gridPageFor(a.key).path}${gridHash}`}
                            scroll={false}
                            onClick={() => window.scrollTo(0, 0)}
                            event="tool_open"
                            params={{ tool: "grid", algo: a.key, from: "arrays" }}
                            className="px-2.5 py-1 rounded-full bg-accent-soft border border-accent/20 font-medium text-accent hover:bg-accent/15 transition-colors focus-ring"
                        >
                            {a.label}
                        </TrackedLink>
                    ))}
                </nav>
            )}

            {hasData && (
                <div className="mt-5">
                    <ColorSettings
                        matrix={matrix}
                        colors={colors}
                        onColorChange={setColor}
                        showIndices={showIndices}
                        onToggleIndices={() => setShowIndices((v) => !v)}
                    />
                </div>
            )}
        </>
    );
}
