"use client";
import { useMemo, useRef, useState } from "react";
import InputPanel from "@/components/array/InputPanel";
import ArrayGrid from "@/components/array/ArrayGrid";
import ColorSettings from "@/components/array/ColorSettings";
import { PRESETS, formatMatrix } from "@/lib/array/presets";
import { parseInput } from "@/lib/array/parser";
import { track } from "@/lib/analytics";

export default function ArrayVisualizer() {
    // Start on the chess board rather than a blank textarea: the beginner sees a grid
    // (and why grids matter) before touching anything. Deterministic → hydration-safe.
    const [inputValue, setInputValue] = useState(() =>
        formatMatrix(PRESETS.chess.build())
    );
    const [colors, setColors] = useState({});
    const [showIndices, setShowIndices] = useState(false);
    const editedRef = useRef(false);

    const { matrix, maxLen, error, note, format } = useMemo(
        () => parseInput(inputValue),
        [inputValue]
    );

    const hasData = matrix.length > 0;

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
