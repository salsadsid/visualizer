import { ImageResponse } from "next/og";

export const alt = "DSA Visualizer — interactive data structures & algorithms";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The logo mark, rebuilt with flexbox divs (Satori doesn't render SVG gradients).
function Mark({ box = 76 }) {
    const pad = Math.round(box * 0.18);
    const barW = Math.round(box * 0.16);
    const bars = [0.42, 0.62, 0.82];
    const opacities = [0.75, 0.88, 1];
    return (
        <div
            style={{
                width: box,
                height: box,
                borderRadius: Math.round(box * 0.23),
                background: "linear-gradient(135deg, #6366F1 0%, #A855F7 50%, #EC4899 100%)",
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "center",
                gap: Math.round(box * 0.09),
                paddingBottom: pad,
                paddingTop: pad,
            }}
        >
            {bars.map((h, i) => (
                <div
                    key={i}
                    style={{
                        width: barW,
                        height: Math.round((box - pad * 2) * h + pad),
                        background: "#fff",
                        opacity: opacities[i],
                        borderRadius: barW / 2,
                    }}
                />
            ))}
        </div>
    );
}

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
                        "radial-gradient(ellipse 70% 60% at 12% -5%, rgba(99,102,241,0.55) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 100% 110%, rgba(236,72,153,0.45) 0%, transparent 55%), linear-gradient(135deg, #09090b 0%, #18181b 100%)",
                    color: "#fafafa",
                    fontFamily: "sans-serif",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "18px" }}>
                    <Mark box={72} />
                    <div style={{ display: "flex", fontSize: "30px", fontWeight: 700 }}>
                        <span>DSA</span>
                        <span style={{ color: "#a1a1aa", fontWeight: 600, marginLeft: "10px" }}>
                            Visualizer
                        </span>
                    </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
                    <div
                        style={{
                            fontSize: "62px",
                            fontWeight: 800,
                            lineHeight: 1.08,
                            letterSpacing: "-0.025em",
                            display: "flex",
                            flexDirection: "column",
                        }}
                    >
                        <span>Data structures &amp; algorithms,</span>
                        <span style={{ color: "#c084fc" }}>brought to life.</span>
                    </div>
                    <div
                        style={{
                            fontSize: "30px",
                            color: "#a1a1aa",
                            maxWidth: "920px",
                            lineHeight: 1.35,
                        }}
                    >
                        Step through Bubble, Selection &amp; Insertion sort with animated
                        bars, live variables, and pseudocode. Free &amp; interactive.
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
                    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                        <div style={{ display: "flex", gap: "6px", alignItems: "flex-end" }}>
                            {[18, 26, 34].map((h, i) => (
                                <div
                                    key={i}
                                    style={{
                                        width: "12px",
                                        height: `${h}px`,
                                        borderRadius: "4px",
                                        background:
                                            "linear-gradient(180deg, #818cf8 0%, #ec4899 100%)",
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
