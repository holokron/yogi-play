import * as React from "react";
import * as ReactRouterDom from "react-router-dom";
import * as Enzyme from "enzyme";
import EnzymeAdapter from "enzyme-adapter-react-16";
import "./icons";

Enzyme.configure({
  adapter: new EnzymeAdapter()
});
