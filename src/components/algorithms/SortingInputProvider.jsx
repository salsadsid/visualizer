"use client";
import { createContext, useContext, useMemo, useState } from "react";
import { ARRAY_PRESETS, DEFAULT_VALUES } from "@/lib/algorithms/presets";
import { track } from "@/lib/analytics";

const SortingInputContext = createContext(null);

export function useSortingInput() {
    return useContext(SortingInputContext);
}

export default function SortingInputProvider({ children }) {
    const [size, setSize] = useState(DEFAULT_VALUES.length);
    const [presetKey, setPresetKey] = useState(null);
    const [values, setValues] = useState(DEFAULT_VALUES);
    const [learnTab, setLearnTab] = useState("concept");
    const [codeLang, setCodeLang] = useState(null);

    const input = useMemo(() => {
        const applyPreset = (key) => {
            track("preset_select", { tool: "sorting", preset: key });
            setPresetKey(key);
            setValues(ARRAY_PRESETS[key].build(size));
        };
        const shuffle = () => {
            track("preset_select", { tool: "sorting", preset: "shuffle" });
            setPresetKey("random");
            setValues(ARRAY_PRESETS.random.build(size));
        };
        const changeSize = (n) => {
            const key = presetKey || "random";
            setPresetKey(key);
            setSize(n);
            setValues(ARRAY_PRESETS[key].build(n));
        };
        const applyCustom = (vals) => {
            track("custom_input", { tool: "sorting", size: vals.length });
            setPresetKey(null);
            setSize(vals.length);
            setValues(vals);
        };
        return {
            size,
            values,
            learnTab,
            codeLang,
            setLearnTab,
            setCodeLang,
            applyPreset,
            shuffle,
            changeSize,
            applyCustom,
        };
    }, [size, presetKey, values, learnTab, codeLang]);

    return <SortingInputContext.Provider value={input}>{children}</SortingInputContext.Provider>;
}
