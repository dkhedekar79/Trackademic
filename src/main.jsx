import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import AppLoadingScreen from "./components/AppLoadingScreen";
import "./styles/index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Suspense fallback={<LoadingScreen />}>
    <App />
  </Suspense>
);
