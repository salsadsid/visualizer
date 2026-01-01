import { Link } from "react-router-dom";

const DataStructuresPage = () => {
    const dataStructures = [
        {
            title: "Arrays",
            description: "2D Array Visualizer with customizable colors",
            link: "/data-structures/arrays",
            icon: "🔢",
            status: "active",
        },
        {
            title: "Linked List",
            description: "Visualize singly and doubly linked lists",
            link: "/data-structures/linked-list",
            icon: "🔗",
            status: "coming-soon",
        },
        {
            title: "Stack",
            description: "LIFO data structure visualization",
            link: "/data-structures/stack",
            icon: "📚",
            status: "coming-soon",
        },
        {
            title: "Queue",
            description: "FIFO data structure visualization",
            link: "/data-structures/queue",
            icon: "🎫",
            status: "coming-soon",
        },
        {
            title: "Tree",
            description: "Binary trees and BST visualization",
            link: "/data-structures/tree",
            icon: "🌳",
            status: "coming-soon",
        },
        {
            title: "Graph",
            description: "Graph representation and traversal",
            link: "/data-structures/graph",
            icon: "🕸️",
            status: "coming-soon",
        },
    ];

    return (
        <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
            <div className="container mx-auto px-4 py-16">
                <div className="mb-8">
                    <Link
                        to="/"
                        className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
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
                    <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                        Data Structures
                    </h1>
                    <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                        Explore and visualize fundamental data structures
                    </p>
                </header>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                    {dataStructures.map((ds, index) => (
                        <Link
                            key={index}
                            to={ds.link}
                            className="group relative overflow-hidden rounded-xl bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            {ds.status === "coming-soon" && (
                                <div className="absolute top-4 right-4 bg-yellow-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                                    Coming Soon
                                </div>
                            )}
                            <div className="p-6">
                                <div className="text-5xl mb-4">{ds.icon}</div>
                                <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-white">
                                    {ds.title}
                                </h2>
                                <p className="text-slate-600 dark:text-slate-300 text-sm">
                                    {ds.description}
                                </p>
                                <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 font-semibold text-sm">
                                    {ds.status === "active" ? "Open" : "Preview"}
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

export default DataStructuresPage;
