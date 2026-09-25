"use client";
import { useMemo, useRef, useState } from "react";
import InputPanel from "@/components/array/InputPanel";
import ArrayGrid from "@/components/array/ArrayGrid";
import ColorSettings from "@/components/array/ColorSettings";
import { useCopyLink } from "@/components/engagement/useCopyLink";
import { useLocationHash } from "@/components/engagement/useLocationHash";
import { PRESETS, formatMatrix } from "@/lib/array/presets";
import { parseInput } from "@/lib/array/parser";
import { decodeGrid, encodeGrid } from "@/lib/share";
import { TOOLS } from "@/lib/catalog";
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
