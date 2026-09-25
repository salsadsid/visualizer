"use client";
import { createContext, useContext, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { useLocationHash } from "@/components/engagement/useLocationHash";
import { ARRAY_PRESETS, DEFAULT_VALUES } from "@/lib/algorithms/presets";
import { decodeSort } from "@/lib/share";
import { track } from "@/lib/analytics";

const SortingInputContext = createContext(null);

export function useSortingInput() {
    return useContext(SortingInputContext);
}

export default function SortingInputProvider({ children, tool = "sorting" }) {
    const hash = useLocationHash();
    const pathname = usePathname();
    const shared = useMemo(() => decodeSort(hash), [hash]);
    const [prevHash, setPrevHash] = useState(hash);
    const [size, setSize] = useState(shared ? shared.values.length : DEFAULT_VALUES.length);
    const [presetKey, setPresetKey] = useState(null);
    const [values, setValues] = useState(shared ? shared.values : DEFAULT_VALUES);
    const [sharedStep, setSharedStep] = useState(
        shared ? { index: shared.step, path: pathname } : null
    );
    const [learnTab, setLearnTab] = useState("concept");
    const [codeLang, setCodeLang] = useState(null);

    if (hash !== prevHash) {
        setPrevHash(hash);
        if (shared) {
            setPresetKey(null);
            setSize(shared.values.length);
            setValues(shared.values);
            setSharedStep({ index: shared.step, path: pathname });
        } else {
            setSharedStep(null);
        }
    }

    const input = useMemo(() => {
        const applyPreset = (key) => {
            track("preset_select", { tool, preset: key });
            setPresetKey(key);
            setSharedStep(null);
            setValues(ARRAY_PRESETS[key].build(size));
        };
        const shuffle = () => {
            track("preset_select", { tool, preset: "shuffle" });
            setPresetKey("random");
            setSharedStep(null);
            setValues(ARRAY_PRESETS.random.build(size));
        };
        const changeSize = (n) => {
            const key = presetKey || "random";
            setPresetKey(key);
            setSharedStep(null);
            setSize(n);
            setValues(ARRAY_PRESETS[key].build(n));
        };
        const applyCustom = (vals) => {
            track("custom_input", { tool, size: vals.length });
            setPresetKey(null);
            setSharedStep(null);
            setSize(vals.length);
            setValues(vals);
        };
        const clearSharedStep = () => setSharedStep(null);
        return {
            size,
            values,
            sharedStep,
            clearSharedStep,
            learnTab,
            codeLang,
            setLearnTab,
            setCodeLang,
            applyPreset,
            shuffle,
            changeSize,
            applyCustom,
        };
    }, [size, presetKey, values, sharedStep, learnTab, codeLang, tool]);

    return <SortingInputContext.Provider value={input}>{children}</SortingInputContext.Provider>;
}
