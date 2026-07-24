import { Routes, Route } from "react-router-dom";
import Home from "./page/Home.tsx";
import Workspace from "./page/workspace";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/workspace" element={<Workspace />} />
    </Routes>
  );
}