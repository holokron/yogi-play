import { FC, PropsWithChildren } from "react";
import { ThemeProvider } from "./components/ThemeProvider";
import { BrowserRouter } from "react-router";

export const ContextProviders: FC<PropsWithChildren> = ({ children }) => {
  return (
    <ThemeProvider>
      <BrowserRouter>{children}</BrowserRouter>
    </ThemeProvider>
  );
};
