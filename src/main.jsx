import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import { ThemeProvider } from "./ThemeContext.jsx";
import App from "./App.jsx";
import "./index.css";

// Sin React.StrictMode: su doble montaje en desarrollo crea dos contextos
// WebGL para el <Canvas> del mapa 3D, lo que puede agotar el limite de
// contextos simultaneos del navegador y disparar "Context Lost".
ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <HashRouter>
      <App />
    </HashRouter>
  </ThemeProvider>
);
