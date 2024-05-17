import { FC, PropsWithChildren } from "react";
import { ThemeProvider } from "./components/ThemeProvider";
import { Provider } from "react-redux";
import configureStore from "./store";
import { BrowserRouter } from "react-router-dom";

const store = configureStore();

export const ContextProviders: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <BrowserRouter>{children}</BrowserRouter>
      </Provider>
    </ThemeProvider>
  );
};
