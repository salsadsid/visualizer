import { SORTERS } from "@/lib/algorithms/sorting";

export function Costs({ algo }) {
    const { best, average, worst, space, stable } = SORTERS[algo].complexity;
    const cells = [
        ["Best", best],
        ["Average", average],
        ["Worst", worst],
        ["Extra memory", space],
        ["Stable", stable],
    ];
    return (
        <dl className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
            {cells.map(([label, value]) => (
                <div key={label} className="surface-muted rounded-lg px-3 py-2">
                    <dt className="text-[11px] uppercase tracking-wide text-subtle">{label}</dt>
                    <dd className="font-mono text-sm text-text">{value}</dd>
                </div>
            ))}
        </dl>
    );
}

export function Trace({ caption, rows }) {
    return (
        <div className="surface-muted rounded-lg overflow-x-auto custom-scrollbar">
            <table className="w-full text-sm">
                <caption className="sr-only">{caption}</caption>
                <thead>
                    <tr className="border-b border-token text-subtle text-xs uppercase tracking-wide">
                        <th scope="col" className="text-left px-3 py-2 font-medium">When</th>
                        <th scope="col" className="text-left px-3 py-2 font-medium">The list</th>
                        <th scope="col" className="text-left px-3 py-2 font-medium">What happened</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(([when, list, note], index) => (
                        <tr
                            key={when}
                            className={index !== rows.length - 1 ? "border-b border-token" : undefined}
                        >
                            <th scope="row" className="text-left px-3 py-2 font-medium text-text whitespace-nowrap">
                                {when}
                            </th>
                            <td className="px-3 py-2 font-mono text-text whitespace-nowrap">{list}</td>
                            <td className="px-3 py-2">{note}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
