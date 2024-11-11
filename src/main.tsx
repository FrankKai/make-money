import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Link, useLocation } from "react-router-dom";
import MakeMoney from "./pages/makeMoney";
import Rank from "./pages/rank";
import "./App.css";

const routes = [
  { path: "/", label: "Money", component: MakeMoney },
  { path: "/rank", label: "Rank", component: Rank }
] as const;

function Navigation() {
  return (
    <nav>
      <div>
        {routes.map(route => (
          <div key={route.path}>
            <Link to={route.path}>{route.label}</Link>
          </div>
        ))}
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
      {routes.map(route => renderComponent(route.path, route.component))}
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
