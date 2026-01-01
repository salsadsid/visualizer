import Link from "next/link";

const HomePage = () => {
  const categories = [
    {
      title: "Data Structures",
      description: "Visualize and understand fundamental data structures",
      link: "/data-structures",
      icon: "📊",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Algorithms",
      description: "Watch algorithms come to life with step-by-step visualization",
      link: "/algorithms",
      icon: "⚡",
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-16">
        <header className="text-center mb-16">
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            DSA Visualizer
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Interactive visualizations to help you master Data Structures and
            Algorithms
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={category.link}
              className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
              ></div>
              <div className="p-8">
                <div className="text-6xl mb-4">{category.icon}</div>
                <h2 className="text-3xl font-bold mb-3 text-slate-800 dark:text-white">
                  {category.title}
                </h2>
                <p className="text-slate-600 dark:text-slate-300">
                  {category.description}
                </p>
                <div className="mt-6 flex items-center text-blue-600 dark:text-blue-400 font-semibold">
                  Explore
                  <svg
                    className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <footer className="text-center mt-16 text-slate-600 dark:text-slate-400">
          <a
            href="https://github.com/salsadsid"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            © Salman Sadik Siddiquee
          </a>
        </footer>
      </div>
    </main>
  );
};

export default HomePage;
