import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import MakeMoney from "./pages/makeMoney";
import Rank from "./pages/rank";
import "./App.css";

function Navigation() {
  return (
    <nav>
      <div>
        <div>
          <Link to="/">Money</Link>
        </div>
        <div>
          <Link to="/rank">Rank</Link>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <div>
      <Navigation />
      <Routes>
        <Route path="/" element={<MakeMoney />} />
        <Route path="/rank" element={<Rank />} />
      </Routes>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
