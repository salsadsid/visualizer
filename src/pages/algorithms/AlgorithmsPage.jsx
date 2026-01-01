import { Link } from "react-router-dom";

const AlgorithmsPage = () => {
    const algorithms = [
        {
            title: "Sorting",
            description: "Visualize sorting algorithms like Bubble, Quick, Merge sort",
            link: "/algorithms/sorting",
            icon: "🔄",
            status: "coming-soon",
        },
        {
            title: "Searching",
            description: "Binary search, linear search visualizations",
            link: "/algorithms/searching",
            icon: "🔍",
            status: "coming-soon",
        },
        {
            title: "Graph Algorithms",
            description: "BFS, DFS, Dijkstra's, and more",
            link: "/algorithms/graph",
            icon: "🗺️",
            status: "coming-soon",
        },
        {
            title: "Dynamic Programming",
            description: "Visualize DP problems and solutions",
            link: "/algorithms/dp",
            icon: "💎",
            status: "coming-soon",
        },
    ];

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <div className="container mx-auto px-4 py-16">
                <div className="mb-8">
                    <Link
                        to="/"
                        className="inline-flex items-center text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors"
                    >
                        <svg
                            className="w-5 h-5 mr-2"
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
                        Back to Home
                    </Link>
                </div>

                <header className="text-center mb-16">
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Algorithms
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                        Watch algorithms in action with step-by-step visualizations
                    </p>
                </header>

                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {algorithms.map((algo, index) => (
                        <Link
                            key={index}
                            to={algo.link}
                            className="group relative overflow-hidden rounded-xl bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            {algo.status === "coming-soon" && (
                                <div className="absolute top-4 right-4 bg-yellow-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                                    Coming Soon
                                </div>
                            )}
                            <div className="p-6">
                                <div className="text-5xl mb-4">{algo.icon}</div>
                                <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-white">
                                    {algo.title}
                                </h2>
                                <p className="text-slate-600 dark:text-slate-300 text-sm">
                                    {algo.description}
                                </p>
                                <div className="mt-4 flex items-center text-purple-600 dark:text-purple-400 font-semibold text-sm">
                                    {algo.status === "active" ? "Open" : "Preview"}
                                    <svg
                                        className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </main>
    );
};

export default AlgorithmsPage;
