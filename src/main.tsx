import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Link, useLocation } from "react-router-dom";
import "./App.css";
import { routes } from "./routes";

function Navigation() {
  return (
    <nav>
      <div>
        {routes.map((route) => (
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
  const [activeComponents, setActiveComponents] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
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
        {routes.map((route) => renderComponent(route.path, route.component))}
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
