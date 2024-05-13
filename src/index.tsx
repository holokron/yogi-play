import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css/animate.compat.css";
import "@/index.css";
import { createRoot } from "react-dom/client";
import App, { APP_VERSION } from "@/App";
import { config } from "@/lib/config";

if ("production" === config.nodeEnv && config.sentryDSN) {
  require("@sentry/browser").init({
    dsn: config.sentryDSN,
    release: APP_VERSION,
  });
}

const container = document.getElementById("root");
const root = createRoot(container as HTMLElement);

root.render(<App />);
