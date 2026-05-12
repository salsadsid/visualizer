"use client";
import { useMemo, useState } from "react";
import PageShell from "@/components/layout/PageShell";
import BackLink from "@/components/layout/BackLink";
import Footer from "@/components/layout/Footer";
import InputPanel from "@/components/array/InputPanel";
import ArrayGrid from "@/components/array/ArrayGrid";
import ColorSettings from "@/components/array/ColorSettings";
import LearningPanel from "@/components/array/LearningPanel";
import { PRESETS } from "@/lib/array/presets";
import { parseInput } from "@/lib/array/parser";

export default function TwoDArrayVisualizer() {
    const [inputValue, setInputValue] = useState("");
    const [colors, setColors] = useState({});
    const [showIndices, setShowIndices] = useState(false);

    const { matrix, maxLen, error } = useMemo(
        () => parseInput(inputValue),
        [inputValue]
    );

    const hasData = matrix.length > 0;

    const applyPreset = (key) => {
        const preset = PRESETS[key];
        if (!preset) return;
        setInputValue(JSON.stringify(preset.build(), null, 2));
    };

    const setColor = (key, value) => {
        setColors((prev) => ({ ...prev, [key]: value }));
    };

    return (
        <PageShell>
            <nav className="mb-6">
                <BackLink href="/" label="Back to home" />
            </nav>

            <header className="mb-8 text-center">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full surface-muted">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-accent text-white">
                        [[2D]]
                    </span>
                    <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
                        Array Visualizer
                    </h1>
                </div>
                <p className="mt-3 text-sm text-muted max-w-lg mx-auto">
                    Paste any 2D array as JSON, pick colors for each value, and explore
                    how matrices map to a grid.
                </p>
            </header>

            <div className="grid lg:grid-cols-[400px_1fr] gap-5 lg:h-[min(70vh,640px)]">
                <InputPanel
                    value={inputValue}
                    error={error}
                    onChange={setInputValue}
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

            <div className="mt-5">
                <LearningPanel />
            </div>

            <Footer />
        </PageShell>
    );
}
