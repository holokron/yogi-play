import "bootstrap/dist/css/bootstrap.min.css";
import "animate.css/animate.min.css";
import "./icons";
import "react-app-polyfill/ie11";
import "core-js-pure/features/object/keys";
import "core-js-pure/features/object/values";
import * as React from "react";
import * as ReactDOM from "react-dom";
import "./icons";
import App from "./App";

if (process.env.NODE_ENV !== "production") {
  const { whyDidYouUpdate } = require("why-did-you-update");
  whyDidYouUpdate(React);
}

ReactDOM.render(<App />, document.getElementById("root") as HTMLElement);
