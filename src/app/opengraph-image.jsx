import { ImageResponse } from "next/og";

export const alt = "DSA Visualizer — Interactive 2D Array Playground";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    padding: "72px",
                    background:
                        "radial-gradient(ellipse 60% 50% at 20% 0%, #6366f1 0%, transparent 60%), linear-gradient(135deg, #09090b 0%, #18181b 100%)",
                    color: "#fafafa",
                    fontFamily: "sans-serif",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div
                        style={{
                            background: "#6366f1",
                            color: "white",
                            padding: "8px 14px",
                            borderRadius: "10px",
                            fontSize: "24px",
                            fontWeight: 700,
                            letterSpacing: "0.02em",
                        }}
                    >
                        [[2D]]
                    </div>
                    <div style={{ fontSize: "24px", color: "#a1a1aa" }}>
                        dsa-visualizer
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    <div
                        style={{
                            fontSize: "84px",
                            fontWeight: 700,
                            lineHeight: 1.05,
                            letterSpacing: "-0.025em",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <span>See your data structures.</span>
                        <span style={{ color: "#818cf8" }}>Color by color.</span>
                    </div>
                    <div
                        style={{
                            fontSize: "32px",
                            color: "#a1a1aa",
                            maxWidth: "900px",
                            lineHeight: 1.3,
                        }}
                    >
                        Interactive 2D array playground. Paste JSON, color values, learn
                        with C++, Python, JavaScript, and TypeScript snippets.
                    </div>
                </div>

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        fontSize: "22px",
                        color: "#71717a",
                    }}
                >
                    <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
                        <div
                            style={{
                                display: "flex",
                                gap: "6px",
                                alignItems: "center",
                            }}
                        >
                            {[0, 1, 2].map((i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: "26px",
                                        height: "26px",
                                        borderRadius: "6px",
                                        background:
                                            i === 0
                                                ? "#6366f1"
                                                : i === 1
                                                ? "#10b981"
                                                : "#f59e0b",
                                    }}
                                />
                            ))}
                        </div>
                        <span>Free · Open source · MIT</span>
                    </div>
                    <div>by @salsadsid</div>
                </div>
            </div>
        ),
        { ...size }
    );
}
