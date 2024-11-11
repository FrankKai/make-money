import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Link, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const [activeComponents, setActiveComponents] = useState<Record<string, any>>(
    {}
  );

  React.useEffect(() => {
    setActiveComponents((prev) => ({
      ...prev,
      [location.pathname]: true,
    }));
  }, [location]);

  const renderComponent = (path: string, Component: React.FC) => {
    return activeComponents[path] ? (
      <div style={{ display: location.pathname === path ? "block" : "none" }}>
        <Component />
      </div>
    ) : null;
  };

  return (
    <div>
      <Navigation />
      <div>
        {renderComponent("/", MakeMoney)}
        {renderComponent("/rank", Rank)}
      </div>
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
