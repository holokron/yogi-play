import "animate.css";
import "@/index.css";
import { createRoot } from "react-dom/client";
import App from "@/App";
import { config } from "@/lib/config";
import "@/lib/app";

if ("production" === config.nodeEnv && config.sentryDSN) {
  import("@/sentry").then(({ initSentry }) => {
    initSentry();
  });
}

const container = document.getElementById("root");
const root = createRoot(container as HTMLElement);

root.render(<App />);
