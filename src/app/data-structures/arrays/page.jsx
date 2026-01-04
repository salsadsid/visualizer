"use client";
import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/cn";
import Arrow from "@/components/Arrow";

const TwoDArrayVisualizer = () => {
    const [ar, setAr] = useState([]);
    const [err, setErr] = useState(false);
    const [colors, setColors] = useState({});
    let len = ar?.length;
    let maxLen = Math.max(...ar.map((row) => row.length, len));

    //
    const isAtleastOneElement =
        ar?.length > 0 && ar.some((row) => row.length > 0);

    const handle2DArray = (e) => {
        const value = e.target.value;

        try {
            setErr(false);

            // Basic validation
            if (value === "") {
                setAr([]);
                setErr(false);
                return;
            } else if (value === "[" || value === "]") {
                setAr([]);
                setErr(false);
                return;
            } else if (value === "[]" || value === "[[" || value === "]]") {
                setAr([]);
                setErr(false);
                return;
            } else if (value === "[[]" || value === "[]]") {
                setAr([]);
                setErr(false);
                return;
            } else if (value === "[[]]") {
                setAr([]);
                setErr(false);
                return;
            } else if (value === "[[],[]]") {
                setAr([]);
                setErr(false);
                return;
            } else if (value === "[[],[],[]]") {
                setAr([]);
                setErr(false);
                return;
            }
            const arr = JSON.parse(value) || [];

            // Check if input is a 2D array
            const is2DArray =
                Array.isArray(arr) && arr.every((row) => Array.isArray(row));

            const len = arr.length;

            // Check if input is a square array
            const isSquareArray = arr.every(
                (row) =>
                    row.length === len &&
                    row.every((col) => typeof col === "number" || typeof col === "string")
            );

            if (isSquareArray) {
                setAr(arr);
            } else if (is2DArray) {
                try {
                    // 2D array modification
                    const maxLen = Math.max(...arr.map((row) => row.length, len));
                    const modArr = arr?.map((row) => {
                        const holesCount = maxLen - row.length;
                        for (let i = 0; i < holesCount; i++) {
                            row.push("X");
                        }
                        return row;
                    });
                    setAr(modArr);
                } catch (error) {
                    console.log(error);
                    setErr(true);
                }
            }
        } catch (err) {
            console.log(err);
            setErr(true);
        }
    };

    // Handle color selection
    const handleSetColor = (e, cellValue) => {
        const value = e.target.value;
        setColors((colors) => ({ ...colors, [cellValue]: value }));
    };

    return (
        <main className="min-h-screen w-full bg-slate-50 dark:bg-[#0f172a] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))] text-slate-900 dark:text-slate-200 font-sans selection:bg-indigo-500/30 transition-colors duration-300">
            <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl h-screen flex flex-col">
                <nav className="flex items-center justify-between mb-6 md:mb-8 flex-shrink-0">
                    <Link
                        href="/data-structures"
                        className="group flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
                    >
                        <div className="p-2 rounded-full bg-slate-200 dark:bg-white/5 group-hover:bg-slate-300 dark:group-hover:bg-white/10 transition-colors border border-slate-300 dark:border-white/10">
                            <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                                />
                            </svg>
                        </div>
                        <span className="font-medium">Back to Data Structures</span>
                    </Link>
                </nav>

                <header className="mb-8 text-center flex-shrink-0">
                    <div className="inline-block p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 mb-4 backdrop-blur-sm">
                        <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-lg bg-indigo-500 text-white font-bold text-sm tracking-wide shadow-lg shadow-indigo-500/20">
                                2D ELEMENTS
                            </span>
                            <span className="w-px h-6 bg-indigo-300 dark:bg-indigo-500/30"></span>
                            <h1 className="text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 dark:from-white dark:via-indigo-200 dark:to-indigo-400 tracking-tight">
                                Array Visualizer
                            </h1>
                        </div>
                    </div>
                </header>

                <div className="flex-1 flex flex-col min-h-0 space-y-6">
                    <div className="flex flex-col md:flex-row gap-6 items-start flex-1 min-h-0">
                        {/* Input Section */}
                        <div className="w-full md:w-[320px] lg:w-[400px] h-[400px] md:h-full flex flex-col space-y-6 flex-shrink-0">
                            <div className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-white/10 p-5 shadow-xl dark:shadow-2xl h-full flex flex-col transition-all">
                                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                                    <h3 className="text-base font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                                        <div className="w-2 h-2 rounded-full bg-emerald-500 dark:bg-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                        Input Array
                                    </h3>
                                    <span className="text-xs font-mono text-slate-500 dark:text-slate-500 px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">JSON</span>
                                </div>

                                <div className="relative group flex-grow min-h-0">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-0 dark:opacity-20 group-hover:opacity-20 dark:group-hover:opacity-100 transition duration-500 blur"></div>
                                    <textarea
                                        placeholder={`[\n  [0, 1, 0],\n  [1, 1, 0],\n  [1, 1, 1]\n]`}
                                        className="relative w-full h-full bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-emerald-400 font-mono text-sm leading-relaxed p-4 rounded-xl border border-slate-200 dark:border-slate-800 focus:border-indigo-500 dark:focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-700"
                                        onChange={handle2DArray}
                                        spellCheck="false"
                                    />
                                </div>

                                {err && (
                                    <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center gap-2 text-red-600 dark:text-red-400 text-sm flex-shrink-0">
                                        <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Invalid JSON format
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Visualization Section */}
                        <div className="flex-1 w-full h-[400px] md:h-full">
                            <div className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-200 dark:border-white/10 p-6 md:p-8 shadow-xl dark:shadow-2xl h-full flex items-center justify-center relative overflow-hidden transition-all">
                                <div className="w-full h-full overflow-auto flex items-center justify-center custom-scrollbar">
                                    {!isAtleastOneElement ? (
                                        <div className="text-center space-y-4 max-w-sm">
                                            <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                                <svg className="w-10 h-10 text-indigo-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                                </svg>
                                            </div>
                                            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">Ready to Visualize</h3>
                                            <p className="text-slate-500 dark:text-slate-400">Enter a 2D array in the input box to verify and see your custom visualization.</p>
                                        </div>
                                    ) : (
                                        <div className={cn(
                                            "transition-all duration-500 ease-out",
                                            maxLen ? "scale-100 opacity-100" : "scale-90 opacity-0"
                                        )}>
                                            <div
                                                className={`grid gap-3`}
                                                style={{ gridTemplateColumns: `repeat(${maxLen}, minmax(0, 1fr))` }}
                                            >
                                                {ar.map((row, i) =>
                                                    row.map((col, j) => (
                                                        <div
                                                            key={`${i}-${j}`}
                                                            className={cn(
                                                                "w-14 h-14 md:w-20 md:h-20 flex justify-center items-center text-xl md:text-2xl font-bold rounded-xl md:rounded-2xl shadow-md transform transition-all duration-300 hover:scale-110 hover:shadow-xl hover:z-10 cursor-default",
                                                                !colors[col] && "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-white",
                                                                col === "X" && "bg-slate-100 dark:bg-slate-800/30 text-slate-400 dark:text-slate-600 border-2 border-dashed border-slate-300 dark:border-slate-700"
                                                            )}
                                                            style={{
                                                                backgroundColor: colors[col],
                                                                borderColor: col !== "X" ? (colors["border"] || undefined) : undefined,
                                                                borderWidth: col !== "X" ? '2px' : undefined,
                                                                color: colors["textColor"] || (col === "X" ? undefined : (!colors[col] ? undefined : 'white')),
                                                                textShadow: colors[col] ? '0 2px 4px rgba(0,0,0,0.3)' : 'none',
                                                                boxShadow: colors[col] ? `0 8px 20px -6px ${colors[col]}` : undefined
                                                            }}
                                                        >
                                                            {col}
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Settings Section - Now Full Width Below */}
                    {isAtleastOneElement && (
                        <div className="bg-white/80 dark:bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-200 dark:border-white/10 p-6 shadow-xl dark:shadow-2xl animate-in fade-in slide-in-from-bottom-4 duration-500 flex-shrink-0">
                            <div className="flex flex-col md:flex-row gap-8">
                                <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-slate-200 dark:border-white/10 pb-6 md:pb-0 md:pr-6">
                                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        Base Styling
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="group relative bg-slate-100 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer">
                                            <label className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1 block">Border</label>
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-8 h-8 rounded-lg overflow-hidden ring-2 ring-slate-200 dark:ring-white/10 group-hover:ring-indigo-500/50 transition-all">
                                                    <input
                                                        type="color"
                                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] p-0 border-0 cursor-pointer"
                                                        defaultValue="#ffeb3b"
                                                        onChange={(e) => handleSetColor(e, "border")}
                                                    />
                                                </div>
                                                <span className="text-sm text-slate-600 dark:text-slate-300 font-mono">Color</span>
                                            </div>
                                        </div>
                                        <div className="group relative bg-slate-100 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 transition-all cursor-pointer">
                                            <label className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1 block">Text</label>
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-8 h-8 rounded-lg overflow-hidden ring-2 ring-slate-200 dark:ring-white/10 group-hover:ring-indigo-500/50 transition-all">
                                                    <input
                                                        type="color"
                                                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] p-0 border-0 cursor-pointer"
                                                        onChange={(e) => handleSetColor(e, "textColor")}
                                                    />
                                                </div>
                                                <span className="text-sm text-slate-600 dark:text-slate-300 font-mono">Color</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="md:w-2/3">
                                    <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                        </svg>
                                        Element Colors
                                    </h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                                        {ar.flat(Infinity)
                                            .filter((value, index, array) => array.indexOf(value) === index)
                                            ?.map((value, index) => (
                                                <div key={index} className="group relative bg-slate-100 dark:bg-slate-800/50 rounded-xl p-3 border border-slate-200 dark:border-white/5 hover:border-indigo-500/30 transition-all">
                                                    <div className="flex flex-col items-center gap-2">
                                                        <span className="text-lg font-bold text-slate-700 dark:text-white truncate max-w-full">{value}</span>
                                                        <div className="relative w-full h-8 rounded-lg overflow-hidden ring-2 ring-slate-200 dark:ring-white/10 group-hover:ring-indigo-500/50 transition-all">
                                                            <input
                                                                type="color"
                                                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] p-0 border-0 cursor-pointer"
                                                                onChange={(e) => handleSetColor(e, value)}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <footer className="mt-8 border-t border-slate-200 dark:border-white/10 pt-6 flex-shrink-0">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                            <span>&copy; {new Date().getFullYear()}</span>
                            <a href="https://github.com/salsadsid" target="_blank" className="text-slate-700 dark:text-white hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors">
                                Salman Sadik Siddiquee
                            </a>
                        </div>
                        <a
                            href="https://github.com/salsadsid/array-visualizer"
                            target="_blank"
                            className="group flex items-center gap-3 bg-white/50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 px-5 py-2.5 rounded-full transition-all border border-slate-200 dark:border-white/10"
                        >
                            <img src="/github-mark-white.png" alt="" className="w-5 opacity-80 group-hover:opacity-100 transition-opacity invert dark:invert-0" />
                            <span className="text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white font-medium">Star on GitHub</span>
                        </a>
                    </div>
                </footer>
            </div>
        </main>
    );
};

export default TwoDArrayVisualizer;
