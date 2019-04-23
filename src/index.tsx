import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css/animate.min.css";
import "./icons";
import "react-app-polyfill/ie11";
import "core-js-pure/features/object/keys";
import "core-js-pure/features/object/values";
import * as React from "react";
import * as ReactDOM from "react-dom";
import "./icons";
import App, { APP_VERSION } from "./App";

if ("production" === process.env.NODE_ENV && process.env.REACT_APP_SENTRY_DSN) {
  require("@sentry/browser").init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    release: APP_VERSION
  });
}

ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);
