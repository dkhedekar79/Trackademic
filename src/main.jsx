import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AppLoadingScreen from "./components/AppLoadingScreen";
import { initPerformanceTracking } from "./utils/performance";
import "./styles/index.css";

// Initialize performance tracking
initPerformanceTracking();

ReactDOM.createRoot(document.getElementById("root")).render(
  <Suspense fallback={<AppLoadingScreen />}>
    <App />
  </Suspense>
);
