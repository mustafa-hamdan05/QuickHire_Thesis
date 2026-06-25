import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./style.css";

const API_URL = "https://quickhire-backend-5jdz.onrender.com/api";

function WakeBanner() {
  const [state, setState] = React.useState("checking"); // checking | slow | ready

  React.useEffect(() => {
    let done = false;
    const start = Date.now();
    const slowTimer = setTimeout(() => { if (!done) setState("slow"); }, 3500);

    const ping = () => {
      fetch(`${API_URL}/tasks`)
        .then((r) => {
          if (!r.ok) throw new Error("not ok");
          done = true;
          clearTimeout(slowTimer);
          setState("ready");
        })
        .catch(() => {
          if (!done && Date.now() - start < 60000) setTimeout(ping, 2500);
        });
    };
    ping();

    return () => clearTimeout(slowTimer);
  }, []);

  if (state !== "slow") return null;
  return (
    <div className="wakeBanner">
      Waking up the server… the first load can take up to ~30 seconds on free hosting. Thanks for your patience.
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <WakeBanner />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
