import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import DataStructuresPage from "./pages/data-structures/DataStructuresPage";
import AlgorithmsPage from "./pages/algorithms/AlgorithmsPage";
import TwoDArrayVisualizer from "./pages/data-structures/arrays/TwoDArray";
import LinkedList from "./pages/data-structures/linked-list/LinkedList";
import Stack from "./pages/data-structures/stack/Stack";
import Queue from "./pages/data-structures/queue/Queue";
import Tree from "./pages/data-structures/tree/Tree";
import Graph from "./pages/data-structures/graph/Graph";
import Sorting from "./pages/algorithms/sorting/Sorting";
import Searching from "./pages/algorithms/searching/Searching";
import GraphAlgorithms from "./pages/algorithms/graph/GraphAlgorithms";
import DynamicProgramming from "./pages/algorithms/dp/DynamicProgramming";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />

        {/* Data Structures Routes */}
        <Route path="/data-structures" element={<DataStructuresPage />} />
        <Route path="/data-structures/arrays" element={<TwoDArrayVisualizer />} />
        <Route path="/data-structures/linked-list" element={<LinkedList />} />
        <Route path="/data-structures/stack" element={<Stack />} />
        <Route path="/data-structures/queue" element={<Queue />} />
        <Route path="/data-structures/tree" element={<Tree />} />
        <Route path="/data-structures/graph" element={<Graph />} />

        {/* Algorithms Routes */}
        <Route path="/algorithms" element={<AlgorithmsPage />} />
        <Route path="/algorithms/sorting" element={<Sorting />} />
        <Route path="/algorithms/searching" element={<Searching />} />
        <Route path="/algorithms/graph" element={<GraphAlgorithms />} />
        <Route path="/algorithms/dp" element={<DynamicProgramming />} />
      </Routes>
    </Router>
  );
}

export default App;
